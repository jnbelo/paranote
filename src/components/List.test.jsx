import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import List from './List';

const Item = (props) => {
    return <p>{props.item.name}</p>;
};

beforeAll(cleanup);
afterEach(cleanup);

it('should be rendered from data', () => {
    const data = [{ name: 'test_1' }, { name: 'test_2' }, { name: 'test_3' }];
    const { container } = render(
        <List name="test" data={data} render={(item) => <Item item={item} />}></List>
    );

    const list = container.querySelector('ul');
    expect(list).not.toBeNull();

    const elements = list.querySelectorAll('li');
    expect(elements).toHaveLength(3);
    expect(elements[0]).toHaveTextContent('test_1');
    expect(elements[1]).toHaveTextContent('test_2');
    expect(elements[2]).toHaveTextContent('test_3');
});

it('should fire event on list selection', () => {
    const onSelectionChange = jest.fn();
    const data = [{ name: 'test_1' }, { name: 'test_2' }, { name: 'test_3' }];
    render(
        <List
            name="test"
            data={data}
            onSelectionChange={onSelectionChange}
            render={(item) => <Item item={item} />}
        ></List>
    );

    expect(onSelectionChange).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('test_2'));

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenLastCalledWith({
        item: data[1],
        index: 1
    });
});

it('should fire event on data change', () => {
    const onSelectionChange = jest.fn();
    let data = [{ name: 'test_1' }, { name: 'test_2' }, { name: 'test_3' }];
    const { rerender } = render(
        <List
            name="test"
            data={data}
            onSelectionChange={onSelectionChange}
            render={(item) => <Item item={item} />}
        ></List>
    );

    fireEvent.click(screen.getByText('test_2'));

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenLastCalledWith({
        item: data[1],
        index: 1
    });

    data = [{ name: 'test_1' }, { name: 'test_3' }];

    rerender(
        <List
            name="test"
            data={data}
            onSelectionChange={onSelectionChange}
            render={(item) => <Item item={item} />}
        ></List>
    );

    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith({
        item: data[1],
        index: 1
    });
});

it('should reset selection on inexistent item', () => {
    const onSelectionChange = jest.fn();
    let data = [{ name: 'test_1' }, { name: 'test_2' }, { name: 'test_3' }];
    const { rerender } = render(
        <List
            name="test"
            data={data}
            onSelectionChange={onSelectionChange}
            render={(item) => <Item item={item} />}
        ></List>
    );

    fireEvent.click(screen.getByText('test_3'));

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenLastCalledWith({
        item: data[2],
        index: 2
    });

    data = [{ name: 'test_1' }, { name: 'test_2' }];

    rerender(
        <List
            name="test"
            data={data}
            onSelectionChange={onSelectionChange}
            render={(item) => <Item item={item} />}
        ></List>
    );

    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith({
        item: null,
        index: -1
    });
});

it('should reset selection on empty data', () => {
    const onSelectionChange = jest.fn();
    let data = [{ name: 'test_1' }, { name: 'test_2' }, { name: 'test_3' }];
    const { rerender } = render(
        <List
            name="test"
            data={data}
            onSelectionChange={onSelectionChange}
            render={(item) => <Item item={item} />}
        ></List>
    );

    fireEvent.click(screen.getByText('test_3'));

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenLastCalledWith({
        item: data[2],
        index: 2
    });

    data = [];

    rerender(
        <List
            name="test"
            data={data}
            onSelectionChange={onSelectionChange}
            render={(item) => <Item item={item} />}
        ></List>
    );

    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith({
        item: null,
        index: -1
    });
});
