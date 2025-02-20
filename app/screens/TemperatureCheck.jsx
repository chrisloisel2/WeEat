import { getSensors } from "@/redux/slices/sensorSlice";
import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import GlobalChart from "@/components/GlobalCharts";
import SensorChart from "@/components/SensorChart";
import CreateReadingModal from "@/components/CreateReadingModal";
import { Ionicons } from "@expo/vector-icons";

export default function TemperatureCheck() {
  const dispatch = useDispatch();
  const sensors = useSelector((state) => state.sensor.sensors);
  const [globalPeriod, setGlobalPeriod] = useState(14);
  const [individualPeriods, setIndividualPeriods] = useState({}); // Stocke la période par capteur
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(getSensors());
  }, [dispatch, refreshKey]);

  const setModalVisible = () => {
    setIsModalVisible(true);
    console.log("open modal");
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const refreshSensors = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <View style={{ flex: 1 }}>
      {/* 🔥 Bouton d'ajout de lecture en haut à droite */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add-circle" size={40} color="#007bff" />
      </TouchableOpacity>

      <ScrollView style={{ flex: 1, padding: 10 }}>
        {/* 🔥 Graphique Global */}
        <GlobalChart
          key={refreshKey}
          sensors={sensors}
          globalPeriod={globalPeriod}
          setGlobalPeriod={setGlobalPeriod}
        />

        {/* 🔥 Graphiques Individuels */}
        {sensors.map((sensor) => (
          <SensorChart
            key={`${sensor._id}-${refreshKey}`}
            sensor={sensor}
            period={individualPeriods[sensor._id] || 14}
            setPeriod={(newPeriod) =>
              setIndividualPeriods((prev) => ({
                ...prev,
                [sensor._id]: newPeriod,
              }))
            }
          />
        ))}

        {/* 🔥 Modal de création de lecture */}
        {isModalVisible && (
          <CreateReadingModal onClose={closeModal} onRefresh={refreshSensors} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    top: 5, // 📌 Positionne en haut
    right: 15, // 📌 Positionne à droite
    zIndex: 10, // 📌 Assure que le bouton est au-dessus des autres éléments
    elevation: 5, // 📌 Ajoute une ombre sur Android
  },
});
