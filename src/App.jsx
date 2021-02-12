import { default as React, useEffect, useState } from 'react';
import { PlusCircle, Upload, X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router';
import { SourceListContainer, SourceListItem, Wrapper } from './App.styles';
import Button from './components/Button';
import List from './components/List';
import TitlePanel from './components/TitlePanel';
import CreateSourcePage from './pages/CreateSourcePage';
import LoadSourcePage from './pages/LoadSourcePage';
import NoteListPage from './pages/NoteListPage';
import { removeSource, selectSources } from './redux/sourcesSlice';

const App = () => {
    const dispatch = useDispatch();
    const sources = useSelector(selectSources);
    const [selectedSource, setSelectedSource] = useState();

    useEffect(() => {
        if (selectedSource && sources.indexOf(selectedSource) === -1) {
            setSelectedSource(null);
        }
    }, [sources, selectedSource]);

    const handleSourceSelection = (selection) => {
        if (selection && selection.item) {
            setSelectedSource(selection.item);
        } else {
            setSelectedSource(null);
        }
    };

    const handleSourceRemove = async (event, id) => {
        event.stopPropagation();
        if (id) {
            await dispatch(removeSource({ id }));
        }
    };

    return (
        <Wrapper>
            <SourceListContainer>
                <TitlePanel title="Sources">
                    <Button title="New Source" padding="0" link="/create-source" type="icon">
                        <PlusCircle size={18} />
                    </Button>
                    <Button title="Load Source" padding="0" link="/load-source" type="icon">
                        <Upload size={18} />
                    </Button>
                </TitlePanel>
                <List
                    name="sources"
                    data={sources}
                    render={(item) => (
                        <SourceListItem>
                            <h4>{item.name}</h4>
                            <Button
                                padding="2px"
                                onClick={(event) => handleSourceRemove(event, item.id)}
                                type="icon"
                            >
                                <X size={14} />
                            </Button>
                        </SourceListItem>
                    )}
                    onSelectionChange={handleSourceSelection}
                ></List>
            </SourceListContainer>
            <Switch>
                <Route exact path="/">
                    {selectedSource && <NoteListPage source={selectedSource} />}
                </Route>
                <Route exact path="/create-source">
                    <CreateSourcePage linkClose="/" />
                </Route>
                <Route exact path="/load-source">
                    <LoadSourcePage linkClose="/" />
                </Route>
            </Switch>
        </Wrapper>
    );
};

export default withRouter(App);
