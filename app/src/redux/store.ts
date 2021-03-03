import { combineReducers, configureStore } from '@reduxjs/toolkit';
import sourcesReducer from './slices/sources.slice';
import notesReducer from './slices/notes.slice';
import uiReducer from './slices/ui.slice';

const store = configureStore({
    reducer: {
        entities: combineReducers({
            sources: sourcesReducer,
            notes: notesReducer
        }),
        ui: uiReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
