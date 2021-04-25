import React, { FormEvent, KeyboardEvent, useState } from 'react';
import { TextFieldProps } from './TextFieldProps';

export default function TextField({
    placeholder,
    value,
    autoFocus,
    onSubmit,
    onCancel
}: TextFieldProps): JSX.Element {
    const [inputValue, setInputValue] = useState<string>(value);

    function handleValueChange(event: FormEvent<HTMLInputElement>) {
        setInputValue(event.currentTarget.value);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter' && onSubmit) {
            onSubmit(inputValue);
        } else if (event.key === 'Escape' && onCancel) {
            onCancel(inputValue);
        }
    }

    function handleBlur() {
        if (onSubmit) {
            onSubmit(inputValue);
        }
    }

    return (
        <input
            autoFocus={autoFocus}
            className="input"
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        ></input>
    );
}
