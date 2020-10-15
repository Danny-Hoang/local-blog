const jsdom = require("jsdom");
const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const request = require('request');
const app = express()
const fs = require('fs');
const port = 5555;
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../build')));

const { v4: uuidv4 } = require('uuid');

const generateFileName = () => uuidv4() + '.png';


const { JSDOM } = jsdom;

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../build/index.html'))
);

app.post('/article', (request, response) => {
    const content = request.body.content;
    const dom = new JSDOM(content);
    
    const imgList = dom.window.document.querySelectorAll("img")
    for (let img of imgList) {
        const fileName = generateFileName();
        const src = img.src;
        img.src = 'static/media/' + fileName;
        download(src, path.join(__dirname, '../build/static/media/') + fileName, () => {
        })

    }
    console.log(dom.window.document.documentElement.innerHTML)
    response.send({
        message: 'Node.js and Express REST API',
        html: dom.window.document.documentElement.innerHTML
    }
    );
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
