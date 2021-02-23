import styled from 'styled-components';

export const EditorWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: grid;
    padding: 0 5px;
    grid-gap: 2px;
    grid-template:
        'title' min-content
        'content'
        / 1fr;
`;

export const EditorTitle = styled.div`
    grid-area: title;
`;

export const EditorContent = styled.div`
    grid-area: content;
`;
