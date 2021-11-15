import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { toSlug } from 'common/util';
import CategoryList from './CategoryList';

const Home = () => {

    return (
        <div>
            <CategoryList />
        </div>
    )
}

export default Home;

