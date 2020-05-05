# iot-project

## Présentation

Ce projet va permettre de gérer une flotte de capteurs intelligents déployée dans un bâtiment et fournissant des informations sur la température, la luminosité et la puissance du signal wifi dans les pièces. Il sera aussi possible d’allumer ou d’éteindre un chauffage ou une climatisation ainsi que l’éclairage.

## Architecture

Un serveur MQTT va permettre de recueillir les informations en provenance des capteurs et de les transmettre au serveur NodeJS.
Un serveur NodeJS va récupérer les données des capteurs et les stocker sur un serveur MongoDB. Il va aussi servir une interface graphique affichant un tableau de bord.
Plusieurs ESP32 vont se connecter à un réseau WiFi puis envoyer et recevoir des informations.

## Flot détaillé

La mise en place des capteurs est simple, il suffit de les programmer en renseignant le nom et le mot de passe du point d’accès sans fil. Il ne reste plus qu’à les brancher dans les pièces que l’on va contrôler.

En accédant ensuite au serveur NodeJS, sur le port correspondant à l’application web, le propriétaire du bâtiment pourra se connecter au compte administrateur et configurer le tableau de bord.

La connection à l’interface d'administration s’effectue avec un nom d’utilisateur et un mot de passe pour les administrateurs et les superviseurs. Chaque utilisateur peut modifier son mot de passe à tout moment dans l’interface d’administration.

La configuration du tableau de bord se déroule de la manière suivante :
Mise en ligne du plan du bâtiment
Placement des capteurs sur le plan en fonction de leurs position réelle
Suppression de capteurs

Un administrateur peut aussi créer d’autres comptes administrateurs ou superviseurs, ainsi que les éditer et les supprimer.

Lorsqu’un superviseur se connecte à l’application, il aura seulement accès au données des ESP32, mais ne pourra pas modifier le tableau de bord ou interagir avec les ces derniers (allumer ou éteindre le chauffage et la climatisation).
En plus d’avoir accès aux mêmes actions qu’un superviseur effectue, un administrateur pourra allumer ou éteindre manuellement le chauffage et la climatisation. Un administrateur pourra aussi définir les valeurs seuil de mise en route du chauffage et de la climatisation.

L’utilisateur va pouvoir visualiser sa flotte d’esp ainsi que les valeurs pour chacun d’eux. Il aura aussi une carte interactive pour chaque type de données (température, wifi, luminosité).

## Contributeurs

* Clément La Selva
* François Martin
