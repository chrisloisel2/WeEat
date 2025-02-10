import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.monbackend.com/auth';

/**
 * 🔹 Login utilisateur
 */
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
	try {
		const response = await axios.post(`${API_URL}/login`, credentials);
		const { user, token } = response.data;

		// await AsyncStorage.setItem('token', token);
		return { user, token };
	} catch (error) {
		return rejectWithValue(error.response?.data?.message || 'Connexion échouée');
	}
});

/**
 * 🔹 Inscription utilisateur
 */
export const register = createAsyncThunk('auth/register', async (credentials, { rejectWithValue }) => {
	try {
		const response = await axios.post(`${API_URL}/register`, credentials);
		return response.data; // On ne stocke pas le token à l'inscription
	} catch (error) {
		return rejectWithValue(error.response?.data?.message || 'Inscription échouée');
	}
});

/**
 * 🔹 Réinitialisation du mot de passe
 */
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
	try {
		const response = await axios.post(`${API_URL}/forgot-password`, { email });
		return response.data.message; // Réponse du backend
	} catch (error) {
		return rejectWithValue(error.response?.data?.message || 'Erreur lors de la réinitialisation');
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		token: null,
		isLoading: false,
		error: null,
		successMessage: null
	},
	reducers: {
		logout: (state) => {
			state.user = null;
			state.token = null;
			AsyncStorage.removeItem('token');
		}
	},
	extraReducers: (builder) => {
		builder
			// ✅ Gestion du login
			.addCase(login.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.error = null;
				state.successMessage = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.successMessage = 'Inscription réussie. Veuillez vous connecter.';
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			.addCase(forgotPassword.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(forgotPassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.successMessage = action.payload;
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	}
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
