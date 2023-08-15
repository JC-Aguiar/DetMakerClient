import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './RootReducer';

const store = configureStore({
    reducer: {
        store: rootReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;