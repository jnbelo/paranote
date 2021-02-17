import { ipcRenderer } from 'electron';
import moment from 'moment';
import React from 'react';
import { Edit, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import List from '../components/List';
import TitlePanel from '../components/TitlePanel';
import { noteSelected, selectNotes } from '../redux/slices/ui.slice';
import { createNote, deleteNote } from '../redux/thunks/notes.thunks';
import log from '../utils/logging';
import NoteEditorPage from './NoteEditorPage';
import {
    EditorContainer,
    NoteListWrapper,
    NotesListContainer,
    NotesListItem,
    Toolbar
} from './NoteListPage.styles';

const NoteListPage = () => {
    const UNTITLED_NOTE = '(Untitled Note)';
    const dispatch = useDispatch();
    const selectedSource = useSelector((state) => state.ui.selectedSource);
    const selectedNote = useSelector((state) => state.ui.selectedNote);
    const notes = useSelector(selectNotes);

    const handleNoteSelection = (selection) => {
        dispatch(noteSelected(selection && selection.item ? selection.item : null));
    };

    const handleNewNote = async () => {
        try {
            await dispatch(createNote({ source: selectedSource }));
            log.info(
                `Created new note [sourceId: ${selectedSource.id}] [sourceName: ${selectedSource.name}]`
            );
        } catch (error) {
            log.error(
                `Unable to create new note [sourceId: ${selectedSource.id}] [sourceName: ${selectedSource.name}]`,
                error
            );
        }
    };

    const handleDeleteNote = async () => {
        if (selectedNote) {
            try {
                const result = await ipcRenderer.invoke('open-ok-cancel-box', {
                    type: 'question',
                    title: 'Delete note',
                    message: `Do you want to delete note '${selectedNote.title || UNTITLED_NOTE}'?`
                });
                if (result === true) {
                    await dispatch(deleteNote({ source: selectSource, note: selectedNote }));
                    log.info(
                        `Deleted note [noteId: ${selectedNote.id}] [sourceId: ${selectedSource.id}] [sourceName: ${selectedSource.name}]`
                    );
                } else {
                    log.debug('Cancelled note deletion.');
                }
            } catch (error) {
                log.error(
                    `Unable to delete note [noteId: ${selectedNote.id}] [sourceId: ${selectedSource.id}] [sourceName: ${selectedSource.name}]`,
                    error
                );
            }
        } else {
            log.warn(
                `No selected note [sourceId: ${selectedSource.id}] [sourceName: ${selectedSource.name}]`
            );
        }
    };

    if (!selectedSource) {
        return null;
    }

    return (
        <NoteListWrapper>
            <NotesListContainer>
                <TitlePanel title="Notes">
                    <Button padding="0" onClick={handleNewNote} type="icon" aria-label="create">
                        <Edit size={18} />
                    </Button>
                </TitlePanel>
                <List
                    name="notes"
                    data={notes}
                    onSelectionChange={handleNoteSelection}
                    render={(item) => (
                        <NotesListItem>
                            <h3>{item.title || UNTITLED_NOTE}</h3>
                            <p>{moment(item.createdAt).format('MMMM Do YYYY HH:mm')}</p>
                        </NotesListItem>
                    )}
                ></List>
            </NotesListContainer>
            <EditorContainer>
                <Toolbar>
                    <Button type="icon" padding="0" onClick={handleDeleteNote} aria-label="delete">
                        <Trash2 size={18} />
                    </Button>
                </Toolbar>
                <NoteEditorPage />
            </EditorContainer>
        </NoteListWrapper>
    );
};

NoteListPage.propTypes = {};

export default NoteListPage;
