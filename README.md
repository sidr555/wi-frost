# wi-frost


## MQTT server Mosquitto + Docker
docker pull eclipse-mosquitto
docker run -it --name mosquitto -p 1883:1883 eclipse-mosquitto
docker stop mosquitto
docker start mosquitto


## MQTT client
curl https://raw.githubusercontent.com/shirou/mqttcli/master/install.sh | sh

### SUB
~/bin/mqttcli sub --conf ~/.mqttcli.cfg -t wifrost/temp

### PUB
~/bin/mqttcli pub --conf ~/.mqttcli.cfg -t wifrost/config -m "gutten tag"

### ~/.mqttcli.cfg
{
    "host": "localhost",
    "port": "1883"
    "username": "wuser"
    "password": "wuserp"
}
~ 
