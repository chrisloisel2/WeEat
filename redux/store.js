import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./slices/authSlice";
import sensorReducer from "./slices/sensorSlice";

const isWeb = typeof window !== "undefined";

// Importation correcte de AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuration de Redux Persist
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // Persiste uniquement l'authentification
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedSensorReducer = persistReducer(persistConfig, sensorReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    sensor: persistedSensorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Évite les erreurs liées à AsyncStorage
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = isWeb ? null : persistStore(store);
export const getRootState = () => store.getState();
export default store;
