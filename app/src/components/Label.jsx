import React from 'react';
import { StyledLabel } from './Label.styles';

const Label = ({ children, ...props }) => {
    return <StyledLabel {...props}>{children}</StyledLabel>;
};

export default Label;
