import { getSensors } from "@/redux/slices/sensorSlice";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ECharts } from "react-native-echarts-wrapper";

export default function TemperatureCheck() {
  const dispatch = useDispatch();
  const sensors = useSelector((state) => state.sensor.sensors);

  const [allSensorsOption, setAllSensorsOption] = useState({});
  const [individualOptions, setIndividualOptions] = useState([]);
  const [globalPeriod, setGlobalPeriod] = useState(14);
  const [individualPeriods, setIndividualPeriods] = useState({}); // Stocke la période par capteur

  useEffect(() => {
    dispatch(getSensors());
  }, [dispatch]);

  useEffect(() => {
    if (sensors && sensors.length > 0) {
      prepareChartData();
    }
  }, [sensors, globalPeriod, individualPeriods]);

  const filterDataByPeriod = (readings, period) => {
    const now = new Date();
    const cutoffDate = new Date(now.setDate(now.getDate() - period));

    return readings.filter((reading) => {
      const readingDate = new Date(reading.timestamp);
      return readingDate >= cutoffDate;
    });
  };

  const prepareChartData = () => {
    // 🔥 Graphique GLOBAL (tous capteurs)
    const series = [];
    const allDates = new Set();

    sensors.forEach((sensor) => {
      if (sensor.readings && sensor.readings.length > 0) {
        const filteredReadings = filterDataByPeriod(
          sensor.readings,
          globalPeriod
        );
        const data = filteredReadings.map((reading) => {
          const date = new Date(reading.timestamp);
          allDates.add(date.toISOString().split("T")[0]);
          return [date.toISOString().split("T")[0], reading.value];
        });

        series.push({
          name: sensor.name,
          type: "line",
          data: data,
        });
      }
    });

    const sortedDates = Array.from(allDates).sort();

    setAllSensorsOption({
      title: { text: "Tous les capteurs", left: "center" },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: sortedDates },
      yAxis: { type: "value", name: "Température (°C)" },
      series: series,
    });

    // 🔥 Graphiques INDIVIDUELS
    const individualOpts = sensors
      .map((sensor) => {
        const period = individualPeriods[sensor._id] || 14; // Par défaut 14 jours
        if (sensor.readings && sensor.readings.length > 0) {
          const filteredReadings = filterDataByPeriod(sensor.readings, period);
          const data = filteredReadings.map((reading) => {
            const date = new Date(reading.timestamp);
            return [date.toISOString().split("T")[0], reading.value];
          });

          return {
            sensorId: sensor._id,
            title: { text: `${sensor.name}`, left: "center" },
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: data.map((item) => item[0]) },
            yAxis: { type: "value", name: "Température (°C)" },
            series: [
              {
                name: sensor.name,
                type: "line",
                data: data.map((item) => item[1]),
              },
            ],
          };
        }
        return null;
      })
      .filter(Boolean);

    setIndividualOptions(individualOpts);
  };

  const handleGlobalPeriodChange = (period) => {
    setGlobalPeriod(period);
  };

  const handleIndividualPeriodChange = (sensorId, period) => {
    setIndividualPeriods((prev) => ({
      ...prev,
      [sensorId]: period,
    }));
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        {/* 🔥 Boutons pour la période du graphique global */}
        <View style={styles.filterContainer}>
          <View style={styles.buttonGroup}>
            {[7, 14, 31].map((period) => (
              <TouchableOpacity
                key={`global-${period}`}
                style={[
                  styles.filterButton,
                  globalPeriod === period && styles.activeButton,
                ]}
                onPress={() => handleGlobalPeriodChange(period)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    globalPeriod === period && styles.activeButtonText,
                  ]}
                >
                  {period} jours
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 🔥 Graphique GLOBAL */}
        <View style={{ height: 300, marginVertical: 20 }}>
          <ECharts
            key={`all-sensors-${globalPeriod}`}
            option={allSensorsOption}
            backgroundColor="transparent"
          />
        </View>

        {/* 🔥 Graphiques INDIVIDUELS avec boutons de sélection de période */}
        {individualOptions.map((option, index) => (
          <View key={`chart-${index}`} style={{ marginVertical: 15 }}>
            {/* 🔥 Boutons de filtre au-dessus de chaque graphique */}
            <View style={styles.filterContainer}>
              <View style={styles.buttonGroup}>
                {[7, 14, 31].map((period) => (
                  <TouchableOpacity
                    key={`${option.sensorId}-${period}`}
                    style={[
                      styles.filterButton,
                      (individualPeriods[option.sensorId] || 14) === period &&
                        styles.activeButton,
                    ]}
                    onPress={() =>
                      handleIndividualPeriodChange(option.sensorId, period)
                    }
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        (individualPeriods[option.sensorId] || 14) === period &&
                          styles.activeButtonText,
                      ]}
                    >
                      {period} jours
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 🔥 Graphique individuel */}
            <View style={{ height: 250 }}>
              <ECharts
                key={`individual-${option.sensorId}-${
                  individualPeriods[option.sensorId] || 14
                }`}
                option={option}
                backgroundColor="transparent"
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "center",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeButton: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
  },
  activeButtonText: {
    color: "#fff",
  },
});
