import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { addSource } from '../store/source-manager';
import { createSource } from '../store/sqlite/database';
import CreateSourcePage from './CreateSourcePage';
jest.mock('../store/sqlite/database');
jest.mock('../store/source-manager');
jest.mock(
    'electron',
    () => {
        return {
            ipcRenderer: { invoke: jest.fn() }
        };
    },
    { virtual: true }
);

const theme = {
    button: {
        primary: {},
        secondary: {},
        icon: {}
    }
};

const redirectUrl = '/closed';

beforeAll(cleanup);
afterEach(cleanup);

beforeEach(() => {
    jest.clearAllMocks();

    render(
        <ThemeProvider theme={theme}>
            <MemoryRouter>
                <Route
                    path="/"
                    exact={true}
                    render={() => <CreateSourcePage linkClose={redirectUrl} />}
                />
                <Route
                    path={redirectUrl}
                    render={() => <div data-testid="redirect">{redirectUrl}</div>}
                />
            </MemoryRouter>
        </ThemeProvider>
    );
});

it('should render page', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('Create New Source');
});

it('should close page when close link is used', () => {
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByTestId('redirect')).toHaveTextContent(redirectUrl);
});

it('should show errors if the form is not filled', () => {
    fireEvent.click(screen.getByText('Create'));
    expect(screen.queryByText('A name is required for the new source')).not.toBeNull();
    expect(screen.queryByText('A location is required for the new source')).not.toBeNull();
});

it('should invoke source creation if required fields are filled', async () => {
    const expectedName = 'Test Name';
    const expectedLocation = './test.parax';
    const expectedPassword = 'Password';

    ipcRenderer.invoke.mockImplementation(() => {
        return expectedLocation;
    });

    createSource.mockImplementation(() => {
        return {
            name: expectedName,
            location: expectedLocation,
            password: expectedPassword
        };
    });

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: expectedName } });
    fireEvent.click(screen.getByText('...'));
    fireEvent.change(screen.getByLabelText('Password (optional)'), {
        target: { value: expectedPassword }
    });
    await waitFor(() => expect(screen.getByLabelText('Location')).toHaveValue(expectedLocation));

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => expect(createSource).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(addSource).toHaveBeenCalledTimes(1));

    expect(createSource).toHaveBeenCalledWith(expectedName, expectedLocation, expectedPassword);
    expect(addSource).toHaveBeenCalledWith({
        name: expectedName,
        location: expectedLocation,
        password: expectedPassword
    });
});

it('should fix the file extension if empty', async () => {
    const expectedName = 'Test Name';
    const expectedLocation = 'test.parax';
    const expectedPassword = 'Password';

    ipcRenderer.invoke.mockImplementation(() => {
        return 'test';
    });

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: expectedName } });
    fireEvent.click(screen.getByText('...'));
    fireEvent.change(screen.getByLabelText('Password (optional)'), {
        target: { value: expectedPassword }
    });
    await waitFor(() => expect(screen.getByLabelText('Location')).toHaveValue(expectedLocation));
});

it('should show error if an exception occurs', async () => {
    const expectedName = 'Test Name';
    const expectedLocation = 'test.parax';
    const expectedPassword = 'Password';

    ipcRenderer.invoke.mockImplementation(() => {
        return expectedLocation;
    });

    createSource.mockImplementation(() => {
        throw new Error('This is an exception');
    });

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: expectedName } });
    fireEvent.click(screen.getByText('...'));
    fireEvent.change(screen.getByLabelText('Password (optional)'), {
        target: { value: expectedPassword }
    });
    await waitFor(() => expect(screen.getByLabelText('Location')).toHaveValue(expectedLocation));

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => screen.findByText('This is an exception'));
    expect(createSource).toHaveBeenCalledWith(expectedName, expectedLocation, expectedPassword);
});
