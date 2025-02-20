import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

export default function BarcodeScanner({ onScanSuccess, onClose }) {
  const [type, setType] = useState(`back`);
  const [permission, requestPermission] = useCameraPermissions();

  // 🔥 Toggle entre caméra avant et arrière
  const toggleCameraType = async () => {
    setType((current) => (current === `back` ? `back` : "front"));
  };

  // 🔥 Gestion du scan du code-barres
  const handleBarCodeScanned = ({ type, data }) => {
    onScanSuccess({ type, data });
  };

  // 🔥 Vérifie l'état des permissions
  if (!permission) {
    // Permissions encore en attente
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de votre permission pour accéder à la caméra
        </Text>
        <Button onPress={requestPermission} title="Autoriser l'accès" />
      </View>
    );
  }

  if (permission.granted === true) {
    console.log("Permission accordée");
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        // facing={type}
        onBarCodeScanned={handleBarCodeScanned}
        onCameraReady={() => console.log("Prêt à scanner")}
      >
        {/* 🔥 Bouton pour changer la caméra */}
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>

        {/* 🔥 Bouton pour fermer */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fermer</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "pink",
  },
  camera: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    zIndex: 100,
  },
  message: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  button: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  text: { color: "#fff", fontWeight: "bold" },
  closeButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
