import PropTypes from 'prop-types';
import React from 'react';
import { StyledButton, StyledLink } from './Button.styles';

const Button = ({ link, children, ...props }) => {
    return link ? (
        <StyledLink to={link} {...props}>
            {children}
        </StyledLink>
    ) : (
        <StyledButton {...props}>{children}</StyledButton>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(['primary', 'secondary', 'icon']).isRequired,
    padding: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

Button.defaultProps = {
    type: 'primary',
    padding: '8px 25px',
    disabled: false
};

export default Button;
