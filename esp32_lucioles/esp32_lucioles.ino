#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h> 
#include <Wire.h>
#include "OneWire.h"
#include "DallasTemperature.h"
#include "net_misc.h"

const int ledPin = 19; 
const int photo_resistor_pin = A0;
OneWire oneWire(23);
DallasTemperature tempSensor(&oneWire);
boolean ledAllumee = false;

WiFiClient espClient; 
PubSubClient client(espClient) ; 

String whoami; 

const char* mqtt_server = "broker.hivemq.com";
#define TOPIC_TEMP "luciolesbleues/sensors/temp"
#define TOPIC_LED "luciolesbleues/sensors/led"
#define TOPIC_LIGHT "luciolesbleues/sensors/light"
#define TOPIC_PING "luciolesbleues/ping"
#define TOPIC_WIFI "luciolesbleues/wifi"


void connect_wifi() {
  const char* ssid = "CB501";
  const char *password= "0000000000";
  
  Serial.println("Connecting Wifi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Attempting to connect Wifi ..");
    delay(1000);
  }
  Serial.print("Connected to local Wifi\n");
  print_connection_status();
}

void print_connection_status() {
  Serial.print("WiFi status : \n");
  Serial.print("\tIP address : ");
  Serial.println(WiFi.localIP());
  Serial.print("\tMAC address : ");
  Serial.println(WiFi.macAddress());
}

void setup () {
  pinMode (ledPin , OUTPUT);
  Serial.begin (9600);
  
  connect_wifi();
  
  client.setServer(mqtt_server, 1883);
  client.setCallback(mqtt_pubcallback) ;

  whoami =  String(WiFi.macAddress());
}

void mqtt_pubcallback(char* topic, byte* message, unsigned int length) {
  String messageTemp ;
  for(int i = 0 ; i < length ; i++) {
    messageTemp += (char) message[i];
  }
  
  Serial.print("Message : ");
  Serial.println(messageTemp);
  Serial.print("arrived on topic : ");
  Serial.println(topic) ;
 
  if(String (topic) == TOPIC_LED) {
    Serial.print("Action : Changing output to ");
    if(messageTemp == "on") {
      Serial.println("on");
      set_pin(ledPin,HIGH);
     
    } else if (messageTemp == "off") {
      Serial.println("off");
      set_pin(ledPin,LOW);
    }
  } else if (String(topic) == TOPIC_PING) {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &root = jsonBuffer.parseObject(messageTemp);
    if (!root.success()) {
      Serial.println("parseObject() failed");
      return;
    }
    String who = root["who"];
    if (who == whoami) {
      ledAllumee = true;
      set_pin(ledPin, HIGH);
    }
  }
}

void mqtt_mysubscribe(char* topic) {
  while(!client.connected()) { 
    Serial.print("Attempting MQTT connection...");
    char id[17];
    whoami.toCharArray(id, 17);
    if(client.connect(id, "try", "try")) {
      Serial.println("connected");
      client.subscribe(topic); 
    } else { 
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      delay(5*1000);
    }
  }
}

float get_temperature() {
  float temperature;
  tempSensor.requestTemperaturesByIndex(0);
  delay (750);
  temperature = tempSensor.getTempCByIndex(0);
  return temperature;
}

float get_light(){
  return analogRead(photo_resistor_pin);
}

float get_wifi_strength(){
  return Wifi.RSSI();
}

void set_pin(int pin, int val){
 digitalWrite(pin, val) ;
}

int get_pin(int pin){
  return digitalRead(pin);
}

void loop () {
  char data[80];
  String payload; 
  int32_t period = 10 * 1000l; 
  
  if (!client.connected()) {
    mqtt_mysubscribe((char*) (TOPIC_PING));
  }
  
  payload = "{\"who\": \"";
  payload += whoami;   
  payload += "\", \"value\": " ;
  payload += get_temperature(); 
  payload += "}";
  
  payload.toCharArray(data, (payload.length() + 1)); 
  Serial.println(data);
  client.publish(TOPIC_TEMP, data);  

  payload = "{\"who\": \"" + whoami + "\", \"value\": " + get_light() + "}";
  payload.toCharArray(data, (payload.length() + 1));
  Serial.println(data);
  client.publish(TOPIC_LIGHT, data);

  payload = "{\"who\": \"" + whoami + "\", \"value\": " + get_wifi_strength() + "}";
  payload.toCharArray(data, (payload.length() + 1));
  Serial.println(data);
  client.publish(TOPIC_WIFI, data);

  if (get_light() < 100 && ledAllumee) {
    ledAllumee = false;
    set_pin(ledPin, LOW);
  }

  delay(period);
  client.loop();
}
