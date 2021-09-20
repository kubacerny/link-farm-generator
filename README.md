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
