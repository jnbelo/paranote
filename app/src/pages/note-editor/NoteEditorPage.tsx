import { faColumns, faFont, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MarkedViewer from '@jnbelo/react-marked';
import { debounce } from 'lodash';
import { MarkedOptions } from 'marked';
import React, { useRef, useState } from 'react';
import AceEditor from 'react-ace';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import ButtonToggle from '../../components/ButtonToggle/ButtonToggle';
import TextField from '../../components/TextField/TextField';
import { Note, NoteUpdate } from '../../redux/interfaces/notes.interfaces';
import { selectNote } from '../../redux/selectors/ui.selectors';
import { updateNote } from '../../redux/thunks/notes.thunks';
import './NoteEditorPage.scss';

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

    const [editTitle, setEditTitle] = useState<boolean>(false);
    const [mode, setMode] = useState<'edit' | 'view' | 'both'>('view');

    function handleTitleClick() {
        if (!editTitle) {
            setEditTitle(true);
        }
    }

    function handleTitleChange(value: string) {
        if (note) {
            dispatch(
                updateNote({
                    id: note.id,
                    content: note.content,
                    title: value,
                    sourceId: note.sourceId
                })
            );
            debouncedSave.current(value, note.content, note);
        }

        if (editTitle) {
            setEditTitle(false);
        }
    }

    function handleTitleCancel() {
        if (editTitle) {
            setEditTitle(false);
        }
    }

    function handleContentChange(value: string) {
        if (note) {
            debouncedSave.current(note.title, value, note);
        }
    }

    function handleViewToggle(index: number) {
        if (index === 0) {
            setMode('edit');
        } else if (index === 1) {
            setMode('both');
        } else if (index === 2) {
            setMode('view');
        }
    }

    return (
        <div className="pl-3 pr-3 is-fullheight">
            {note && (
                <div className="is-flex is-flex-direction-column is-fullheight">
                    <nav className="level">
                        <div className="level-left">
                            <div className="level-item">
                                <p
                                    className="subtitle is-5 is-clickable"
                                    onClick={handleTitleClick}
                                >
                                    {editTitle ? (
                                        <TextField
                                            autoFocus={true}
                                            value={note.title}
                                            onSubmit={handleTitleChange}
                                            onCancel={handleTitleCancel}
                                        />
                                    ) : (
                                        <strong>{note.title}</strong>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                <ButtonToggle
                                    onSelect={handleViewToggle}
                                    buttons={[
                                        <span className="icon is-small">
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </span>,
                                        <span className="icon is-small ">
                                            <FontAwesomeIcon icon={faColumns} />
                                        </span>,
                                        <span className="icon is-small">
                                            <FontAwesomeIcon icon={faFont} />
                                        </span>
                                    ]}
                                    defaultIndex={2}
                                />
                            </div>
                        </div>
                    </nav>
                    <div className="is-fullheight">
                        {mode === 'view' && (
                            <div className="markdown">
                                <MarkedViewer
                                    content={note.content}
                                    options={{
                                        gfm: true
                                    }}
                                    overrides={
                                        {
                                            renderer: {
                                                link(
                                                    href: string | null,
                                                    title: string | null,
                                                    text: string
                                                ): string {
                                                    return `<a href=${href} title=${title} target="_blank">${text}</a>`;
                                                }
                                            }
                                        } as MarkedOptions
                                    }
                                />
                            </div>
                        )}
                        {mode === 'edit' && (
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
                        )}
                        {mode === 'both' && (
                            <SplitPane split="vertical" defaultSize="50%">
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
                                <div className="markdown">
                                    <MarkedViewer
                                        content={note.content}
                                        options={{
                                            gfm: true
                                        }}
                                        overrides={
                                            {
                                                renderer: {
                                                    link(
                                                        href: string | null,
                                                        title: string | null,
                                                        text: string
                                                    ): string {
                                                        return `<a href=${href} title=${title} target="_blank">${text}</a>`;
                                                    }
                                                }
                                            } as MarkedOptions
                                        }
                                    />
                                </div>
                            </SplitPane>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
