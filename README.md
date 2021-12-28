# link-farm-generator
Nachtmans link farm generator

## For production

Create VM (AWS or Hetzner Cloud Server)

As a root: Install `NGINX` - will manage https redirects to http, SSL certificates,...

```sh
apt-get install nginx mc htop git
```

Create ubuntu user with home directory
```
useradd -m ubuntu
# pass your ssh "authorizedKeys" to new home and chmod
su ubuntu
```

As ubuntu user: Install `nvm`, `node`

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
# logout and login again
nvm install node
```

# Checkout project from git

Install dependencies using `npm install`

`export NODE_ENV='production'`

## PM2 process manager

1. Install pm2 by running the following command

```
npm install -g pm2
```

2. Set up pm2 to start the server automatically on server restart. From link-farm-generator folder run

```
pm2 start bin/www
pm2 start bin/www --name "generator"
#pm2 start bin/www --name "admin"
pm2 save
pm2 startup 
# and copy and paste the text, to create systemd config for pm2 daemon.


pm2 ls
pm2 reload bin/www
pm2 delete bin/www

# and do not forget 
pm2 save
```


See [PM2 Keymetrics Cheat Sheet](https://pm2.keymetrics.io/docs/usage/quick-start/) for more commands.

# Nginx config

```
server {
	listen 80;
	listen [::]:80;

	server_name linkfarm.cz;

  	#ssl_certificate     /etc/ssl/certs/server.crt;
    	#ssl_certificate_key /etc/ssl/certs/server.key;
    	location / {
        	proxy_pass http://localhost:3000;
	}
}
```

# Adding SSL using Lets Encrypt
Domain must be DNS routed to your IP address/server where you run your up, to be able to do authorization by serving token. Then run
```
apt-get update
apt-get install certbot
apt-get install python3-certbot-nginx

# create and install to your nginx/sites-enabled/example.com.conf
certbot --nginx -d example.com -d www.example.com

# check you have renewal timer activated
systemctl status certbot.timer
# check that renewal will work
certbot renew --dry-run
#or manually renew after 90 days by
certbot renew
certbot renew --quiet
```

* [Nginx - how to add lets encrypt](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/)
* [Add SSL certificate with lets encrypt to Nginx](https://community.hetzner.com/tutorials/add-ssl-certificate-with-lets-encrypt-to-nginx-on-ubuntu-20-04)
* [Lets encrypt/certbot documentation](https://certbot.eff.org/docs/)

# Auth0 credentials
In admin app create `.env` file with enviroment variables. I.e.
```
BASE_URL='http://localhost:3000'
CLIENT_ID='secret client id'
OAUTH_ISSUER='https://dev-secret-hash.eu.auth0.com'
OAUTH_SECRET='RandomString'
APP_CONFIG_PATH='../config/app-config.json'
```