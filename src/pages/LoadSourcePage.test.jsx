import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { addSource } from '../store/source-manager';
import { loadSource } from '../store/sqlite/database';
import LoadSourcePage from './LoadSourcePage';
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
                    render={() => <LoadSourcePage linkClose={redirectUrl} />}
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
    expect(screen.getByRole('heading')).toHaveTextContent('Load Existing Source');
});

it('should close page when close link is used', () => {
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByTestId('redirect')).toHaveTextContent(redirectUrl);
});

it('should show errors if the form is not filled', () => {
    fireEvent.click(screen.getByText('Load'));
    expect(screen.queryByText('A location is required for the new source')).not.toBeNull();
});

it('should invoke source load if required fields are filled', async () => {
    const expectedLocation = './test.parax';
    const expectedPassword = 'Password';

    ipcRenderer.invoke.mockImplementation(() => {
        return expectedLocation;
    });

    loadSource.mockImplementation(() => {
        return {
            name: 'Test Name',
            location: expectedLocation,
            password: expectedPassword
        };
    });

    fireEvent.click(screen.getByText('...'));
    fireEvent.change(screen.getByLabelText('Password (optional)'), {
        target: { value: expectedPassword }
    });
    await waitFor(() => expect(screen.getByLabelText('Location')).toHaveValue(expectedLocation));

    fireEvent.click(screen.getByText('Load'));

    await waitFor(() => expect(loadSource).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(addSource).toHaveBeenCalledTimes(1));

    expect(loadSource).toHaveBeenCalledWith(expectedLocation, expectedPassword);
    expect(addSource).toHaveBeenCalledWith({
        name: 'Test Name',
        location: expectedLocation,
        password: expectedPassword
    });
});

it('should show error if an exception occurs', async () => {
    const expectedLocation = 'test.parax';
    const expectedPassword = 'Password';

    ipcRenderer.invoke.mockImplementation(() => {
        return expectedLocation;
    });

    loadSource.mockImplementation(() => {
        throw new Error('This is an exception');
    });

    fireEvent.click(screen.getByText('...'));
    fireEvent.change(screen.getByLabelText('Password (optional)'), {
        target: { value: expectedPassword }
    });
    await waitFor(() => expect(screen.getByLabelText('Location')).toHaveValue(expectedLocation));

    fireEvent.click(screen.getByText('Load'));

    await waitFor(() => screen.findByText('This is an exception'));
    expect(loadSource).toHaveBeenCalledWith(expectedLocation, expectedPassword);
});
