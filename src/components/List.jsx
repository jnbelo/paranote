import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyledList, StyledListItem, ListWrapper } from './List.styles';
import { useEffect } from 'react';
import usePrevious from '../hooks/usePrevious';

const NO_SELECTION = { index: -1, item: null };

const List = ({ name, render, data, onSelectionChange }) => {
    const [selection, setSelection] = useState(NO_SELECTION);
    const prevSelection = usePrevious(selection);

    useEffect(() => {
        if (selection !== NO_SELECTION) {
            if (!data || data.length <= selection.index) {
                setSelection(NO_SELECTION);
            } else if (data && data.length > selection.index) {
                const item = data[selection.index];
                if (item && item !== selection.item) {
                    setSelection({ index: selection.index, item });
                }
            }
        }
    }, [data, selection]);

    useEffect(() => {
        if (onSelectionChange && prevSelection && selection !== prevSelection) {
            onSelectionChange(selection);
        }
    }, [selection, prevSelection, onSelectionChange]);

    const handleItemClick = (event, index) => {
        const item = data[index];

        if (item !== selection.item || index !== selection.index) {
            setSelection({ index, item });
        }
    };

    return (
        <ListWrapper>
            <StyledList>
                {data.map((item, index) => (
                    <StyledListItem
                        selected={index === selection.index}
                        key={item.id ? item.id : `${name}-item-${index}`}
                        onClick={(event) => handleItemClick(event, index)}
                    >
                        {render(item)}
                    </StyledListItem>
                ))}
            </StyledList>
        </ListWrapper>
    );
};

List.propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    render: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func
};

List.defaultProps = {
    data: []
};

export default List;
