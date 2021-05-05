import React, { useEffect, useState } from 'react';
import './List.scss';
import { ListProps } from './ListProps';

export default function List<T>({
    items: initialItems,
    areSame,
    render,
    onSelectionChange
}: ListProps<T>): JSX.Element {
    const [selection, setSelection] = useState<{
        index: number;
        item: T | undefined | null;
    } | null>();
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(initialItems);

        if (selection?.item) {
            const itemIndex = initialItems.findIndex((i) => areSame(i, selection.item));

            if (itemIndex > -1 && itemIndex !== selection.index) {
                selectItem(initialItems[itemIndex], itemIndex);
            } else if (itemIndex == -1) {
                selectItem(null, -1);
            }
        }
    }, [initialItems]);

    function selectItem(item: T | null, index: number) {
        if (!item) {
            setSelection(null);
        } else {
            setSelection({ index, item });
        }

        if (onSelectionChange) {
            onSelectionChange(item, index);
        }
    }

    return (
        <div className="is-scrollable">
            <div className="is-flex is-flex-direction-column">
                {items.map((item, index) => (
                    <div
                        key={`item-${index}`}
                        className={`list-item ${
                            selection?.index === index ? 'is-list-item-selected' : ''
                        }`}
                        onClick={() => selectItem(item, index)}
                    >
                        {render(item)}
                    </div>
                ))}
            </div>
        </div>
    );
}
