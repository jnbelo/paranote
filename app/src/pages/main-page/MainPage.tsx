import { faFile, faFolderOpen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tab from '../../components/Tabs/Tab';
import Tabs from '../../components/Tabs/Tabs';
import { Source } from '../../redux/interfaces/sources.interfaces';
import { selectSources } from '../../redux/selectors/sources.selectors';
import { selectedSourceSelector } from '../../redux/selectors/ui.selectors';
import { selectSource } from '../../redux/slices/ui.slice';
import { removeSource } from '../../redux/thunks/sources.thunks';
import NoteListPage from '../note-list/NoteListPage';

export default function MainPage(): JSX.Element {
    const dispatch = useDispatch();
    const sources = useSelector(selectSources);
    const selectedSource = useSelector(selectedSourceSelector);

    useEffect(() => {
        dispatch(selectSource(sources[0].id));
    }, [dispatch, sources]);

    function handleSourceClose({ id }: Source) {
        dispatch(removeSource(id));
    }

    function handleSourceSelect({ id }: Source) {
        dispatch(selectSource(id));
    }

    function findSelectedIndex() {
        return sources.findIndex((s) => s.id === selectedSource?.id);
    }

    return (
        <div className="is-flex is-flex-direction-column is-fullheight">
            <nav className="level mb-0">
                <div className="level-left">
                    <div className="level-item">
                        <div className="buttons">
                            <Link to="/create-source" className="button is-text">
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon={faFile} />
                                </span>
                            </Link>
                            <Link to="/load-source" className="button is-text">
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon={faFolderOpen} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <Tabs selectedIndex={findSelectedIndex()}>
                {sources.map((source, index) => (
                    <Tab
                        key={`source-${index}`}
                        index={index}
                        title={source.name}
                        icon={faTimes}
                        onSelect={() => handleSourceSelect(source)}
                        onIconClick={() => handleSourceClose(source)}
                    >
                        <NoteListPage />
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
