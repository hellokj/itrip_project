const rp = require('request-promise');
const cheerio = require('cheerio');


let baseUrl = "https://www.imgrumtag.com/search?query="

const Scraper = async function(keyword) {
    let k = encodeURI(keyword);
    let url = baseUrl + k;
    let html = await rp(url);
    let $ = cheerio.load(html);
    let obj = $('p', '.user-details').text()
    // match(/\d+/)
    if(obj !== null) {
        let base = obj.split(' ')[0];
        let product = 1;
        if(base.includes('k')) {
            product = 1000;
        }
        else if(base.includes('m')) {
            product = 1000000;
        }
        return parseInt(base.match(/(\d+(\.\d+)?)/)[0] * product);
    }
    return 0;
};

module.exports = Scraper;
