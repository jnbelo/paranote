import React, { useEffect, useState } from 'react';
import './List.scss';
import { ListProps } from './ListProps';

export default function List<T>({
    items,
    render,
    sortBy,
    onSelectionChange
}: ListProps<T>): JSX.Element {
    const [selection, setSelection] = useState(-1);
    const [sortedItems, setSortedItems] = useState(items);

    useEffect(() => {
        setSortedItems(sortBy ? items.sort(sortBy) : items);
    }, [sortBy, items]);

    const onItemClick = (item: T, index: number) => {
        setSelection(index);

        if (onSelectionChange) {
            onSelectionChange(item, index);
        }
    };

    return (
        <div className="is-scrollable">
            <div className="is-flex is-flex-direction-column">
                {sortedItems.map((item, index) => (
                    <div
                        key={`item-${index}`}
                        className={`list-item ${
                            selection === index ? 'is-list-item-selected' : ''
                        }`}
                        onClick={() => onItemClick(item, index)}
                    >
                        {render(item)}
                    </div>
                ))}
            </div>
        </div>
    );
}
