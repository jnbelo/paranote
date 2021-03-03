import { default as React } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import CreateSourcePage from './pages/create-source/CreateSourcePage';
import { EntryPage } from './pages/entry/EntryPage';
import LoadSourcePage from './pages/load-source/LoadSourcePage';

const App = () => {
    return (
        <Switch>
            <Route exact path="/">
                <EntryPage></EntryPage>
            </Route>
            <Route exact path="/create-source">
                <CreateSourcePage />
            </Route>
            <Route exact path="/load-source">
                <LoadSourcePage />
            </Route>
        </Switch>
    );

    /*const dispatch = useDispatch();
    const sources = useSelector(selectSources);

    const handleSourceSelection = (selection) => {
        dispatch(sourceSelected(selection && selection.item ? selection.item : null));
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
                    <NoteListPage />
                </Route>
                <Route exact path="/create-source">
                    <CreateSourcePage linkClose="/" />
                </Route>
                <Route exact path="/load-source">
                    <LoadSourcePage linkClose="/" />
                </Route>
            </Switch>
        </Wrapper>
    );*/
};

export default withRouter(App);
