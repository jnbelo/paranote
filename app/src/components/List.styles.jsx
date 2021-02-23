import styled from 'styled-components';

export const ListWrapper = styled.div`
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    background-color: ${(props) => props.theme.listBackgroundColor};

    &::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-track {
        background-color: ${(props) => props.theme.listTrackBackgroundColor};
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: ${(props) => props.theme.listScrollThumbColor};
    }
`;

export const StyledList = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100%;
`;

export const StyledListItem = styled.li`
    background-color: ${(props) => (props.selected ? props.theme.listSelectionColor : 'none')};
    cursor: pointer;
`;
