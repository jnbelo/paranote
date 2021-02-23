import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Button from './Button';

beforeAll(cleanup);
afterEach(cleanup);

const theme = {
    button: {
        primary: {},
        secondary: {},
        icon: {}
    }
};

const Content = () => {
    return <p>Button!</p>;
};

it('should be rendered from button', () => {
    render(
        <ThemeProvider theme={theme}>
            <Button type="primary">
                <Content />
            </Button>
        </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Button!');
});

it('should be rendered from link', () => {
    render(
        <ThemeProvider theme={theme}>
            <MemoryRouter>
                <Button type="primary" link="/test">
                    <Content />
                </Button>
            </MemoryRouter>
        </ThemeProvider>
    );

    expect(screen.getByRole('link')).toHaveTextContent('Button!');
});

it('should trigger onClick', () => {
    const onClick = jest.fn();
    render(
        <ThemeProvider theme={theme}>
            <Button type="primary" onClick={onClick}>
                <Content />
            </Button>
        </ThemeProvider>
    );

    expect(onClick).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByText('Button!'));
    expect(onClick).toHaveBeenCalledTimes(1);
});
