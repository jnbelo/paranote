import { Field } from 'formik';
import React from 'react';

import { FormTextFieldProps } from './FormTextFieldProps';

export default function FormTextField({
    id,
    label,
    placeholder,
    type = 'text',
    error
}: FormTextFieldProps): JSX.Element {
    return (
        <div className="field">
            <label htmlFor={id} className="label">
                {label}
            </label>
            <div className="control">
                <Field
                    id={id}
                    name={id}
                    className="input is-small"
                    type={type}
                    placeholder={placeholder}
                />
            </div>
            {error && <p className="help is-danger">{error}</p>}
        </div>
    );
}
