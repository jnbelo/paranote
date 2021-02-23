import styled from 'styled-components';

export const StyledTextField = styled.input`
    width: 100%;
    display: block;
    line-height: 1.5;
    color: ${(props) => props.theme.textFieldTextColor};
    background-color: ${(props) => props.theme.textFieldBackground};
    padding: 3px 5px;
    font-size: 14px;
    cursor: text;
    outline: none;
    text-transform: none;
    outline: none;
    border-radius: 1px;
    border: 1px solid ${(props) => props.theme.textFieldBackground};

    &:focus {
        border: 1px solid ${(props) => props.theme.textFieldFocusBorder};
    }
`;
