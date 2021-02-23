import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        user-select: none;
    }

    html, body {
        height: 100%;
        background-color: ${(props) => props.theme.background};
        color: ${(props) => props.theme.textColor};
        font-family: Arial, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
    }
    
    #root {
        height: 100%;
    }
    `;
