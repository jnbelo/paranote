import styled from 'styled-components';

export const NoteListWrapper = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: 100%;
`;

export const NotesListContainer = styled.div`
    min-width: 180px;
    max-width: 50vw;
    height: 100%;
    border-right: 1px solid ${(props) => props.theme.mainColumnBorderColor};
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: min-content 1fr;
`;

export const NotesListItem = styled.div`
    padding: 5px 0;

    & > h3 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 6px;
    }

    & > p {
        font-size: 9px;
        font-weight: 600;
        opacity: 0.7;
    }
`;

export const EditorContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: min-content 1fr;
`;

export const Toolbar = styled.div`
    width: 100%;
    padding: 5px;
    background-color: ${(props) => props.theme.toolbarBackgroundColor};

    & > * {
        float: right;
    }
`;
