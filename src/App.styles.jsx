import styled from 'styled-components';

export const Wrapper = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: 100%;
`;

export const SourceListContainer = styled.div`
    min-width: 150px;
    max-width: 50vw;
    height: 100%;
    border-right: 1px solid ${(props) => props.theme.mainColumnBorderColor};
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: min-content 1fr;
`;

export const SourceListItem = styled.div`
    padding: 3px 2px 3px 10px;

    & > h4 {
        font-size: 13px;
        font-weight: 600;
        display: inline-block;
        margin: 0;
    }

    & > button,
    & > a {
        float: right;
    }
`;
