import { debounce } from 'lodash';
import React, { useCallback, useRef } from 'react';
import AceEditor from 'react-ace';
import { useDispatch, useSelector } from 'react-redux';
import { Note, NoteUpdate } from '../../redux/interfaces/notes.interfaces';
import { selectNote } from '../../redux/selectors/ui.selectors';
import { updateNote } from '../../redux/thunks/notes.thunks';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-twilight';

export default function NoteEditorPage(): JSX.Element {
    const dispatch = useDispatch();
    const note = useSelector(selectNote);

    const pendingUpdates = useRef<{ [key: string]: NoteUpdate }>({});
    const debouncedUpdate = useRef(
        debounce(() => {
            Object.keys(pendingUpdates.current).forEach((key) => {
                const update = pendingUpdates.current[key];
                dispatch(updateNote(update));
            });
            pendingUpdates.current = {};
        }, 1000)
    );
    const debouncedSave = useRef((title: string, content: string, note: Note) => {
        pendingUpdates.current[note.sourceId + '_' + note.id] = {
            id: note.id,
            content,
            title,
            sourceId: note.sourceId
        };

        debouncedUpdate.current();
    });

    function handleContentChange(value: string) {
        if (note) {
            debouncedSave.current(note.title, value, note);
        }
    }

    return (
        <div className="pl-3 pr-3 is-fullheight">
            {note && (
                <div className="is-flex is-flex-direction-column is-fullheight">
                    <nav className="level">
                        <div className="level-left">
                            <div className="level-item">
                                <p className="subtitle is-5">
                                    <strong>{note.title}</strong>
                                </p>
                            </div>
                        </div>
                    </nav>
                    <div className="is-fullheight">
                        <AceEditor
                            mode="markdown"
                            theme="twilight"
                            onChange={handleContentChange}
                            value={note.content}
                            name="editor"
                            style={{ width: '100%', height: '100%' }}
                            showPrintMargin={false}
                            wrapEnabled={true}
                            enableBasicAutocompletion={true}
                            showGutter={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
