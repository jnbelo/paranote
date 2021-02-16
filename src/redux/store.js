import { combineReducers, configureStore } from '@reduxjs/toolkit';
import sourcesReducer from './sourcesSlice';
import notesReducer from './notesSlice';
import uiReducer from './uiSlice';

export default configureStore({
    reducer: {
        entities: combineReducers({
            sources: sourcesReducer,
            notes: notesReducer
        }),
        ui: uiReducer
    }
});
