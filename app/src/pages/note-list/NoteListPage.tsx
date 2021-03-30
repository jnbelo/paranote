import './NoteListPage.scss';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import List from '../../components/List/List';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import { selectNotes, selectSource } from '../../redux/selectors/ui.selectors';
import { RootState } from '../../redux/store';
import { createNote } from '../../redux/thunks/notes.thunks';
import { OrderBy } from '../../redux/interfaces/ui.interfaces';
import { orderNotesBy, selectNote } from '../../redux/slices/ui.slice';
import NoteEditorPage from '../note-editor/NoteEditorPage';

export default function NoteListPage(): JSX.Element {
    const dispatch = useDispatch();
    const selectedSource = useSelector(selectSource);
    const notes = useSelector(selectNotes);
    const orderBy = useSelector((state: RootState) => state.ui.orderNotesBy);

    const onNewNoteClick = async () => {
        if (selectedSource) {
            await dispatch(createNote(selectedSource.id));
        }
    };

    const onOrderByClick = (value: OrderBy) => {
        dispatch(orderNotesBy(value));
    };

    const onSelectionChange = (index: number) => {
        if (index >= 0 && index < notes.length) {
            dispatch(selectNote(notes[index].id));
        }
    };

    const orderByToText = (value: OrderBy): string => {
        switch (value) {
            case 'createdAt':
                return 'Creation';
            case 'updatedAt':
                return 'Update';
            case 'title':
                return 'Title';
            default:
                return 'None';
        }
    };

    return (
        <SplitPane split="vertical" minSize="10%" defaultSize="20%">
            <div className="is-flex-direction-column is-fullheight">
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="navbar-menu">
                        <div className="navbar-start">
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link">{orderByToText(orderBy)}</a>
                                <div className="navbar-dropdown">
                                    <a
                                        onClick={() => onOrderByClick('createdAt')}
                                        className="navbar-item"
                                    >
                                        {orderByToText('createdAt')}
                                    </a>
                                    <a
                                        onClick={() => onOrderByClick('updatedAt')}
                                        className="navbar-item"
                                    >
                                        {orderByToText('updatedAt')}
                                    </a>
                                    <a
                                        onClick={() => onOrderByClick('title')}
                                        className="navbar-item"
                                    >
                                        {orderByToText('title')}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="buttons">
                                    <button
                                        className="button is-small is-dark"
                                        onClick={onNewNoteClick}
                                    >
                                        <span className="icon is-small">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                        <strong>New</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <List onSelectionChange={onSelectionChange}>
                    {notes.map((note, index) => (
                        <div className="is-flex-direction-column p-2 has-border-bottom-1">
                            <h3 className="has-text-weight-semibold">{note.title}</h3>
                            <div className="has-text-right is-size-7 is-italic">
                                Created
                                <TimeAgo timestamp={note.createdAt} />
                            </div>
                        </div>
                    ))}
                </List>
            </div>
            <NoteEditorPage />
        </SplitPane>
    );
}
