import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { toSlug } from 'common/util';
import {
    useParams,
    useHistory
} from "react-router-dom";

import ArticleList from './ArticleList';

const CategoryView = () => {

    const history = useHistory();
    const [articles, setArticles] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        if (id) {

            axios.post('/api/getArticlesByCategory', {
                id
            })
                .then(function (response) {
                    const data = response.data.articles;
                    setArticles(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [])
    return (
        <div>
            <ArticleList articles={articles} />
        </div>
    )
}

export default CategoryView;
