import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '../components/TextField';
import log from '../utils/logging';
import { EditorContent, EditorTitle, EditorWrapper } from './NoteEditorPage.styles';
import { updateNote } from '../redux/thunks/notes.thunks';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-twilight';

const NoteEditorPage = () => {
    const dispatch = useDispatch();
    const source = useSelector((state) => state.ui.selectedSource);
    const note = useSelector((state) => state.ui.selectedNote);

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
    }, [source, note]);

    useEffect(() => {
        if (updateTimeoutRef.current != null) {
            clearTimeout(updateTimeoutRef.current);
        }

        if (update) {
            updateTimeoutRef.current = setTimeout(async () => {
                try {
                    await dispatch(updateNote({ source, note, noteUpdate: update.noteUpdate }));
                    updateTimeoutRef.current = null;
                    log.info(
                        `Updated note [noteId: ${update.note.id}] [sourceId: ${update.source.id}]`
                    );

                    setUpdate(null);
                } catch (error) {
                    log.error(
                        `Unable to update note [noteId: ${update.note.id}] [sourceId: ${update.source.id}]`,
                        error
                    );
                }
            }, 750);
        }
    }, [update]);

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
            source,
            note,
            noteUpdate: { title: newTitle, content: newContent }
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

NoteEditorPage.propTypes = {};

export default NoteEditorPage;
