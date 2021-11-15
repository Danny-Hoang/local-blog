import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { toSlug } from 'common/util';

const ArticleList = (props) => {
    const { articles } = props;

    return (
        <div>

            <Wrap>
                {
                    articles.map(e => {
                        const slug = toSlug(e.title);
                        console.log(slug)
                        return (
                            <ArticleTitle to={`/article/${slug}/${e.id}`} key={e.title} onClick={null}>{e.title}</ArticleTitle>
                        )
                    })
                }
            </Wrap>
        </div>
    )
}

export default ArticleList;

const ArticleTitle = styled(NavLink)`
    font-size: 18px;
    font-weight: 500;
    line-height: 32px;
    color: rgb(41, 43, 44);
    cursor: pointer;
    text-align: left;
    display: block;
    text-transform: capitalize;
    text-decoration: none;
    &:hover {
        color: #5488c7;
    }
`

const Wrap = styled.div`
    width: 600px;
    margin: 0 auto;
`