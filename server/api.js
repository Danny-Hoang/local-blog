const util = require('./fsUtil'); 
const jsdom = require("jsdom");
const { v4: uuidv4 } = require('uuid');
const { JSDOM } = jsdom;
const CSON = require('cson')
var pretty = require('pretty');
const { LOCAL_BLOG_DIR } = util;
const fs = require('fs');

const checkSnippetFileExists = (request, response) => {
    const valid = util.checkSnippetExists(request.body.fileName);
    response.send({
        valid
    });
}

const saveSnippetHandler = (request, response) => {
    const { files, content, description } = request.body;
    util.saveSnippet(fileName, content, description);
    response.send({
        message: 'save successfully'
    });
}

const getSnippetHandler = (request, response) => {
    const fileName = request.body.fileName;
    const { snippet, content } = util.getSnippet(fileName);

    response.send({
        snippet,
        content
    });
}

const getAllSnippetHandler = (request, response) => {
    const snippets = util.getAllSnippets();

    response.send({
        snippets
    });
}

const saveArticleHandler = (request, response) => {
    const content = request.body.content;
    const dom = new JSDOM(content);

    const imgList = dom.window.document.querySelectorAll("img")
    for (let img of imgList) {
        const fileName = uuidv4() + '.png';
        const src = img.src;
        img.src = `${fileName}`;
        util.downloadFile(src, `${LOCAL_BLOG_DIR}/images/${fileName}`, () => {})

    }

    const title = dom.window.document.body.firstElementChild.textContent;
    const html = pretty(dom.window.document.documentElement.innerHTML);
    
    const csonString = CSON.createCSONString({
        html,
        tags: [],
        title
    })
    
    const id = uuidv4();
    const fileName = id + '.cson';

    const articles = util.getListArticles();
    articles[id] = {
        title,
        id
    }
    util.saveFileSync('articles.json', JSON.stringify(articles));


    util.saveFileSync(`articles/${fileName}`, csonString);
    response.send({
        message: 'save successfully',
        html,
        id
    });
}

const getAllTagsHandler = (request, response) => {
    const tags = util.getAllTags();
    response.send({
        tags
    });
}

const getAllCategoriesHandler = (request, response) => {
    const categories = util.getAllCategories();
    response.send({
        categories
    });
}

const getArticlesByTagHandler =  (request, response) => {
    const id = request.body.id;
    if(id) {

        const articles = util.getArticlesByTag(id);
        response.send({
            articles
        });
    } else {
        response.send({
            articles: []
        });
    }
}

const getArticlesByCategoryHandler = (request, response) => {
    const id = request.body.id;
    if(id) {

        const articles = util.getArticlesByCategory(id);
        response.send({
            articles
        });
    } else {
        response.send({
            articles: []
        });
    }
}

const createNewGistHandler = (request, response) => {
    const gistID = util.createNewGist();
    
    response.send({
        gistID,
        message: 'successfully',
    });
}

const getGistHandler = (request, response) => {
    const gistID = request.body.id;
    const gistData = util.getGistData();
    util.getGistFiles(gistID, (files) => {

        const data = gistData[gistID];
    
        response.send({
            ...data,
            files
        });
    });
}
const saveGistDesc = (request, response) => {
    const {gistID, description} = request.body;
    
    util.saveGistDesc(gistID, description);
    response.send({
        message: 'sucessfully'
    });
}
const renameGistFileHandler = (request, response) => {
    const { gistID, newName, oldName } = request.body;
    const dirPath = `${LOCAL_BLOG_DIR}/gists/${gistID}`
    fs.renameSync(`${dirPath}/${oldName}`, `${dirPath}/${newName}`, function(err) {
       
        if ( err ) {
            console.log('error happen')
            response.send({
                success: false
            })
        }
    });

    response.send({
        success: true
    });
}
const apiMapper = {
    '/api/saveSnippet' : saveSnippetHandler,
    '/api/getSnippet': getSnippetHandler,
    '/api/getAllSnippets': getAllSnippetHandler,
    '/saveArticle': saveArticleHandler,
    '/api/getAllTags': getAllTagsHandler,
    '/api/getAllCategories': getAllCategoriesHandler,
    '/api/getArticlesByTag': getArticlesByTagHandler,
    '/api/getArticlesByCategory': getArticlesByCategoryHandler,
    '/api/checkSnippetFileExists': checkSnippetFileExists,
    '/api/gist': getGistHandler,
    '/api/createNewGist': createNewGistHandler,
    '/api/saveGistDesc': saveGistDesc,
    '/api/renameGistFile': renameGistFileHandler,
}

const setupApi = (app) => {
    for(let api in apiMapper) {
        const handler = apiMapper[api];
        app.post(api, handler);
    }
}

module.exports = {
    setupApi
}