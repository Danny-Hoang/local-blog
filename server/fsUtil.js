const fs = require('fs-extra')
var CSON = require('cson')
const pretty = require('pretty');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const request = require('request');

const writeFileSync = (filePath, data) => {
    fs.writeFileSync(filePath, data);
}

const normalize = (path) => path.replace(/\\/g, "/");


var downloadFile = function (uri, filename, callback) {
    console.log('download to ' + filename);
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

const HOME_DIR = normalize(require('os').homedir());
const LOCAL_BLOG_DIR = HOME_DIR + '/Dropbox/localblog';
fs.ensureFileSync(LOCAL_BLOG_DIR + '/articles.json');
fs.ensureFileSync(LOCAL_BLOG_DIR + '/snippets.json');
fs.ensureFileSync(LOCAL_BLOG_DIR + '/tags.json');
fs.ensureFileSync(LOCAL_BLOG_DIR + '/categories.json');
fs.ensureDirSync(LOCAL_BLOG_DIR + '/images');

const getListArticles = () => {
    var data = fs.readFileSync(LOCAL_BLOG_DIR + '/articles.json', 'utf8');
    return data ? JSON.parse(data) : {};
}

const deleteArticle = (id) => {
    const articles = getListArticles();
    if (articles) {
        delete articles[id];
        const data = JSON.stringify(articles);
        saveFileSync('articles.json', data);
    }
}

const getArticlesByTag = (tagID) => {
    const articles = getListArticles();
    const result = [];
    if (articles) {

        console.log(articles)
        for (let id in articles) {
            const article = articles[id];
            if (article.tags.indexOf(+tagID) !== -1) {
                result.push(article);
            }
        }
    }

    return result;
}
const getArticlesByCategory = (categoryID) => {
    const articles = getListArticles();
    const result = [];
    if (articles) {

        console.log(articles)
        for (let id in articles) {
            const article = articles[id];
            console.log(JSON.stringify(article, null, 4))
            // if (article.categories.indexOf(+categoryID) !== -1) {
                result.push(article);
            // }
        }
    }

    return result;
}

const saveFileSync = (fileName, data) => {
    console.log('fileName:' + fileName);
    fs.writeFileSync(LOCAL_BLOG_DIR + '/' + fileName, data);
}



const getUniqueSnippetFileName = (initialFileName = 'snippet.txt') => {
    const snippets = getSnippetsData() || {};
    const result = [];
    for (let id of snippets) {
        if (!snippets[id].files) {
            snippets[id].files = [];
        }
        result = [...result, ...snippets[id].files];
    }

    if (result.includes(initialFileName)) {
        let index = 0;
        const bodyName = initialFileName.substring(0, initialFileName.lastIndexOf('.'));
        const ext = initialFileName.substring(initialFileName.lastIndexOf('.') + 1);
        while (true) {
            index += 1;
            let newName = bodyName + index;
            if (!result.includes(newName + '.' + ext)) {
                return newName + '.' + ext;
            }
        }
    }

    return initialFileName;

}

//add, update file name of a snippet
const addUpdateSnippetFile = (snippetID, fileName, content) => {
    if (!snippetID) {
        return;
    }

    const newFileName = getUniqueSnippetFileName(fileName);

    const snippets = getSnippetsData() || {};
    if (snippets[snippetID].files) {
        snippets[snippetID].files = []
    }
    snippets[snippetID].files = [...snippets[snippetID].files, newFileName];
    fs.writeFileSync(LOCAL_BLOG_DIR + '/snippets.json', JSON.stringify(snippets));
}
const saveSnippet = (fileName, data, description) => {
    const snippets = getSnippetsData() || {};

    snippets[fileName] = {
        description
    };
    fs.writeFileSync(LOCAL_BLOG_DIR + '/snippets.json', JSON.stringify(snippets));
    fs.writeFileSync(LOCAL_BLOG_DIR + '/snippets/' + fileName, data);
}

const getArticleSync = (articleID) => {
    var data = fs.readFileSync(`${LOCAL_BLOG_DIR}/articles/${articleID}.cson`, 'utf8');
    const article = CSON.parse(data)
    return article;
}

const getAllTags = () => {
    var data = fs.readFileSync(`${LOCAL_BLOG_DIR}/tags.json`, 'utf8');
    const tags = data ? CSON.parse(data) : []
    return tags;
}
const getAllCategories = () => {
    var data = fs.readFileSync(`${LOCAL_BLOG_DIR}/categories.json`, 'utf8');
    const categories = data ? CSON.parse(data) : []
    return categories;
}

const getSnippetsData = () => {
    var data = fs.readFileSync(`${LOCAL_BLOG_DIR}/snippets.json`, 'utf8');
    return data ? JSON.parse(data) : {};
}

const createNewGist = () => {
    const folderName = uuidv4();
    const fileName = 'untitled.js';
    const file = `${LOCAL_BLOG_DIR}/gists/${folderName}/${fileName}`;
    fs.ensureFileSync(file);
    return folderName;

}
const getGistData = () => {
    var data = fs.readFileSync(`${LOCAL_BLOG_DIR}/gist-data.json`, 'utf8');
    return data ? JSON.parse(data) : {};
}

const saveGistDesc = (gistID, newDesc = 'description') => {
    if (!gistID) {
        return;
    }
    const gists = getGistData();
    if(!gists[gistID]) {
        gists[gistID] = {};
    }
    gists[gistID].description = newDesc;
    fs.writeFileSync(LOCAL_BLOG_DIR + '/gist-data.json', JSON.stringify(gists));
}

function readFiles(dirname, onFinish, onError) {
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }

        const data = [];
        filenames.forEach(function (fileName) {
            fs.readFile(dirname + '/' + fileName, 'utf-8', function (err, content) {
                if (err) {
                    onError(err);
                    return;
                }

                data.push({
                    fileName,
                    content
                });

                if(data.length === filenames.length) {

                    onFinish(data);
                }
            });
        });
    });
}

