import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import styled from 'styled-components';
import './App.css';
import ArticleList from './components/ArticleList';
import MyCustomBlock from 'components/MyCustomBlock';
import ViewArticle from 'components/ViewArticle';
import Home from 'components/Home';
import TagView from 'components/TagView';
import CategoryView from 'components/CategoryView';
import SnippetViewer from 'components/SnippetViewer';
import SnippetList from 'components/SnippetList';
import CreateSnippet from 'containers/CreateSnippet';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/article/:name/:id" exact>
                        <ViewArticle />   
                    </Route>
                    <Route path="/new">
                        <MyCustomBlock />   
                    </Route>
                    <Route path="/new-snippet">
                        <SnippetViewer />   
                    </Route>
                    <Route path="/snippets">
                        <SnippetList />   
                    </Route>
                    <Route path="/snippet/:fileName" exact>
                        <SnippetViewer />   
                    </Route>
                    <Route path="/gist/:id" exact>
                        <SnippetViewer />   
                    </Route>
                    {/* <Route path="/">
                        <ArticleList />
                    </Route> */}
                    <Route path="/tag/:name/:id" exact>
                        <TagView />
                    </Route>
                    <Route path="/category/:name/:id" exact>
                        <CategoryView />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                 
                </Switch>
            </Router>
        </div>
    );
}

export default App;

const Div = styled.div`
    width: 600px;
    margin: auto;
`
