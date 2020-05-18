#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "OneWire.h"
#include "DallasTemperature.h"
#include "net_misc.h"



const int climatisationPin = 19;
const int chauffagePin = 21;
const int photoPin = A0;
const int tempPin = 23;
OneWire tempOneWire(tempPin);
DallasTemperature tempSensor(&tempOneWire);



// Systeme
bool automatique = false;
bool climatisation = false;
bool chauffage = false;
float seuilClimatisationJour = 25.0;
float seuilClimatisationNuit = 21.0;
float seuilChauffageJour = 18.0;
float seuilChauffageNuit = 16.0;
int seuilJourNuit = 100;
const int32_t pub_period = 10 * 1000l; // Publication period



WiFiClient espClient;
PubSubClient client(espClient);
String whoami;



const char *mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
#define TOPIC_ADHESION "luciolesbleues/adhesions" // id
#define TOPIC_ACTION "luciolesbleues/actions" // target, field, value
#define TOPIC_ANSWER "luciolesbleues/answers" // id, field, value
#define TOPIC_SENSOR "luciolesbleues/sensors" // id, sensor, value



void print_connection_status() {
  Serial.print("WiFi status : \n");
  Serial.print("\tIP address : ");
  Serial.println(WiFi.localIP());
  Serial.print("\tMAC address : ");
  Serial.println(WiFi.macAddress());
}

void connect_wifi() {
  const char *ssid = "";
  const char *password = "";

  Serial.println("Connection WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Attempting to connect WiFi ...");
    delay(1000);
  }

  Serial.println("Connected to local WiFi\n");
  print_connection_status();
}



void setup() {
  pinMode(climatisationPin, OUTPUT);
  pinMode(chauffagePin, OUTPUT);

  Serial.begin(9600);

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqtt_pubcallback);

  whoami = String(WiFi.macAddress());
}



void mqtt_pubcallback(char *topic, byte *message, unsigned int length) {
  String messageTemp;
  for (int i = 0; i < length; i++) {
    messageTemp += (char)message[i];
  }

  Serial.print("Message : ");
  Serial.println(messageTemp);
  Serial.print("arrived on topic : ");
  Serial.println(topic);

  if (String(topic) == TOPIC_ACTION) {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &root = jsonBuffer.parseObject(messageTemp);
    
    if (!root.success()) {
      Serial.println("parseObject() failed");
      return;
    }

    String target = root["target"];
    if (target == whoami) {
      String field = root["field"];
      if (field == "automatique") {
        bool value = root["value"];

        climatisation = false;
        chauffage = false;
        automatique = value;
      } else if (field == "climatisation") {
        bool value = root["value"];

        automatique = false;
        climatisation = value;
        if (value) {
          chauffage = false;
        }
      } else if (field == "chauffage") {
        bool value = root["value"];

        automatique = false;
        chauffage = value;
        if (value) {
          climatisation = false;
        }
      } else if (field == "seuilClimatisationJour") {
        float value = root["value"];

        seuilClimatisationJour = value;
      } else if (field == "seuilChauffageJour") {
        float value = root["value"];

        seuilChauffageJour = value;
      } else if (field == "seuilClimatisationNuit") {
        float value = root["value"];

        seuilClimatisationNuit = value;
      } else if (field == "seuilChauffageNuit") {
        float value = root["value"];

        seuilChauffageNuit = value;
      } else if (field == "seuilJourNuit") {
        int value = root["value"];

        seuilJourNuit = value;
      }
    }
  }
}

void mqtt_subscribe(char *topic) {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    const int idLength = 17;
    char id[idLength];
    whoami.toCharArray(id, idLength);

    if (client.connect(id, "", "")) {
      Serial.println("connected");
      client.subscribe(topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      delay(5 * 1000);
    }
  }
}

void pub_data() {
  char data[80];
  String payload;

  payload = "{\"id\":\"";
  payload += whoami;
  payload += "\",\"sensor\":\"temp\",\"value\":";
  payload += get_temperature();
  payload += "}";

  payload.toCharArray(data, (payload.length() + 1));
  client.publish(TOPIC_SENSOR, data);

  payload = "{\"id\":\"";
  payload += whoami;
  payload += "\",\"sensor\":\"light\",\"value\":";
  payload += get_light();
  payload += "}";

  payload.toCharArray(data, (payload.length() + 1));
  client.publish(TOPIC_SENSOR, data);

  payload = "{\"id\":\"";
  payload += whoami;
  payload += "\",\"sensor\":\"wifi\",\"value\":";
  payload += get_wifi_strength();
  payload += "}";

  payload.toCharArray(data, (payload.length() + 1));
  client.publish(TOPIC_SENSOR, data);
}



// Accesseurs
float get_temperature() {
  float temperature;
  tempSensor.requestTemperaturesByIndex(0);
  temperature = tempSensor.getTempCByIndex(0);
  return temperature;
}

float get_light() {
  return analogRead(photoPin);
}

float get_wifi_strength() {
  return WiFi.RSSI();
}

void set_pin(int pin, int val) {
  digitalWrite(pin, val);
}

int get_pin(int pin) {
  return digitalRead(pin);
}



void process_data() {
  int light = get_light();
  int temp = get_temperature();

  if (automatique) {
    if (light < seuilJourNuit) { // Night
      if (temp < seuilChauffageNuit) { // Too cold
        set_pin(climatisationPin, LOW);
        set_pin(chauffagePin, HIGH);
      } else if (temp > seuilClimatisationNuit) { // Too hot
        set_pin(climatisationPin, HIGH);
        set_pin(chauffagePin, LOW);
      }
    } else { // Day
      if (temp < seuilChauffageJour) { // Too cold
        set_pin(climatisationPin, LOW);
        set_pin(chauffagePin, HIGH);
      } else if (temp > seuilClimatisationJour) { // Too hot
        set_pin(climatisationPin, HIGH);
        set_pin(chauffagePin, LOW);
      }
    }
  } else {
    if (climatisation) {
      set_pin(climatisationPin, HIGH);
      set_pin(chauffagePin, LOW);
    } else if (chauffage) {
      set_pin(climatisationPin, LOW);
      set_pin(chauffagePin, HIGH);
    }
  }
}



void loop() {
  if (!client.connected()) {
    mqtt_subscribe((char *)(TOPIC_ACTION));
  }

  pub_data();

  process_data();

  delay(pub_period);
  client.loop();
}
