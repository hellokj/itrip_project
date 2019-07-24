const rp = require('request-promise');
const cheerio = require('cheerio');


let baseUrl = "https://ingram.life/tag/"

const Scraper = async function(keyword) {
    let k = encodeURI(keyword);
    let url = baseUrl + k;
    let html = await rp(url);
    let $ = cheerio.load(html);
    let obj = parseInt($('h3').text().match(/\d+/)[0]);
    return obj;
};

module.exports = Scraper;
