import React from 'react';
import Error from './Error';
import { StyledFormField } from './FormField.styles';

const FormField = (props) => {
    return (
        <StyledFormField>
            {props.children}
            {props.error && <Error>{props.error}</Error>}
        </StyledFormField>
    );
};

export default FormField;
