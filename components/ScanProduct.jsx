import { useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import BarcodeScanner from "./BarcodeScanner";

export default function ScanProduct({ onProductFound, onCreateProduct }) {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  const handleScanSuccess = async (barcode) => {
    setScanning(false);
    setLoading(true);
    console.log("Code-barres scanné :", barcode);

    try {
      const response = await axios.get(
        `http://10.0.2.2:8080/products/${barcode}`
      );
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Produit non trouvé, proposition de création.");
      setProduct(null);
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {scanning ? (
        <BarcodeScanner
          style={styles.camera}
          onScanSuccess={handleScanSuccess}
          onClose={() => setScanning(false)}
        />
      ) : (
        <>
          <Button
            title="Scanner un produit"
            onPress={() => setScanning(true)}
          />

          {loading && <ActivityIndicator size="large" color="#007bff" />}

          {product ? (
            <>
              <Text>Produit trouvé : {product.name}</Text>
              <Button
                title="Ajouter ce produit"
                onPress={() => onProductFound(product)}
              />
            </>
          ) : (
            <Button
              title="Créer un nouveau produit"
              onPress={() => onCreateProduct()}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    zIndex: 100,
  },
});
