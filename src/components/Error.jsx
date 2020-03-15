import React from 'react';
import { StyledError } from './Error.styles';

const Error = (props) => {
    return <StyledError>{props.children}</StyledError>;
};

export default Error;
