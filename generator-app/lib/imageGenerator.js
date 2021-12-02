const utils = require('../lib/utils');
const sharp = require('sharp');

function trimColorFactor(x) {
    if (x < 50) {
        return 50;
    } else if (x > 200) {
        return 200;
    } else {
        return x;
    }
}

module.exports = {
    generateImage(req, res) {
        const pageHashIndex = parseInt(utils.getCRC32(req.url.replace('/', ''))) * Math.random();
        const red = trimColorFactor( pageHashIndex % 256 );
        const green = trimColorFactor( (pageHashIndex / 256 ) % 256 );
        const blue = trimColorFactor( (pageHashIndex / 256 / 256 ) % 256 );
        const alpha = trimColorFactor( (pageHashIndex / 256 / 256 / 256 ) % 256);

        // console.log('Colors r ' + red + ' g ' + green + ' b ' + blue);

        // Image generator using SHARP lib 
        // https://sharp.pixelplumbing.com/api-constructor

        sharp({
            create: {
                width: 640,
                height: 320,
                channels: 4,
                //background: { r: red, g: green, b: blue, alpha: (256-alpha)/256 },
                noise: {
                    type: 'gaussian',
                    mean: 128,
                    sigma: 40
                }
            }
        })
        .flatten({ background: { r: red, g: green, b: blue } })
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