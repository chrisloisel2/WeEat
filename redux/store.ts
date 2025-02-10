import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';

// Détection de l'environnement Web
const isWeb = typeof window !== 'undefined';

let storage;
if (isWeb) {
	storage = require('redux-persist/lib/storage').default; // Web Storage
} else {
	storage = require('@react-native-async-storage/async-storage').default; // AsyncStorage pour mobile
}

// Configuration de Redux Persist
const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth'], // Persiste uniquement l'authentification
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
	reducer: {
		auth: persistedReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false, // Évite les erreurs liées à AsyncStorage
		}),
});

export const persistor = isWeb ? null : persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export default store;