const getGistFiles = (gistID, cb) => {
    var data = {};
    readFiles(`${LOCAL_BLOG_DIR}/gists/${gistID}`, function (data) {
        cb && cb(data);
    }, function (err) {
        throw err;
    });
}

const getSnippet = (fileName) => {
    var content = fs.readFileSync(`${LOCAL_BLOG_DIR}/snippets/${fileName}`, 'utf8') || '';
    const snippets = getSnippetsData() || {};
    const snippet = snippets[fileName] || {};
    return {
        snippet,
        content
    };

}

const getAllSnippets = () => {
    const snippets = getListFilesInDirectory(`${LOCAL_BLOG_DIR}/snippets`)
    return snippets;
}

const getListFilesInDirectory = (folderPath, fileNameOnly) => {

    const list = [];
    fs.readdirSync(normalize(folderPath)).forEach(file => {
        if (fileNameOnly) {
            let fileName = file.substring(file.lastIndexOf('/') + 1);
            list.push(fileName);
        } else {
            list.push(file);
        }
    });

    return list;
}

const checkSnippetExists = (fileName) => {
    if (!fileName) {
        return false;
    }
    const files = getListFilesInDirectory(LOCAL_BLOG_DIR + '/snippets');
    return files.indexOf(fileName.trim()) !== -1;
}

module.exports = {
    downloadFile,
    getListArticles,
    saveFileSync,
    saveSnippet,
    LOCAL_BLOG_DIR,
    getArticleSync,
    deleteArticle,
    getAllTags,
    getAllCategories,
    getArticlesByTag,
    getArticlesByCategory,
    getAllSnippets,
    getSnippet,
    checkSnippetExists,
    getGistData,
    getGistFiles,
    createNewGist,
    saveGistDesc
}