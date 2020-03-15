import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import NoteEditorPage from './NoteEditorPage';

beforeAll(cleanup);
afterEach(cleanup);

const createProps = () => {
    return {
        source: { id: 'source_id', updateNote: jest.fn() },
        note: { id: 'note_id', title: 'note title', content: 'note content' },
        onUpdated: jest.fn()
    };
};

let props;
beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    props = createProps();
    render(<NoteEditorPage {...props} />);
});

it('should render page', () => {
    expect(screen.queryByDisplayValue(props.note.title)).not.toBeNull();
});

it('should schedule an update when title changes', async () => {
    const { onUpdated, source, note } = props;
    jest.useFakeTimers();
    const expectedTitle = 'new title';

    fireEvent.change(screen.getByPlaceholderText('Title'), {
        target: { value: expectedTitle }
    });

    jest.runOnlyPendingTimers();
    await waitFor(() => expect(source.updateNote).toHaveBeenCalledTimes(1));
    expect(source.updateNote).toHaveBeenCalledWith({
        id: note.id,
        title: expectedTitle,
        content: note.content
    });
    await waitFor(() => expect(onUpdated).toHaveBeenCalledTimes(1));
    expect(onUpdated).toHaveBeenCalledWith(source);
});
