import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO } from 'date-fns';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import List from '../../components/List/List';
import Select from '../../components/Select/Select';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import { Note } from '../../redux/interfaces/notes.interfaces';
import { SortBy } from '../../redux/interfaces/ui.interfaces';
import { selectedSourceSelector, selectNotes } from '../../redux/selectors/ui.selectors';
import { selectNote, sortNotesBy } from '../../redux/slices/ui.slice';
import { RootState } from '../../redux/store';
import { createNote } from '../../redux/thunks/notes.thunks';
import { compareDate, compareString } from '../../utils/compare.helper';
import NoteEditorPage from '../note-editor/NoteEditorPage';
import './NoteListPage.scss';

export default function NoteListPage(): JSX.Element {
    const dispatch = useDispatch();
    const selectedSource = useSelector(selectedSourceSelector);
    const notes = useSelector(selectNotes);
    const sortBy = useSelector((state: RootState) => state.ui.sortNotesBy);

    const onNewNoteClick = async () => {
        if (selectedSource) {
            await dispatch(createNote(selectedSource.id));
        }
    };

    const handleOrderByChange = (value: string) => {
        dispatch(sortNotesBy(value as SortBy));
    };

    const onSelectionChange = (note: Note, index: number) => {
        if (note) {
            dispatch(selectNote(note?.id));
        }
    };

    const sortByToText = (value: SortBy | string): string => {
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
                <nav className="level p-3 m-0">
                    <div className="level-left">
                        <div className="level-item">
                            <Select
                                className="is-small"
                                options={['createdAt', 'updatedAt', 'title'].map((item) => ({
                                    id: item.toString(),
                                    name: sortByToText(item)
                                }))}
                                onChange={handleOrderByChange}
                            ></Select>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <div className="buttons">
                                <button
                                    className="button is-small is-primary"
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
