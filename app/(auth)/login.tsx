import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import tw from 'twrnc';
import useAppSelector from '@/hooks/useAppSelector';
import { login } from '@/redux/slices/authSlice';
import { useNavigation } from 'expo-router';

const LoginScreen = () => {
	const navigation = useNavigation<any>();
	const dispatch = useDispatch();
	const { isLoading, error } = useAppSelector(state => state.auth);
	const [secureText, setSecureText] = useState(true);

	const { control, handleSubmit, formState: { errors } } = useForm({
		defaultValues: { email: '', password: '' }
	});

	const onSubmit = async () => {
		try {
			// await dispatch(login(data)).unwrap();
			Toast.show({ type: 'success', text1: 'Connexion réussie !' });
			navigation.navigate('MainLayout');
		} catch (err) {
			Toast.show({ type: 'error', text1: 'Erreur', text2: (err as Error).message });
		}
	};

	return (
		<View style={tw`flex-1 bg-gray-900 justify-center px-6`}>
			<Text style={tw`text-white text-3xl font-bold text-center mb-6`}>Connexion</Text>

			{/* Champ Email */}
			<View style={tw`mb-4`}>
				<Text style={tw`text-white mb-2`}>Email</Text>
				<Controller
					control={control}
					name="email"
					rules={{ required: "L'email est requis" }}
					render={({ field: { onChange, value } }) => (
						<TextInput
							style={tw`bg-gray-800 text-white px-4 py-3 rounded-lg`}
							placeholder="Entrer votre email"
							placeholderTextColor="gray"
							onChangeText={onChange}
							value={value}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
					)}
				/>
				{errors.email && <Text style={tw`text-red-400 mt-1`}>{errors.email.message}</Text>}
			</View>

			{/* Champ Mot de Passe */}
			<View style={tw`mb-4`}>
				<Text style={tw`text-white mb-2`}>Mot de passe</Text>
				<Controller
					control={control}
					name="password"
					rules={{ required: "Le mot de passe est requis", minLength: { value: 6, message: "Minimum 6 caractères" } }}
					render={({ field: { onChange, value } }) => (
						<TextInput
							style={tw`bg-gray-800 text-white px-4 py-3 rounded-lg`}
							placeholder="Mot de passe"
							placeholderTextColor="gray"
							secureTextEntry={secureText}
							onChangeText={onChange}
							value={value}
						/>
					)}
				/>
				{errors.password && <Text style={tw`text-red-400 mt-1`}>{errors.password.message}</Text>}
			</View>

			{/* Bouton Connexion */}
			<TouchableOpacity
				onPress={handleSubmit(onSubmit)}
				style={tw`bg-blue-600 py-3 rounded-lg flex-row justify-center items-center`}>
				{isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>Se connecter</Text>}
			</TouchableOpacity>

			{/* Lien vers Inscription */}
			<TouchableOpacity onPress={() => navigation.navigate('register')} style={tw`mt-4`}>
				<Text style={tw`text-blue-400 text-center`}>Créer un compte</Text>
			</TouchableOpacity>

			{/* Toast Notifications */}
			<Toast />
		</View>
	);
};

export default LoginScreen;
