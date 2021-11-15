const jsdom = require("jsdom");
const express = require('express')
var CSON = require('cson')
const pretty = require('pretty');
const path = require('path');
const bodyParser = require('body-parser')
const {  setupApi } = require('./api');
const app = express();
const { LOCAL_BLOG_DIR, getArticleSync, deleteArticle, getAllTags, getAllCategories, getArticlesByTag, getArticlesByCategory, getAllSnippets, getSnippet } = require('./fsUtil'); 

const port = 5555;
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000 }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(LOCAL_BLOG_DIR + '/images')));


const { downloadFile, getListArticles, saveFileSync } = require('./fsUtil');

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '../build/index.html'))
);

setupApi(app);
app.post('/saveChanges', (request, response) => {
    const content = request.body.content;
    const fileName = request.body.fileName;
    saveArticle(fileName, content )
})

app.post('/list', (request, response) => {
    const articles = getListArticles();
    response.send({
        articles
    });
})
app.post('/article', (request, response) => {
    const id = request.body.id;
    const article = getArticleSync(id);
    response.send({
        article
    });
})
app.post('/deleteArticle', (request, response) => {
    const id = request.body.id;
    if(id) {
        deleteArticle(id)
        response.send({
            message: 'successfully delete'
        });
    } else {
        response.send({
            message: 'article id is not specify'
        });
    }
})



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
