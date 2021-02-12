import { configureStore } from '@reduxjs/toolkit';
import sourcesReducer from './sourcesSlice';

export default configureStore({
    reducer: {
        sources: sourcesReducer
    }
});
