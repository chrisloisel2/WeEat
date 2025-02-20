import { useEffect, useState } from "react";
import { View } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import PeriodSelector from "@/components/ui/PeriodSelector";
import { DateRangeDisplay } from "@/components/ui/DateRangeDisplay";

export default function GlobalChart({
  sensors,
  globalPeriod,
  setGlobalPeriod,
}) {
  const [chartOption, setChartOption] = useState({});

  useEffect(() => {
    if (sensors.length > 0) {
      prepareChartData();
    }
  }, [sensors, globalPeriod]);

  const prepareChartData = () => {
    const series = [];
    const allDates = new Set();

    sensors.forEach((sensor) => {
      if (sensor.readings?.length) {
        const filteredReadings = filterDataByPeriod(
          sensor.readings,
          globalPeriod
        );
        const data = filteredReadings.map((reading) => {
          const date = new Date(reading.timestamp);
          allDates.add(date.toISOString().split("T")[0]);
          return [date.toISOString().split("T")[0], reading.value];
        });

        series.push({ name: sensor.name, type: "line", data });
      }
    });

    setChartOption({
      title: { text: "Tous les capteurs", left: "center" },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: Array.from(allDates).sort() },
      yAxis: { type: "value", name: "Température (°C)" },
      series,
    });
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <PeriodSelector
        selectedPeriod={globalPeriod}
        setPeriod={setGlobalPeriod}
      />
      <View style={{ height: 300 }}>
        <ECharts
          key={`global-${globalPeriod}`}
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
