# Beastie
Customer Management System for Pet shop

# GetStarted
##### Requirement
node
npm
mongoDB

##### Installation
```
npm run install:all
```
##### Development
```
npm run dev:front
npm run dev:back
```
##### Production
```
npm run beastie
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

##### Templates
```
/client/src
gulp module --name AngularModuleName --parent ParentFolder
gulp component --name AngularModuleName --parent ParentFolder

/routes
gulp route --name RouteName --parent ParentFolder
```

# Todo
