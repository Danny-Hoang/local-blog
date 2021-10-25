import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    useParams,
    useHistory
} from "react-router-dom";
import styled from 'styled-components';

const ViewArticle = () => {

    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const history = useHistory();

    const createMarkup = (v) => {
        return { __html: v };
    }

    const deleteArticle = () => {
        axios.post('/deleteArticle', {
            id
        })
            .then(function (response) {

                history.push('/')
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const newArticle = () => {
        history.push('/new')
    }

    useEffect(() => {
        if (id) {

            axios.post('/article', {
                id
            })
                .then(function (response) {
                    const { article } = response.data;
                    console.log(article)
                    setArticle(article);

                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            history.push('/')
        }
    }, [])
    return (
        <div>
            <div style={{ margin: '0 auto', width: '50vw', }} dangerouslySetInnerHTML={createMarkup(article?.html || '')} contentEditable={false}></div>
            <div>
                <div onClick={newArticle}>New Article</div>
                <div onClick={deleteArticle}>Delete Article</div>
            </div>
        </div>
    )
}

export default ViewArticle;