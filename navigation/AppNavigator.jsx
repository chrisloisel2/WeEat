import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';

export default function AppNavigator() {
	const { token } = useSelector(state => state.auth);

	console.log('token:', token);

	return (
		<Stack screenOptions={{ headerShown: false }}>
			{token ? (
				<Stack.Screen name="home" />) : (
				<Stack.Screen name="auth" />
			)}
		</Stack>
	);
}
