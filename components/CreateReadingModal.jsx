import { useEffect, useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { createReading, getSensors } from "@/redux/slices/sensorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";

export default function CreateReadingModal({ onClose, onRefresh }) {
  const [reading, setReading] = useState({ value: "", sensorId: "" });
  const dispatch = useDispatch();
  const sensors = useSelector((state) => state.sensor.sensors);

  const handleSubmit = async () => {
    if (!reading.value || !reading.sensorId) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      await dispatch(createReading(reading)).unwrap();
      dispatch(getSensors()); // 🔥 Rafraîchit les capteurs après ajout
      onRefresh();
      onClose(); // 🔥 Ferme la modal après succès
      setReading({ value: "", sensorId: "" }); // 🔥 Réinitialise le formulaire
    } catch (error) {
      alert("Erreur lors de l'ajout !");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Champ de valeur */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={reading.value}
        onChangeText={(text) => setReading({ ...reading, value: text })}
        placeholder="Valeur"
      />

      {/* 🔥 Sélecteur de capteur */}
      <Picker
        onValueChange={(value) => setReading({ ...reading, sensorId: value })}
        style={styles.picker}
      >
        {sensors.map((sensor) => (
          <Picker.Item
            key={sensor._id}
            label={sensor.name}
            value={sensor._id}
          />
        ))}
      </Picker>

      {/* 🔥 Bouton de soumission */}
      <View style={styles.buttons}>
        <Button style={styles.button} title="Ajouter" onPress={handleSubmit} />
        {/* 🔥 Bouton de fermeture */}
        <Button style={styles.button} title="Fermer" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // center modal
    alignContent: "center",
    top: "25%",
    transform: [{ translateY: -50 }],
    width: "100%",
    // height: "20%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  pickerItem: {
    backgroundColor: "red",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    width: "100%",
  },
});
