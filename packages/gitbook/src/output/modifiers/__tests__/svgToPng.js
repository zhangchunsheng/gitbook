const cheerio = require('cheerio');
const tmp = require('tmp');
const path = require('path');

const svgToImg = require('../svgToImg');
const svgToPng = require('../svgToPng');

describe('svgToPng', function() {
    let dir;

    beforeEach(function() {
        dir = tmp.dirSync();
    });

    it('should write svg as png file', function() {
        const $ = cheerio.load('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1"><rect width="200" height="100" stroke="black" stroke-width="6" fill="green"/></svg>');
        const fileName = 'index.html';

        return svgToImg(dir.name, fileName, $)
        .then(function() {
            return svgToPng(dir.name, fileName, $);
        })
        .then(function() {
            const $img = $('img');
            const src = $img.attr('src');

            expect(dir.name).toHaveFile(src);
            expect(path.extname(src)).toBe('.png');
        });
    });
});

