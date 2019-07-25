const rp = require('request-promise');
const cheerio = require('cheerio');


let baseUrl = "https://ingram.life/tag/"

const Scraper = async function(keyword) {
    let k = encodeURI(keyword);
    let url = baseUrl + k;
    let html = await rp(url);
    let $ = cheerio.load(html);
    let obj = $('h3').text().match(/\d+/)
    if(obj !== null) {
        return parseInt(obj[0]);
    }
    return 0;
};

module.exports = Scraper;
