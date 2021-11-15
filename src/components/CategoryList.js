import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { toSlug } from 'common/util';

const CategoryList = () => {

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.post('/api/getAllCategories')
            .then(function (response) {
                const data = response.data.categories

                setCategories(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    return (
        <Wrap>
            {
                categories.map(t => (
                    <CategoryItem to={`/category/${toSlug(t.name)}/${t.id}`} key={t.id}>{t.name}</CategoryItem>
                ))
            }
        </Wrap>
    )
}

export default CategoryList;

const Wrap = styled.div`
    width: 600px;
`

const CategoryItem = styled(NavLink)`
    font-size: 20px;
    font-weight: 500;
    line-height: 32px;
    display: block;
    text-decoration: none;
    text-transform: capitalize;
    text-align: left;
`