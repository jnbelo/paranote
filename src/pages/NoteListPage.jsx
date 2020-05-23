import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'react-feather';
import Button from '../components/Button';
import List from '../components/List';
import TitlePanel from '../components/TitlePanel';
import log from '../utils/logging';
import NoteEditorPage from './NoteEditorPage';
import {
    EditorContainer,
    NoteListWrapper,
    NotesListContainer,
    NotesListItem,
    Toolbar
} from './NoteListPage.styles';
import { ipcRenderer } from 'electron';

const NoteListPage = ({ source }) => {
    const UNTITLED_NOTE = '(Untitled Note)';
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState();

    useEffect(() => {
        (async () => {
            log.info(
                `Source changed, fetching notes [sourceId: ${source.id}] [sourceName: ${source.name}]`
            );
            try {
                setNotes(await source.getNotes());
            } catch (error) {
                log.error(
                    `Unable to get notes from source [sourceId: ${source.id}] [sourceName: ${source.name}]`,
                    error
                );
            }

            setSelectedNote(null);
        })();
    }, [source]);

    const handleNoteSelection = (selection) => {
        if (selection && selection.item) {
            setSelectedNote(selection.item);
        } else {
            setSelectedNote(null);
        }
    };

    const handleNewNote = async () => {
        try {
            const note = await source.createNote({});
            setNotes(await source.getNotes());
            log.info(
                `Created new note [noteId: ${note.id}] [sourceId: ${source.id}] [sourceName: ${source.name}]`
            );
        } catch (error) {
            log.error(
                `Unable to create new note [sourceId: ${source.id}] [sourceName: ${source.name}]`,
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
                    await source.removeNote(selectedNote.id);
                    setNotes(await source.getNotes());
                    setSelectedNote(null);
                    log.info(
                        `Deleted note [noteId: ${selectedNote.id}] [sourceId: ${source.id}] [sourceName: ${source.name}]`
                    );
                } else {
                    log.debug('Cancelled note deletion.');
                }
            } catch (error) {
                log.error(
                    `Unable to delete note [noteId: ${selectedNote.id}] [sourceId: ${source.id}] [sourceName: ${source.name}]`,
                    error
                );
            }
        } else {
            log.warn(`No selected note [sourceId: ${source.id}] [sourceName: ${source.name}]`);
        }
    };

    const handleNoteUpdate = async (updatedSource) => {
        log.info(source.id);
        if (updatedSource.id === source.id) {
            setNotes(await source.getNotes());
        }
    };

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
                            <p>{item.createdAt.format('MMMM Do YYYY HH:mm')}</p>
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
                {selectedNote && (
                    <NoteEditorPage
                        source={source}
                        note={selectedNote}
                        onUpdated={handleNoteUpdate}
                    />
                )}
            </EditorContainer>
        </NoteListWrapper>
    );
};

NoteListPage.propTypes = {
    source: PropTypes.object.isRequired
};

export default NoteListPage;
