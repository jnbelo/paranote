import { faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tab from '../../components/Tabs/Tab';
import Tabs from '../../components/Tabs/Tabs';
import { selectSources } from '../../redux/selectors/sources.selectors';
import { selectSource } from '../../redux/slices/ui.slice';
import NoteListPage from '../note-list/NoteListPage';

export default function MainPage(): JSX.Element {
    const dispatch = useDispatch();
    const sources = useSelector(selectSources);

    useEffect(() => {
        dispatch(selectSource(sources[0].id));
    }, [dispatch, sources]);

    return (
        <Tabs>
            {sources.map((source, index) => (
                <Tab key={`source-${index}`} index={index} title={source.name} icon={faTimes}>
                    <NoteListPage />
                </Tab>
            ))}
        </Tabs>
    );
}
