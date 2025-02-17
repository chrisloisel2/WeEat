import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import { register } from "@/redux/slices/authSlice";
import { useNavigation } from "expo-router";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return Toast.show({
        type: "error",
        text1: "Les mots de passe ne correspondent pas",
      });
    }

    try {
      await dispatch(register(data)).unwrap();

      console.log("Réponse Redux après register:", response);

      Toast.show({ type: "success", text1: "Compte créé !" });

      console.log("Redirection vers Login...");

      navigation.replace("login");
    } catch (err) {
      Toast.show({ type: "error", text1: "Erreur", text2: err.message });
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-900 justify-center px-6`}>
      <Text style={tw`text-white text-3xl font-bold text-center mb-6`}>
        Inscription
      </Text>

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
        {errors.email && (
          <Text style={tw`text-red-400 mt-1`}>{errors.email.message}</Text>
        )}
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-white mb-2`}>Mot de passe</Text>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Mot de passe requis",
            minLength: { value: 6, message: "Min 6 caractères" },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={tw`bg-gray-800 text-white px-4 py-3 rounded-lg`}
              placeholder="Mot de passe"
              placeholderTextColor="gray"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text style={tw`text-red-400 mt-1`}>{errors.password.message}</Text>
        )}
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-white mb-2`}>Confirmer le mot de passe</Text>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: "Confirmation requise" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={tw`bg-gray-800 text-white px-4 py-3 rounded-lg`}
              placeholder="Confirmer"
              placeholderTextColor="gray"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={tw`text-red-400 mt-1`}>
            {errors.confirmPassword.message}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={tw`bg-blue-600 py-3 rounded-lg flex-row justify-center items-center`}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-lg font-bold`}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("login")}
        style={tw`mt-4`}
      >
        <Text style={tw`text-blue-400 text-center`}>
          Déjà inscrit ? Se connecter
        </Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

export default RegisterScreen;
