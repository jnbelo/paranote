import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import List from '../../components/List/List';
import Select from '../../components/Select/Select';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import { areSameNotes, Note } from '../../redux/interfaces/notes.interfaces';
import { SortBy } from '../../redux/interfaces/ui.interfaces';
import {
    selectSelectedSource,
    selectSelectedSourceNotes
} from '../../redux/selectors/ui.selectors';
import { selectNote, sortNotesBy } from '../../redux/slices/ui.slice';
import { createNote } from '../../redux/thunks/notes.thunks';
import NoteEditorPage from '../note-editor/NoteEditorPage';
import './NoteListPage.scss';

export default function NoteListPage(): JSX.Element {
    const dispatch = useDispatch();
    const selectedSource = useSelector(selectSelectedSource);
    const notes = useSelector(selectSelectedSourceNotes);

    const handleNewNoteClick = async () => {
        if (selectedSource) {
            await dispatch(createNote(selectedSource.id));
        }
    };

    const handleOrderByChange = (value: string) => {
        dispatch(sortNotesBy(value as SortBy));
    };

    const handleSelectionChange = (note: Note | null, index: number) => {
        dispatch(selectNote(note?.id));
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
                                    onClick={handleNewNoteClick}
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
                    areSame={areSameNotes}
                    onSelectionChange={handleSelectionChange}
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
