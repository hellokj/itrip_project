var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');

let baseUrl = "https://ingram.life/tag/"

let keyword = encodeURI('咖啡')

const getPostNum = () => {
    let num;
    request({
        url: baseUrl + keyword,
        method: "GET"
        }, function(error, response, body) {
            if (error || !body) {
            return;
            }
        var $ = cheerio.load(body);
        var result = [];
        var titles = $("h3");
        for(var i=0;i<titles.length;i++) {
            
            result.push($(titles[i]).text());
        }
        num =  JSON.stringify(result).match(/(\d+)/);
    });
    return num;
}

let result = getPostNum();
console.log(result);