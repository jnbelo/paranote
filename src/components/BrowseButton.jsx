import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyledBrowserButton } from './BrowseButton.styles';
import { ipcRenderer } from 'electron';

export const SAVE_TYPE = 'save';
export const OPEN_TYPE = 'open';

const BrowseButton = (props) => {
    const [value, setValue] = useState('');

    const handleClick = async (event) => {
        event.preventDefault();

        let result;
        if (props.type === SAVE_TYPE) {
            result = await ipcRenderer.invoke('open-file-saver');
        } else {
            result = await ipcRenderer.invoke('open-file-opener');
        }

        if (result && props.formatResult) {
            result = props.formatResult(result);
        }

        if (result && props.onChooseConfirm) {
            props.onChooseConfirm(result);
        }

        setValue(result);
    };

    return (
        <StyledBrowserButton>
            <input id={props.id} type="text" readOnly={true} value={value} />
            <button onClick={handleClick}>...</button>
        </StyledBrowserButton>
    );
};

BrowseButton.propTypes = {
    onChooseConfirm: PropTypes.func.isRequired,
    type: PropTypes.oneOf([SAVE_TYPE, OPEN_TYPE]).isRequired,
    formatResult: PropTypes.func
};

BrowseButton.defaultProps = {
    type: SAVE_TYPE
};

export default BrowseButton;
