import {
    act,
    cleanup,
    render,
    screen,
    fireEvent,
    waitFor,
    waitForElementToBeRemoved
} from '@testing-library/react';
import moment from 'moment';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import NoteListPage from './NoteListPage';
import { getSource } from '../store/source-manager';

jest.mock('../store/source-manager');

beforeAll(cleanup);
beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
});
afterEach(cleanup);

const theme = {
    button: {
        primary: {},
        secondary: {},
        icon: {}
    }
};

const otherSource = {
    id: 'source_id_2',
    name: 'source name',
    getNotes: jest.fn(() => [
        {
            id: 'note_3',
            title: 'note title 3',
            content: 'note content 3',
            createdAt: moment(),
            updatedAt: moment()
        }
    ]),
    createNote: jest.fn(),
    removeNote: jest.fn(),
    updateNote: jest.fn()
};

const createProps = () => {
    return {
        source: {
            id: 'source_id',
            name: 'source name',
            getNotes: jest.fn(() => [
                {
                    id: 'note_1',
                    title: 'note title',
                    content: 'note content',
                    createdAt: moment(),
                    updatedAt: moment()
                },
                {
                    id: 'note_2',
                    title: 'note title 2',
                    content: 'note content 2',
                    createdAt: moment(),
                    updatedAt: moment()
                }
            ]),
            createNote: jest.fn(() => {
                return {
                    id: 'new_note',
                    title: 'new note',
                    content: 'new note content'
                };
            }),
            removeNote: jest.fn(),
            updateNote: jest.fn()
        }
    };
};

let props;
let renderResult;
beforeEach(async () => {
    props = createProps();
    await act(async () => {
        renderResult = render(
            <ThemeProvider theme={theme}>
                <NoteListPage {...props} />
            </ThemeProvider>
        );
    });
});

it('should render page', () => {
    expect(screen.queryByText('Notes')).not.toBeNull();
    expect(screen.queryByText('note title')).not.toBeNull();
});

it('should update source', async () => {
    const { rerender } = renderResult;
    props.source = otherSource;
    await act(async () =>
        rerender(
            <ThemeProvider theme={theme}>
                <NoteListPage {...props} />
            </ThemeProvider>
        )
    );

    expect(screen.queryByText('note title 3')).not.toBeNull();
});

it('should select note', async () => {
    fireEvent.click(screen.getByText('note title'));
    await waitFor(() => expect(screen.getByPlaceholderText('Title')).toHaveValue('note title'));
});

it('should create a new note', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'create' }));
    await waitFor(() => expect(props.source.createNote).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(props.source.getNotes).toHaveBeenCalledTimes(2));
});

it('should delete an existing note', async () => {
    fireEvent.click(screen.getByText('note title'));
    await waitFor(() => screen.getByRole('button', { name: 'delete' }));

    fireEvent.click(screen.getByRole('button', { name: 'delete' }));
    await waitFor(() => expect(props.source.removeNote).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(props.source.getNotes).toHaveBeenCalledTimes(2));
});

it('should update fetch notes after existing note update', async () => {
    const { source } = props;
    const expectedTitle = 'new title in existing note';
    jest.useFakeTimers();

    fireEvent.click(screen.getByText('note title'));
    fireEvent.change(screen.getByPlaceholderText('Title'), {
        target: { value: expectedTitle }
    });

    jest.runOnlyPendingTimers();
    await waitFor(() => expect(source.getNotes).toHaveBeenCalledTimes(1));
});
