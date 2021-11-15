import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { copyToClipboard, getFileNameExtension } from 'common/util';
import Input from 'ui/Input';
import { Controlled as CodeMirror } from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/sass/sass');
require('codemirror/mode/jsx/jsx');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/htmlmixed/htmlmixed');
require ("codemirror-github-light/lib/codemirror-github-light-theme.css");


const CodeEditor = (props) => {

    const [code, setCode] = useState(props.code || '');
    const { readOnly } = props;
    const [isEditMode, setIsEditMode] = useState(!readOnly);
    const [fileName, setFileName] = useState(props.fileName);

    const [coppied, setCoppied] = useState(false);

    useEffect(() => {
        setIsEditMode(readOnly);
    }, [readOnly])

    const onMouseEnter = () => {
        setCoppied(false);
    }


    useEffect(() => {
        setCode(props.code);
    }, [props.code])

    const onClickCopy = () => {
        copyToClipboard(code);
        setCoppied(true);
    }
    const onClickEdit = () => {
        setIsEditMode(mode => !mode);
        if(isEditMode) {
            props.onSave && props.onSave();
        }
    }
    const onChangeFileName = (e) => {
        setFileName(e.target.value.trim());
    }

    const handlePaste = (e, data) => {
        console.log(e);
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

    const mode = getMode(fileName);

    return (
        <Wrap className={props.className || ''}>
            <Header onMouseEnter={onMouseEnter}>
                {
                    !isEditMode ? (
                        <FileName className="h7 ml16 text-link">{fileName}</FileName>
                    ) : (
                            <Input className="input-contrast ml8" placeholder={'Filename including extension'} value={fileName} onChange={onChangeFileName} />
                        )
                }
                <div className="ml-auto">
                    <a href="javascript:;" onClick={onClickEdit} >{isEditMode ? 'Save' : 'Edit'}</a>
                    <a href="javascript:;" onClick={onClickCopy} >{coppied ? 'Coppied' : 'Copy'}</a>
                </div>
            </Header>
            <EditorContainer className="code-edit-container">


                <CodeMirror
                    value={code}
                    options={{
                        mode,
                        theme: 'material',
                        lineNumbers: true,
                        lineWrapping: true,
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
                        if(isEditMode) {
                            setCode(value);
                        }
                    }}
                    onPaste={handlePaste}
                    onChange={(editor, data, value) => {
                        props.onChange && props.onChange(value);
                    }}
                />
            </EditorContainer>
        </Wrap>
    )
}

export default CodeEditor;

const Wrap = styled.div`
    border: 1px solid var(--color-bg-primary);
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    overflow: auto;
    /* width: fit-content;
    min-width: 100%; */
`
const Header = styled.div`
    border-bottom: 1px solid var(--color-bg-primary);
    background: var(--gray-200);
    height: 42px;
    display: flex;
    align-items: center;
    border-radius: 4px 4px 0 0;

    a {
        font-size: 12px;
        text-decoration: none;
        color: var(--text-link);
        font-weight: 500;
        margin-right: 20px;
    }
`

const FileName = styled.div`
    
`

const Textarea = styled.textarea`
    caret-color: black;
    z-index: 9;
    color: transparent;
    top: 0px;
    left: 27px;
    color: transparent;
    outline: none;
`

const EditorContainer = styled.div`
    position: relative;
    height: fit-content;
    min-width: 100%;
    /* min-width: calc(100% - 28px); */
    /* max-width: 750px; */
    overflow: auto;
    background-color: hsl(212,35%,95%);
    /* margin: 1em; */
    font-size: 13px;

    .react-codemirror2 {
        width: fit-content;
        min-width: 100%;
    }
    .CodeMirror {
        height: fit-content;
        font-size: 14px;
        line-height: 1.5em;
    }
`
