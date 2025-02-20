import { useState } from "react";
import { View, Text, TextInput, Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function CreateProduct({ barcode, onCancel, onSave }) {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    barcode,
    image: null,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProduct({ ...product, image: result.uri });
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://10.0.2.2:8080/products", product);
      alert("Produit créé !");
      onSave();
    } catch (error) {
      alert("Erreur lors de la création");
    }
  };

  return (
    <View>
      <Text>Nom du produit :</Text>
      <TextInput
        value={product.name}
        onChangeText={(text) => setProduct({ ...product, name: text })}
      />

      <Text>Catégorie :</Text>
      <TextInput
        value={product.category}
        onChangeText={(text) => setProduct({ ...product, category: text })}
      />

      <Button title="Choisir une image" onPress={pickImage} />
      {product.image && (
        <Image
          source={{ uri: product.image }}
          style={{ width: 100, height: 100 }}
        />
      )}

      <Button title="Créer le produit" onPress={handleSubmit} />
      <Button title="Annuler" onPress={onCancel} />
    </View>
  );
}
