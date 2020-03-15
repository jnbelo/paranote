import styled from 'styled-components';

export const PageWrapper = styled.div`
    padding: 20px;
`;

export const PageTitle = styled.h1`
    font-size: 30px;
    color: ${(props) => props.theme.textColor};
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid ${(props) => props.theme.textColor};
`;

export const ControlWrapper = styled.div`
    & > * {
        margin-right: 5px;
    }
`;
