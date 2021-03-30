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
import { sortNotesBy, selectNote } from '../../redux/slices/ui.slice';
import NoteEditorPage from '../note-editor/NoteEditorPage';

import { compareDate, compareString } from '../../utils/compare.helper';
import { parseISO } from 'date-fns';
import { SortBy } from '../../redux/interfaces/ui.interfaces';
import { Note } from '../../redux/interfaces/notes.interfaces';

export default function NoteListPage(): JSX.Element {
    const dispatch = useDispatch();
    const selectedSource = useSelector(selectSource);
    const notes = useSelector(selectNotes);
    const sortBy = useSelector((state: RootState) => state.ui.sortNotesBy);

    const onNewNoteClick = async () => {
        if (selectedSource) {
            await dispatch(createNote(selectedSource.id));
        }
    };

    const onOrderByClick = (value: SortBy) => {
        dispatch(sortNotesBy(value));
    };

    const onSelectionChange = (note: Note, index: number) => {
        if (note) {
            dispatch(selectNote(note?.id));
        }
    };

    const sortByToText = (value: SortBy): string => {
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

    const getSortBy = () => {
        switch (sortBy) {
            case 'createdAt':
            case 'updatedAt':
                return (a: Note, b: Note) => compareDate(parseISO(a[sortBy]), parseISO(b[sortBy]));
            case 'title':
                return (a: Note, b: Note) => compareString(a.title, b.title);
        }
    };

    return (
        <SplitPane split="vertical" minSize="10%" defaultSize="20%">
            <div className="is-flex-direction-column is-fullheight">
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="navbar-menu">
                        <div className="navbar-start">
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link">{sortByToText(sortBy)}</a>

                                <div className="navbar-dropdown">
                                    {['createdAt', 'updatedAt', 'title']
                                        .map((item) => item as SortBy)
                                        .map((item) => (
                                            <a
                                                key={item}
                                                onClick={() => onOrderByClick(item)}
                                                className="navbar-item"
                                            >
                                                {sortByToText(item)}
                                            </a>
                                        ))}
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
                <List<Note>
                    items={notes}
                    sortBy={getSortBy()}
                    onSelectionChange={onSelectionChange}
                    render={(note) => (
                        <div className="is-flex-direction-column p-2 has-border-bottom-1">
                            <h3 className="has-text-weight-semibold">{note.title}</h3>
                            <div className="has-text-right is-size-7 is-italic">
                                Created
                                <TimeAgo timestamp={note.createdAt} />
                            </div>
                        </div>
                    )}
                />
            </div>
            <NoteEditorPage />
        </SplitPane>
    );
}
