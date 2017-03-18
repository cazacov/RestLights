# RestLights
Light Organ with REST interface

![REST Lights](https://github.com/cazacov/RestLights/blob/master/img/green.jpg?raw=true)

#Software Installation

Start with the latest version of Raspbian (tested with ver. 2016-11-25)

### Update packages

```
sudo apt-get update
sudo apt-get upgrade
```

### Install Node.js and npm

#### Raspberry Pi A/A+, B/B+ (ARM v6)

```
sudo su -
cd /opt
wget http://nodejs.org/dist/latest-v6.x/node-v6.9.2-linux-armv6l.tar.gz
tar -xvf node-v6.9.2-linux-armv6l.tar.gz
ln -s node-v6.9.2-linux-armv6l node
chmod a+rw /opt/node/lib/node_modules
chmod a+rw /opt/node/bin
echo 'PATH=$PATH:/opt/node/bin' > /etc/profile.d/node.sh
rm /usr/bin/node
ln -s  /opt/node/bin/node /usr/bin/node
^D
```

#### Raspberry 2,3
TBD


Logout and log in back.  

Check if Node is up-to-date: 

```
node --version
npm --version
```

#LED lamps

Lamps are controlled by transistor keys connected to GPIO pins as following:


| Light        | Pin number on the board | GPIO number |
| ------------- | -------------:| -----:|
| Green | 12	 | 18 |
| Yellow | 18| 24 |
| Blue | 16 | 23 |
| Blue 2 | 15 | 22 |
| Red | 7 | 4 |
| Orange | 13 | 27 | 
 
##GPIO pinout

<img src="https://github.com/cazacov/RestLights/blob/master/img/pinout.png?raw=true" alt="Raspberry Pi" width="352" height="359"/>


##Circuits

Every lamps is controlled by its own transistor BC 373-40 connected as following:

<img src="https://github.com/cazacov/RestLights/blob/master/img/LED%20transistor.png?raw=true" alt="Lamp connection" />

There are also two 5mm LEDs showing the status. One is connected to 5V pin and is always on when the Raspebrry is powerd. Another LED is activated by GPIO 25 (physical pin 22) when the program is started.

<img src="https://github.com/cazacov/RestLights/blob/master/img/LEDs.png?raw=true" alt="Status LEDs" />
 
  
