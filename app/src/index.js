import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import store from './redux/store';

const theme = {
    background: '#1e1e1e',

    button: {
        primary: {
            background: '#0e639c',
            hoverBackground: '#1177bb',
            textColor: '#ffffff',
            hoverTextColor: '#ffffff',
            svgColor:
                'invert(100%) sepia(0%) saturate(27%) hue-rotate(74deg) brightness(106%) contrast(106%)',
            hoverSvgColor:
                'invert(100%) sepia(0%) saturate(27%) hue-rotate(74deg) brightness(106%) contrast(106%)'
        },
        secondary: {
            background: '#252526',
            hoverBackground: '#252526',
            textColor: '#828182',
            hoverTextColor: '#ffffff',
            svgColor:
                'invert(55%) sepia(5%) saturate(59%) hue-rotate(251deg) brightness(92%) contrast(89%)',
            hoverSvgColor:
                'invert(100%) sepia(0%) saturate(27%) hue-rotate(74deg) brightness(106%) contrast(106%)'
        },
        icon: {
            background: 'transparent',
            hoverBackground: 'transparent',
            textColor: '#828182',
            hoverTextColor: '#ffffff',
            svgColor:
                'invert(55%) sepia(5%) saturate(59%) hue-rotate(251deg) brightness(92%) contrast(89%)',
            hoverSvgColor:
                'invert(100%) sepia(0%) saturate(27%) hue-rotate(74deg) brightness(106%) contrast(106%)'
        }
    },

    textColor: '#cccccc',

    textFieldBackground: '#3c3c3c',
    textFieldTextColor: '#cccccc',
    textFieldFocusBorder: '#0e639c',

    browseButtonBackground: '#292929',
    browseButtonHoverBackground: '#4d4d4d',
    browseButtonTextColor: '#828182',

    errorColor: '#f43535',

    listBackgroundColor: '#1e1e1e',
    listTrackBackgroundColor: '#1e1e1e',
    listScrollThumbColor: '#555555',
    listSelectionColor: '#0e639c',

    mainColumnBorderColor: '#383838',

    toolbarBackgroundColor: '#252526',

    titlePanelBackgroundColor: '#252526',
    titlePanelTextColor: '#cccccc'
};

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
