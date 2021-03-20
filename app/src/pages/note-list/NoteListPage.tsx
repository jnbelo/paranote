import './NoteListPage.scss';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import { selectSources } from '../../redux/selectors/sources.selectors';
import List from '../../components/List/List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { createNote } from '../../redux/thunks/notes.thunks';
import { selectNotes, selectSource } from '../../redux/selectors/ui.selectors';

export default function NoteListPage(): JSX.Element {
    const dispatch = useDispatch();
    const selectedSource = useSelector(selectSource);
    const notes = useSelector(selectNotes);

    const onNewNoteClick = async () => {
        if (selectedSource) {
            await dispatch(createNote(selectedSource.id));
        }
    };

    return (
        <SplitPane split="vertical" minSize="10%" defaultSize="20%">
            <div className="is-flex-direction-column is-fullheight">
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="navbar-menu">
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
                <List>
                    {notes.map((note, index) => (
                        <div>{note.title}</div>
                    ))}
                </List>
            </div>
            <div />
        </SplitPane>
    );
}
