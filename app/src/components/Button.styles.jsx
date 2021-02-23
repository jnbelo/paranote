import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledButton = styled.button`
    background-color: ${(props) => props.theme.button[props.type].background};
    color: ${(props) => props.theme.button[props.type].textColor};
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: ${(props) => props.padding};
    border-radius: 2px;

    &:hover {
        background-color: ${(props) => props.theme.button[props.type].hoverBackground};
        color: ${(props) => props.theme.button[props.type].hoverTextColor};
    }

    & > img {
        filter: ${(props) => props.theme.button[props.type].svgColor};
    }

    &:hover > img {
        filter: ${(props) => props.theme.button[props.type].hoverSvgColor};
    }

    &:focus {
        outline: none;
    }
`;

export const StyledLink = styled(Link)`
    background-color: ${(props) => props.theme.button[props.type].background};
    color: ${(props) => props.theme.button[props.type].textColor};
    text-decoration: none;
    cursor: pointer;
    font-size: 14px;
    padding: ${(props) => props.padding};
    border-radius: 2px;
    display: inline-block;
    text-align: center;

    &:hover {
        background-color: ${(props) => props.theme.button[props.type].hoverBackground};
        color: ${(props) => props.theme.button[props.type].hoverTextColor};
    }

    & > img {
        filter: ${(props) => props.theme.button[props.type].svgColor};
    }

    &:hover > img {
        filter: ${(props) => props.theme.button[props.type].hoverSvgColor};
    }

    &:focus {
        outline: none;
    }
`;
