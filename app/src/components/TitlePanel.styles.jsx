import styled from 'styled-components';

export const StyledTitlePanel = styled.div`
    color: ${(props) => props.theme.titlePanelTextColor};
    background-color: ${(props) => props.theme.titlePanelBackgroundColor};
    width: 100%;
    height: auto;
    padding: 8px 10px;

    & > h4 {
        text-transform: uppercase;
        margin: 0;
        display: inline-block;
        font-size: 14px;
        font-weight: 200;
    }

    & > div {
        float: right;
    }

    & > div > *:not(:last-child) {
        margin-right: 7px;
    }
`;
