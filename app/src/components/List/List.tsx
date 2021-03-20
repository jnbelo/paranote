import React, { useState } from 'react';
import './List.scss';
import { ListProps } from './ListProps';

export default function List({ children, onSelectionChange }: ListProps): JSX.Element {
    const [selection, setSelection] = useState(-1);

    const onItemClick = (index: number) => {
        setSelection(index);

        if (onSelectionChange) {
            onSelectionChange(index);
        }
    };

    return (
        <div className="is-scrollable">
            <div className="is-flex is-flex-direction-column">
                {children?.map((child, index) => (
                    <div
                        key={`item-${index}`}
                        className={`list-item ${
                            selection === index ? 'is-list-item-selected' : ''
                        }`}
                        onClick={() => onItemClick(index)}
                    >
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
}
