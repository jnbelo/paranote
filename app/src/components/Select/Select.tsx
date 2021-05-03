import React, { useState } from 'react';
import './Select.scss';
import { SelectProps } from './SelectProps';

export default function Select({
    className,
    initialValue,
    options,
    onChange
}: SelectProps): JSX.Element {
    const [value, setValue] = useState<string>(initialValue ?? '');

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newValue = event.target.value;
        setValue(newValue);
        onChange(newValue);
    }

    return (
        <div className={`select${className ? ` ${className}` : ''}`}>
            <select onChange={handleChange} value={value}>
                {options.map(({ id, name }) => (
                    <option key={id} value={id}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
}
