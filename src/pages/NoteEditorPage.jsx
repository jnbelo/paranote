import React, { useEffect, useState, useRef } from 'react';
import AceEditor from 'react-ace';
import TextField from '../components/TextField';
import { EditorContent, EditorTitle, EditorWrapper } from './NoteEditorPage.styles';
import PropTypes from 'prop-types';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-twilight';
import log from '../utils/logging';

const NoteEditorPage = ({ source, note, onUpdated }) => {
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [update, setUpdate] = useState();
    const updateTimeoutRef = useRef(null);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle();
            setContent();
        }
    }, [note]);

    useEffect(() => {
        if (updateTimeoutRef.current != null) {
            clearTimeout(updateTimeoutRef.current);
        }

        if (update) {
            updateTimeoutRef.current = setTimeout(async () => {
                try {
                    await update.source.updateNote(update.noteUpdate);
                    updateTimeoutRef.current = null;
                    log.info(
                        `Updated note [noteId: ${update.noteUpdate.id}] [sourceId: ${update.source.id}]`
                    );

                    setUpdate(null);
                    onUpdated(update.source);
                } catch (error) {
                    log.error(
                        `Unable to update note [noteId: ${update.noteUpdate.id}] [sourceId: ${update.source.id}]`,
                        error
                    );
                }
            }, 750);
        }
    }, [update, onUpdated]);

    const handleTitleChange = (value) => {
        setTitle(value);
        scheduleUpdate(value, content);
    };

    const handleContentChange = (value) => {
        setContent(value);
        scheduleUpdate(title, value);
    };

    const scheduleUpdate = (newTitle, newContent) => {
        setUpdate({
            source: source,
            noteUpdate: { id: note.id, title: newTitle, content: newContent }
        });
    };

    if (!note) {
        return null;
    }

    return (
        <EditorWrapper>
            <EditorTitle>
                <TextField placeholder="Title" value={title} onChange={handleTitleChange} />
            </EditorTitle>
            <EditorContent>
                <AceEditor
                    mode="markdown"
                    theme="twilight"
                    onChange={handleContentChange}
                    value={content}
                    name="editor"
                    style={{ width: '100%', height: '100%' }}
                    showPrintMargin={false}
                    wrapEnabled={true}
                    enableBasicAutoCompletion={true}
                    showGutter={false}
                />
            </EditorContent>
        </EditorWrapper>
    );
};

NoteEditorPage.propTypes = {
    source: PropTypes.object.isRequired,
    note: PropTypes.object.isRequired,
    onUpdated: PropTypes.func.isRequired
};

export default NoteEditorPage;
