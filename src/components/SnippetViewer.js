import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import CodeViewer from './CodeViewer';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
    useParams,
    useHistory
} from "react-router-dom";
import { Controlled as CodeMirror } from 'react-codemirror2';
import CodeEditor from './CodeEditor';
import Input from 'ui/Input';
import MyEditor from './MyEditor';
import GistFile from './GistFile';
import { getFileNameExtension } from 'common/util';

const renderers = {
    code: ({ language, value }) => {
        console.log(language)
        if (language === 'js') {
            language = 'jsx';
        }
        // return <SyntaxHighlighter style={darcula} language={language} children={value} />
        return <CodeMirror
            value={value}
            options={{
                mode: language,
                theme: 'material',
                lineNumbers: true,
                lineWrapping: true,

            }}

        />
    }
}

const SnippetViewer = () => {

    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const [description, setDescription] = useState('');
    const [lastContent, setLastContent] = useState('');

    const history = useHistory();
    const onSave = () => {
        save();
    }

    const toggleEdit = () => {
        setIsEditing(e => !e);
    }

    const save = () => {
        if (id) {
            axios.post('/api/saveSnippet', {
                id,
                description,
                content
            })
                .then(function (response) {
                    setLastContent(content);
                    setIsEditing(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const onChangeFilename = (v) => {

    }

    const edit = () => {
        setIsEditing(true);
    }
    const cancel = () => {
        setIsEditing(false);
    }

    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }

    useEffect(() => {
        if (id) {

            axios.post('/api/gist', {
                id
            })
                .then(function (response) {
                    console.log(response)
                    const data = response.data;
                    // const { description: snippetDesc } = snippet;
                    // setContent(content);
                    setFiles(data.files);
                    setDescription(data.description)
                    // setLastContent(content);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [])

    const click = async () => {
        const text = await navigator.clipboard.read();
        console.log(text);
        // input.value = text;
    }

    const saveDescription = () => {
        axios.post('/api/saveGistDesc', {
            gistID: id,
            description,
        })
            .then(function (response) {
               
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const getMode = useCallback((name) => {
        const ext = getFileNameExtension(name)
        const mapper = {
            'js': 'jsx',
            'jsx': 'jsx',
            'html': 'htmlmixed',
            'scss': 'sass',
            'css': 'sass',
            'md': 'markdown'

        }

        const mode = mapper[ext] || '';

        return mode;
    }, []);

    const onChange = (newValue) => {
        console.log('new content', newValue)
        setContent(newValue);
    }

    const mode = 'jsx';//getMode(fileName);
    const language = 'typescript';

    const createNew = () => {
        axios.post('/api/createNewGist')
            .then(function (response) {
                console.log(response)
                const { gistID } = response.data;
                history.push(`/gist/${gistID}`)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div>
            <div className="flex">
                <div onClick={toggleEdit}>List / </div>
                <div onClick={createNew}>&nbsp;New</div>
            </div>
            <Wrap className="container ">
                <Description className="mb8 h7" placeholder="Please enter description" onChange={onChangeDescription} value={description} onBlur={saveDescription} />
                <div className="flex justify-center ">

                        {
                            language !== 'markdown' ? (
                                <div className="w-100">
                                    {
                                        files.map(f => (
                                            <div className="mb8">

                                                <GistFile key={f.fileName} gistID={id} fileName={f.fileName} content={f.content} />
                                            </div>
                                        ))
                                    }
                                </div>

                            ) : (
                                    <ReactMarkdown className="mark-down-container" renderers={renderers} >{content}</ReactMarkdown>
                                )
                        }


                </div>

            </Wrap>
        </div>
    )
}

export default SnippetViewer;

const StyledCodeMirror = styled(CodeMirror)`
    width: 100%;
    .CodeMirror {
        border-radius: 6px;
        height: fit-content;
        padding: 10px 0px;
    }
`

const Description= styled.input`
    border: none;
    outline: none;
    color: #24292e;
    font-size: 12px;
    line-height: 20px;
    box-shadow: none;
`
const Wrap = styled.div`
    /* margin: 0 120px; */
    margin-top: 50px;
    margin-bottom: 50px;

    .mark-down-container {
        width: 100%;
        max-width: 1012px;

        .CodeMirror {
            border-radius: 6px;
            height: fit-content;
            padding: 10px 0px;
        }
    }

    @media (min-width: 992px) {
        .col-lg-8 {
            flex: 0 0 66.66667%;
            max-width: 66.66667%;
        }
    }

`

const LeftCol = styled.div`
    width: 250px;
    margin-left: 20px;
    flex: none;
    margin-top: 19px;
    font-size: 14px;
    flex: none;
    a {
        display: block;
        text-decoration: none;
        font-size: 13px;
        color: #333;
        &:hover {
            text-decoration: underline;
        }
    }
`
const RightCol = styled.div`
    /* flex: 1;
    margin-top: 20px;
    width: calc(100% - 450px);
    margin: 20px; */
    /* max-width: 750px; */
    /* margin: 0 auto; */
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
`


const Button = styled.button`
    border: none;
    outline: none;
    background: #fff;
    border-radius: 4px;
    line-height: 32px;
    padding: 0 20px;
    cursor: pointer;
    color: #333;
    min-width: 80px;
    font-weight: 500;
    ${props => props.primary && css`
        background: royalblue;
        color: #fff;
    `}
    ${props => props.disabled && css`
        opacity: 0.6;
        pointer-events: none;
    `}
`