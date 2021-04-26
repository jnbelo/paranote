import React, { useEffect, useState } from 'react';
import { ButtonToggleProps } from './ButtonToggleProps';

export default function ButtonToggle({
    buttons,
    onSelect,
    defaultIndex
}: ButtonToggleProps): JSX.Element {
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex ?? 0);

    useEffect(() => {
        if (onSelect) {
            onSelect(selectedIndex);
        }
    }, [selectedIndex, onSelect]);

    return (
        <div className="field has-addons">
            {buttons.map((button, index) => (
                <p className="control">
                    <button
                        className={`button is-dark ${selectedIndex === index ? 'is-active' : ''}`}
                        onClick={() => setSelectedIndex(index)}
                    >
                        {button}
                    </button>
                </p>
            ))}
        </div>
    );
}
