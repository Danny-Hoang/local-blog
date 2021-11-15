import React from 'react';
import styled from 'styled-components';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeViewer = (props) => {
    return (
        <StyleSyntaxHighlighter className={props.className || ''} showLineNumbers language={props.language} style={githubGist}>
            {props.children}
        </StyleSyntaxHighlighter>
    );
};

export default CodeViewer;

const StyleSyntaxHighlighter = styled(SyntaxHighlighter)`
    span.comment.linenumber.react-syntax-highlighter-line-number {
        color: #ccc;
        min-width: 2em !important;
    }
`