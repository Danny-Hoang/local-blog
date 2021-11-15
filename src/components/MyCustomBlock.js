import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    useParams,
    useHistory
  } from "react-router-dom";
import styled from 'styled-components';

const MyCustomBlock = (props) => {
    const { block, contentState } = props;

    const [value, setValue] = useState('');
    const { id } = useParams();
    const [showCode, setShowCode] = useState(id ? true : false)
    const [fileNameID, setFileNameID] = useState('');
    const [title, setTitle] = useState('');

    const history = useHistory() 

    useEffect(() => {
        if (id) {

            axios.post('/article', {
                id
            })
                .then(function (response) {
                    const { article } = response.data;
                    console.log(article)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [])


    const onClickView = () => {
        if(fileNameID) {
            history.push(`/article/${title || 'untitled'}/${fileNameID}`)
        }
        // setShowCode(false);
        // axios.post('/saveChanges', {
        //     content: value,
        //     fileName
        // })
        //     .then(function (response) {
        //         console.log('data saved');
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

    }

    const handleTextAreaInput = (e) => {
        setValue(e.target.value);
    }
    const onClickSource = () => {
        setShowCode(true);
    }
    const createMarkup = (v) => {
        return { __html: v };
    }

    const handlePaste = (e, data) => {
        e.preventDefault();
        const htmlData = e.clipboardData.getData('text/html');
        htmlData.replace(/\<body\>/, '');
        htmlData.replace(/\<\/body\>/, '');
        htmlData.replace(/\<html\>/, '');
        htmlData.replace(/\<\/html\>/, '');
        // setValue(htmlData);

        axios.post('/saveArticle', {
            content: htmlData
        })
            .then(function (response) {
                const { html, id } = response.data;
                setValue(html);
                setFileNameID(id)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <div className='MyCustomBlock'>
          
            <Textarea onPaste={handlePaste} value={value} onChange={handleTextAreaInput}></Textarea>
                        <div style={{ margin: '0 auto', width: '50vw', }} dangerouslySetInnerHTML={createMarkup(value)} contentEditable={false}></div>
            <Footer>
                <Tab onClick={onClickView}>view</Tab>
                <Tab onClick={onClickSource}>source</Tab>
            </Footer>
        </div>
    )
};

export default React.memo(MyCustomBlock);

const Textarea = styled.textarea`
    outline: none;
    width: 600px;
    margin-top: 100px;
    height: calc(100vh - 200px);
    border: 1px solid #ddd;
    padding: 20px;
`

const Footer = styled.div`
    position: fixed;
    border-top: 1px solid #eee;
    bottom: 0;
    width: 100vw;
    display: flex;
`

const Tab = styled.div`
    padding: 0 20px;
    cursor: pointer;
    line-height: 24px;
    &:last-child {
        border-left: 1px solid #eee;
    }

`