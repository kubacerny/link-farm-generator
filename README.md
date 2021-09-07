# link-farm-generator
Nachtmans link farm generator

## For production

Create VM

Install `NGINX` - will manage https redirects to http, SSL certificates,...

Install `nvm`, `node`

Install dependencies using `npm install`

Set `NODE_ENV='production'`

## PM2 process manager

1. Install pm2 by running the following command

`npm install -g pm2`

2. Set up pm2 to start the server automatically on server restart.

`pm2 start app.js`
`pm2 save`
`pm2 startup` and copy and paste the text, to create systemd config for pm2 daemon.
