import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import PeriodSelector from "@/components/ui/PeriodSelector";

export default function SensorChart({ sensor, period, setPeriod }) {
  const [chartOption, setChartOption] = useState({});

  useEffect(() => {
    prepareChartData();
  }, [sensor, period]);

  const prepareChartData = () => {
    const filteredReadings = filterDataByPeriod(sensor.readings, period);
    const data = filteredReadings.map((reading) => [
      new Date(reading.timestamp).toISOString().split("T")[0],
      reading.value,
    ]);

    setChartOption({
      title: { text: sensor.name, left: "center" },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: data.map((item) => item[0]) },
      yAxis: { type: "value", name: "Température (°C)" },
      series: [
        { name: sensor.name, type: "line", data: data.map((item) => item[1]) },
      ],
    });
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
        {sensor.name}
      </Text>
      <PeriodSelector selectedPeriod={period} setPeriod={setPeriod} />
      <View style={{ height: 250 }}>
        <ECharts
          key={`sensor-${sensor._id}-${period}`}
          option={chartOption}
          backgroundColor="transparent"
        />
      </View>
    </View>
  );
}

const filterDataByPeriod = (readings, period) => {
  const now = new Date();
  const cutoffDate = new Date(now.setDate(now.getDate() - period));
  return readings.filter(
    (reading) => new Date(reading.timestamp) >= cutoffDate
  );
};
