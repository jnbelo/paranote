import { combineReducers, configureStore } from '@reduxjs/toolkit';
import sourcesReducer from './sourcesSlice';
import notesReducer from './notesSlice';

export default configureStore({
    reducer: {
        entities: combineReducers({
            sources: sourcesReducer,
            notes: notesReducer
        })
    }
});
