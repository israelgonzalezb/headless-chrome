const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 8080;
const validUrl = require('valid-url');
const { convert } = require('html-to-text');
const { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } = require('node-html-markdown');

var parseUrl = function(url) {
    url = decodeURIComponent(url)
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};

app.get('/text', function(req, res) {
    var urlToLoad = parseUrl(req.query.url);

    if (validUrl.isWebUri(urlToLoad)) {
        console.log('Loading: ' + urlToLoad);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(urlToLoad);
            await page.content().then(function(buffer) {
                //res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
                res.setHeader('Content-Type', 'text/plain');
                res.send(req.query.md ? NodeHtmlMarkdown.translate(buffer) :
                  convert(buffer,{wordwrap: 130, baseElements: { selectors: [ 'body' ] }}))
            });

            await browser.close();
        })();
    } else {
        res.send('Invalid url: ' + urlToLoad);
    }

});qoutes


app.get('/html', function(req, res) {
    var urlToLoad = parseUrl(req.query.url);

    if (validUrl.isWebUri(urlToLoad)) {
        console.log('Loading: ' + urlToLoad);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(urlToLoad);
            await page.content().then(function(buffer) {
                //res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
                res.setHeader('Content-Type', 'text/plain');
                res.send(buffer)
            });

            await browser.close();
        })();
    } else {
        res.send('Invalid url: ' + urlToLoad);
    }

});

app.get('/', function(req, res) {
    var urlToScreenshot = parseUrl(req.query.url);

    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting: ' + urlToScreenshot);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(urlToScreenshot);
            await page.screenshot().then(function(buffer) {
                res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
                res.setHeader('Content-Type', 'image/png');
                res.send(buffer)
            });

            await browser.close();
        })();
    } else {
        res.send('Invalid url: ' + urlToScreenshot);
    }

});



app.listen(port, function() {
    console.log('App listening on port ' + port)
})
