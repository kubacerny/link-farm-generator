const utils = require('../lib/utils');
const sharp = require('sharp');

module.exports = {
    generateImage(req, res) {
        const pageHashIndex = parseInt(req.url.replace('/', ''));
        const red = pageHashIndex % 256;
        const green = (pageHashIndex / 256 ) % 256;
        const blue = (pageHashIndex / 256 / 256 ) % 256;
        const alpha = (pageHashIndex / 256 / 256 / 256 ) % 256;

        // console.log('Colors r ' + red + ' g ' + green + ' b ' + blue);

        // Image generator using SHARP lib 
        // https://sharp.pixelplumbing.com/api-constructor

        sharp({
            create: {
            width: 640,
            height: 320,
            channels: 4,
            background: { r: red, g: green, b: blue, alpha: (256-alpha)/256 }
            }
        })
        .webp({ quality: 80 })
        .toBuffer({ resolveWithObject: true })
        .then(({ data, info }) => {
            // console.log('Creating IMG using Sharp lib: ' + JSON.stringify(info));
            res.type('webp');
            res.send(data);
        })
        .catch(err => {
            console.log('Error when creating IMG using Sharp lib: ' + err);
        });
    }
};