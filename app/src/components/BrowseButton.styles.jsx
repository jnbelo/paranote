import styled from 'styled-components';

export const StyledBrowserButton = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;

    & > input {
        flex: auto;
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
    }

    & > button {
        color: ${(props) => props.theme.browseButtonTextColor};
        text-decoration: none;
        cursor: pointer;
        font-size: 14px;
        border-radius: 1px;
        background-color: ${(props) => props.theme.browseButtonBackground};
        border: 1px solid ${(props) => props.theme.browseButtonBackground};
        width: 75px;
        text-align: center;
    }

    & > button:hover {
        background-color: ${(props) => props.theme.browseButtonHoverBackground};
        border: 1px solid ${(props) => props.theme.browseButtonHoverBackground};
    }
`;
