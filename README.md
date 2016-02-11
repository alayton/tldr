## Server Config

1. Set up nginx (sample config below)
2. Install node.js
3. `npm install -g gulp`
4. In root site directory: `npm install`
5. In root site directory: `gulp`
6. In root site directory: `node server.js`

### Sample nginx config
```
server {
        listen   96.126.114.95:80;

        server_name tldr.alayton.com;

        client_max_body_size 8M;

        location / {
                proxy_set_header Host $host;
                proxy_set_header X-Remote-Ip $remote_addr;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_pass http://127.0.0.1:8000;
        }

        location /asset/ {
                access_log off;
                gzip on;
                gzip_types text/plain application/x-javascript text/css application/json;
                gzip_vary on;
                root /var/www/tldr;
        }
}
```