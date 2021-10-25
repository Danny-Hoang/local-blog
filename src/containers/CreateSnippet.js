import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
    useParams,
    useHistory
} from "react-router-dom";
import CodeEditor from 'components/CodeEditor';
import GistFile from 'components/GistFile';


const CreateSnippet = () => {

    const [content, setContent] = useState('\n\n');
    const [fileName, setFileName] = useState('');
    const [isFileNameValid, setIsFileNameValid] = useState(true);
    
    const history = useHistory();
    const [lastContent, setLastContent] = useState('');

    const checkSnippetFileExists = (fName) => {
        axios.post('/api/checkSnippetFileExists', {
            fileName: fName
        })
            .then(function (response) {
                if(!isTypingRef.current) {
                    setIsFileNameValid(!response.data.valid);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const timerRef = useRef(null);
    const isTypingRef = useRef(false);

    const onChangeFileName = (e) => {
        clearTimeout(timerRef.current);
        const value = e.target.value;
        setFileName(e.target.value);
        isTypingRef.current = true;
        timerRef.current = setTimeout(() => {
            isTypingRef.current = false;
            checkSnippetFileExists(value)
        }, 500)
    }

  

    const save = () => {
        if(fileName) {
            axios.post('/api/saveSnippet', {
                fileName,
                content
            })
                .then(function (response) {
                    history.push(`/snippet/${fileName}`)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const onChange = (newValue) => {
        setContent(newValue);
    }
    return (
        <Wrap>
            <div className="mb16 mt24">
                <input value={fileName} onChange={onChangeFileName} />
                {/* <div>

                    {
                        isFileNameValid ? '' : 'File name is already exists'
                    }
                </div> */}
            </div>
            <GistFile fileName={fileName} content={content} />
            <div className="mt16 row-flex">
                <div className="ml-auto">
                    <Button className="mr8" onClick={save}>Cancel</Button>
                    <Button primary disabled={content ===lastContent} onClick={save}>Save</Button>
                </div>
            </div>
        </Wrap>
    )
}

export default CreateSnippet;

const Wrap = styled.div`
    margin: 0 auto;
    max-width: 1012px;


`


const Button= styled.button`
    border: none;
    outline: none;
    background: royalblue;
    border-radius: 4px;
    line-height: 40px;
    padding: 0 20px;
    cursor: pointer;
    color: #fff;
    font-weight: 500;
    ${props => props.disabled && css`
        opacity: 0.6;
        pointer-events: none;
    `}
`