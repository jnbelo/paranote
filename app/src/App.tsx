import './App.scss';

import { default as React } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import CreateSourcePage from './pages/create-source/CreateSourcePage';
import { EntryPage } from './pages/entry/EntryPage';
import LoadSourcePage from './pages/load-source/LoadSourcePage';
import MainPage from './pages/main-page/MainPage';
import { selectHasSources } from './redux/selectors/sources.selectors';

const App = () => {
    const hasSources = useSelector(selectHasSources);

    return (
        <Switch>
            <Route exact path="/">
                {hasSources ? <MainPage></MainPage> : <EntryPage></EntryPage>}
            </Route>
            <Route exact path="/create-source">
                <CreateSourcePage />
            </Route>
            <Route exact path="/load-source">
                <LoadSourcePage />
            </Route>
        </Switch>
    );
};

export default withRouter(App);
