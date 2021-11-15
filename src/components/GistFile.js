import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CodeViewer from './CodeViewer';
import { getFileNameExtension } from 'common/util';
import axios from 'axios';
import { Controlled as CodeMirror } from 'react-codemirror2';
import './github-light.css';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/sass/sass');
require('codemirror/mode/jsx/jsx');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/htmlmixed/htmlmixed');

const GistFile = (props) => {
    const ext = getFileNameExtension(props.fileName);
    const [fileName, setFileName] = useState(props.fileName);
    const [lastFileName, setLastFileName] = useState(props.fileName);
    const [content, setContent] = useState(props.content);

    const [isEdit, setIsEdit] = useState(false);
    const toggleEdit = () => {
        setIsEdit(s => !s);
    }

    const isValidFileName = (str) => {
        if (!str) {
            return false;
        }

        if (str.indexOf('.') === -1 || str.indexOf('.') === 0) {
            return false;
        }


        return true;
    }

    const saveFileName = () => {
        if (isValidFileName(fileName)) {
            setIsEdit(false);
            if (fileName !== lastFileName) {
                axios.post('/api/renameGistFile', {
                    gistID: props.gistID,
                    newName: fileName,
                    oldName: lastFileName

                })
                    .then(function (response) {
                        const { success } = response;
                        if(success) {

                            setLastFileName(fileName);
                        } else {
                            setFileName(lastFileName)
                        }
                    })
                    .catch(function (error) {
                        setFileName(lastFileName);
                    });
            }
        }
    }

    useEffect(() => {
        setFileName(props.fileName);
    }, [props.fileName]);
    useEffect(() => {
        setContent(props.content);
    }, [props.content]);

    const onChangeFileName = (e) => {
        setFileName(e.target.value)
    }

    const mapper = {
        'js': 'jsx',
        'jsx': 'jsx',
        'ts': 'jsx',
        'css': 'sass',
        'scss': 'sass',
        'html': 'htmlmixed',
    }
    const mode = mapper[ext] || 'htmlmixed';
    return (
        <Wrap>
            <Header>
                {
                    isEdit ? <input autoFocus onBlur={saveFileName} value={fileName} onChange={onChangeFileName} />
                        : <a href="javascript:;" onClick={toggleEdit}>{fileName}</a>
                }

                {/* <a href="javascript:;" onClick={toggleEdit}>Edit</a> */}
            </Header>
            <Body>
                {/* <CodeViewer className={props.className || ''} showLineNumbers language={language} style={githubGist}>
                    {content}
                </CodeViewer> */}

                <CodeMirror
                    value={content}
                    options={{
                        mode,
                        theme: 'github-light',
                        lineNumbers: true,
                        lineWrapping: false,
                        extraKeys: {
                            "F11": function (cm) {
                                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                            },
                            "Esc": function (cm) {
                                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                            },
                            "Ctrl-S": function (instance) {
                                props.onSave && props.onSave();
                            }
                        }
                    }}
                    onBeforeChange={(editor, data, value) => {
                        setContent(value);
                    }}
                    // onPaste={handlePaste}
                    onChange={(editor, data, value) => {
                        props.onChange && props.onChange(value);
                    }}
                />
            </Body>
        </Wrap>
    );
};

export default GistFile;


const Wrap = styled.div`
    border: 1px solid var(--color-bg-primary);
    border-radius: 4px;
    width: 100%;
`
const Header = styled.div`
    border-bottom: 1px solid var(--color-bg-primary);
    padding: 10px;
    background-color: var(--color-bg-secondary);
    border-radius: 4px 4px 0 0;
    a {
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        color: var(--color-text-link);
        &:hover {
            text-decoration: underline;
        }
    }

    input {
        font-size: 13px;
        border: 1px solid #eee;
        line-height: 20px;
        border-radius: 4px;
        padding: 5px 12px;
        outline: none;
    }
`
const Body = styled.div`
    font-size: 12px;
    line-height: 20px;
`
