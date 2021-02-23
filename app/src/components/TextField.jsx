import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyledTextField } from './TextField.styles';

const TextField = ({ value, onChange, ...props }) => {
    const [innerValue, setInnerValue] = useState(value);

    useEffect(() => {
        if (value) {
            setInnerValue(value);
        } else {
            setInnerValue('');
        }
    }, [value]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setInnerValue(newValue);

        if (onChange) {
            onChange(newValue);
        }
    };

    return <StyledTextField value={innerValue} onChange={handleChange} {...props} />;
};

TextField.propTypes = {
    type: PropTypes.oneOf(['text', 'password']).isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    value: PropTypes.string
};

TextField.defaultProps = {
    type: 'text',
    readOnly: false,
    placeholder: '',
    value: ''
};

export default TextField;
