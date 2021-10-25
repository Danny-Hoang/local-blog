import React, { useEffect, useState } from 'react';
import CodeViewer from './CodeViewer';

const Snippet = (props) => {
    const [code, setCode] = useState('');

    useEffect(() => {

    }, [])
    return (
        <CodeViewer code={code} />
    );
};

export default Snippet;