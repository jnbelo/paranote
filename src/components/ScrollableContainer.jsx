import styled from 'styled-components';

export const ScrollableContainer = styled.div`
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;

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
