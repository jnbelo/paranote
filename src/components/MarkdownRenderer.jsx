import MarkedViewer from '@jnbelo/react-marked';
import PropTypes from 'prop-types';
import React from 'react';
import { MarkdownWrapper } from './MarkdownRenderer.styles';

const MarkdownRenderer = ({ note }) => {
    const renderer = {
        link(href, title, text) {
            return `
                  <a href="${href}" title="${title}" target="_blank">
                    ${text}
                  </a>`;
        }
    };

    return (
        <MarkdownWrapper>
            <MarkedViewer
                content={note.content}
                options={{ gfm: true, breaks: true }}
                overrides={renderer}
            />
        </MarkdownWrapper>
    );
};

MarkdownRenderer.propTypes = {
    note: PropTypes.object.isRequired
};

export default MarkdownRenderer;
