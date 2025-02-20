import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://10.0.2.2:8080/sensors";
// const API_URL = "http://localhost:8080/sensors";

/**
 * 🔹 Récupération des capteurs
 */
export const getSensors = createAsyncThunk(
  "sensor/getSensors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Impossible de récupérer les capteurs"
      );
    }
  }
);

/**
 * 🔹 Créer un readings
 */
export const createReading = createAsyncThunk(
  "sensor/createReading",
  async ({ sensorId, value }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${sensorId}/readings`, {
        value,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Impossible de créer le relevé"
      );
    }
  }
);

const sensorSlice = createSlice({
  name: "sensor",
  initialState: {
    sensors: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSensors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSensors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sensors = action.payload;
        console.log("payload", action.payload);
      })
      .addCase(getSensors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }),
      builder
        .addCase(createReading.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(createReading.fulfilled, (state, action) => {
          state.isLoading = false;
          const sensorIndex = state.sensors.findIndex(
            (sensor) => sensor._id === action.payload._id
          );
          state.sensors[sensorIndex] = action.payload;
        })
        .addCase(createReading.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
  },
});

export default sensorSlice.reducer;
