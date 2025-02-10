import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import tw from 'twrnc';
import { forgotPassword } from '@/redux/slices/authSlice';

const ForgotPasswordScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const { control, handleSubmit, formState: { errors } } = useForm({
		defaultValues: { email: '' }
	});

	const onSubmit = async (data) => {
		try {
			await dispatch(forgotPassword(data.email)).unwrap();
			Toast.show({ type: 'success', text1: 'Email envoyé !' });
			navigation.navigate('Login');
		} catch (err) {
			Toast.show({ type: 'error', text1: 'Erreur', text2: err.message });
		}
	};

	return (
		<View style={tw`flex-1 bg-gray-900 justify-center px-6`}>
			<Text style={tw`text-white text-3xl font-bold text-center mb-6`}>Mot de passe oublié</Text>

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

			<TouchableOpacity onPress={handleSubmit(onSubmit)} style={tw`bg-blue-600 py-3 rounded-lg flex-row justify-center items-center`}>
				<Text style={tw`text-white text-lg font-bold`}>Envoyer</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate('Login')} style={tw`mt-4`}>
				<Text style={tw`text-blue-400 text-center`}>Retour à la connexion</Text>
			</TouchableOpacity>

			<Toast />
		</View>
	);
};

export default ForgotPasswordScreen;
