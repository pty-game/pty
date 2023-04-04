This repo contains 3 modules:

`server` - contains abstract logic for `competition games`: connecting players, send/receive player/estimators actions, storing game results and user achivements etc.

`painty-client` - UI with the `painty` game logic

`painty-client` - UI with the `paint competition` game logic (browser game, where several players competits with painting skills)

`DanceCliNew` - UI with the `dance competition` game logic (mobile app game, where several players competits with dancing skills using camera)
 

To run app locally, first need to setup NGINX server:

```
server { 
       listen 80; 

       server_name pty.dev; 


       location / { 
               proxy_pass http://127.0.0.1:3005; 
       } 
} 

server { 
       listen 1338; 

       server_name pty.dev; 


       location / { 
               proxy_pass http://127.0.0.1:1337; 
               #ws 
               proxy_http_version 1.1; 
               proxy_set_header Upgrade $http_upgrade; 
               proxy_set_header Connection "upgrade"; 
       } 
}
```
Then install dependencies and run each service:

```
npm i && npm start
```
