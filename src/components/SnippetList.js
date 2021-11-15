import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    useParams,
    useHistory
} from "react-router-dom";
import CodeViewer from './CodeViewer';

const SnippetList = (props) => {
    const [snippets, setSnippets] = useState([]);
    const history = useHistory();
    const viewSnippet = (fileName) => {
        history.push(`/snippet/${fileName}`)
    }
    useEffect(() => {
        axios.post('/api/getAllSnippets')
            .then(function (response) {
                const data = response.data.snippets;
                setSnippets(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])
    return (
        <div >
            {
                snippets.map(s => (
                    <div key={s} onClick={() => viewSnippet(s)}>{s}</div>
                ))
            }

        </div>
    );
};

export default SnippetList;