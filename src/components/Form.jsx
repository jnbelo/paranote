import React from 'react';
import Error from './Error';
import { StyledForm } from './Form.styles';

const Form = ({ children, error }) => {
    return (
        <StyledForm>
            {children}
            {error && <Error>{error}</Error>}
        </StyledForm>
    );
};

export default Form;
