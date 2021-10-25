import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
    padding: 5px 12px;
    font-size: 14px;
    line-height: 20px;
    color: var(--color-text-primary);
    vertical-align: middle;
    background-color: var(--color-bg-primary);
    background-repeat: no-repeat;
    background-position: right 8px center;
    border: 1px solid var(--color-border-primary);
    border-radius: 6px;
    outline: none;
    box-shadow: var(--color-shadow-inset);

    &.input-contrast {
        background-color: var(--color-bg-secondary);
    }

    &:focus {
        border-color: var(--color-border-info);
        outline: none;
        box-shadow: var(--color-shadow-focus);
    }
`

export default Input;