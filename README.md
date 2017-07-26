# Beastie
Customer Management System for Pet shop

[Demo @ Heroku](https://goldax-beastie.herokuapp.com/)
```bash
ID: admin
PW: admin
```

# GetStarted
##### Requirement
node
npm
mongoDB
nssm (window service)

##### Installation
```
npm run install:all
npm run init
```
##### Development
```
npm run dev:front
npm run dev:back
```
##### Production
```
npm run build
npm run start
```

##### ssl
```
mkdir ssl && cd ssl  
openssl version  
openssl genrsa -des3 -out server.enc.key 1024  
openssl req -new -key server.enc.key -out server.csr  
openssl rsa -in server.enc.key -out server.key  
openssl x509 -req -days 36500 -in server.csr -signkey   server.key -out server.crt  
```
[self assigned ssl](http://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate)

##### Templates
```
/client/src
types [module, component, service, dialogService, route]
gulp temp --type [type] --name [name] --parent [parentFolder]
```

# Notes
```
chrome://flags/#overscroll-history-navigation
```
```
brew install libusb --universal
```

# cloud9 change timezone
```
sudo dpkg-reconfigure tzdata
```
