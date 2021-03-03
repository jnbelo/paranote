import { Field, FieldProps, FormikProps } from 'formik';
import React from 'react';
import { FormBrowserFieldProps } from './FormBrowserFieldProps';

export default function FormBrowserField({
    id,
    label,
    placeholder,
    browserLabel = 'Browse',
    error,
    onBrowse
}: FormBrowserFieldProps): JSX.Element {
    async function onBrowseClick(form: FormikProps<unknown>) {
        const result = await onBrowse();
        form.setFieldValue(id, result);
    }

    return (
        <div className="field">
            <label htmlFor={id} className="label">
                {label}
            </label>
            <Field
                id={id}
                name={id}
                render={({ field, form }: FieldProps) => (
                    <div className="field has-addons">
                        <div className="control is-expanded">
                            <input
                                type="text"
                                className="input is-small"
                                placeholder={placeholder}
                                readOnly={true}
                                {...field}
                            />
                        </div>
                        <div className="control">
                            <button
                                className="button is-small is-dark"
                                type="button"
                                onClick={() => onBrowseClick(form)}
                            >
                                {browserLabel}
                            </button>
                        </div>
                    </div>
                )}
            />
            {error && <p className="help is-danger">{error}</p>}
        </div>
    );
}
