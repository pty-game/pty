nginx config:

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
