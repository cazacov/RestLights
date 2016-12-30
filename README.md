# RestLights
Light Organ with REST interface

#Installation

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