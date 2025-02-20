import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DateRangeDisplay from "@/components/ui/DateRangeDisplay";

export default function PeriodSelector({ selectedPeriod, setPeriod }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        {[7, 14, 31].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.button,
              selectedPeriod === period && styles.activeButton,
            ]}
            onPress={() => setPeriod(period)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedPeriod === period && styles.activeButtonText,
              ]}
            >
              {period} jours
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <DateRangeDisplay period={selectedPeriod} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
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
