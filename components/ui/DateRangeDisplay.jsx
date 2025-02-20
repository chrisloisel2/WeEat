import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

/**
 * 🔥 Composant réutilisable qui affiche la plage de dates en fonction de la période sélectionnée.
 */
export default function DateRangeDisplay({ period }) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - period);

  // 🔹 Formater les dates en JJ/MM/AAAA
  const formatDate = (date) =>
    date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>
        📅 {formatDate(startDate)} → {formatDate(now)}
      </Text>
    </View>
  );
}

DateRangeDisplay.propTypes = {
  period: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignSelf: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
