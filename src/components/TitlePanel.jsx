import React from 'react';
import { StyledTitlePanel } from './TitlePanel.styles';

const TitlePanel = ({ title, children }) => {
    return (
        <StyledTitlePanel>
            <h4>{title}</h4>
            <div>{children}</div>
        </StyledTitlePanel>
    );
};

export default TitlePanel;
