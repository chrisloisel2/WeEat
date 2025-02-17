import { Stack, useNavigation } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import { useSelector } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";

const isWeb = typeof window !== "undefined";

export default function RootLayout() {
  return (
    <Provider store={store}>
      {isWeb || !persistor ? (
        <MainNavigator />
      ) : (
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <MainNavigator />
        </PersistGate>
      )}
    </Provider>
  );
}

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const MainNavigator = () => {
  const { token } = useSelector((state) => state.auth);
  const navigation = useNavigation();

  useEffect(() => {
    if (token) {
      navigation.navigate("(tabs)");
    } else {
      navigation.navigate("(auth)");
    }
  }, [token]);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
};
