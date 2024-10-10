//  /models/user.model.js

import mongoose from "mongoose";

// Forecast schema for weather forecast data
const ForecastSchema = new mongoose.Schema({
  dt: { type: Number, required: true },
  main: { type: mongoose.Schema.Types.Mixed },
  weather: [
    {
      id: { type: Number },
      main: { type: String },
      description: { type: String },
      icon: { type: String }, // The weather icon id from the API
      iconUrl: { type: String }, // New field to store the complete icon URL
    },
  ],
  clouds: { type: mongoose.Schema.Types.Mixed },
  wind: { type: mongoose.Schema.Types.Mixed },
  visibility: { type: Number },
  pop: { type: Number },
  rain: { type: mongoose.Schema.Types.Mixed },
  sys: { type: mongoose.Schema.Types.Mixed },
  dt_txt: { type: String },
});

// Schema for air pollution data
const AirPollutionSchema = new mongoose.Schema({
  coord: {
    lon: { type: Number, required: true },
    lat: { type: Number, required: true },
  },
  list: [
    {
      dt: { type: Number },
      main: {
        aqi: { type: Number }, // Air Quality Index
      },
      components: {
        co: { type: Number }, // Carbon monoxide
        no: { type: Number }, // Nitrogen monoxide
        no2: { type: Number }, // Nitrogen dioxide
        o3: { type: Number }, // Ozone
        so2: { type: Number }, // Sulfur dioxide
        pm2_5: { type: Number }, // Fine particles matter
        pm10: { type: Number }, // Coarse particulate matter
        nh3: { type: Number }, // Ammonia
      },
    },
  ],
});

// WeatherData schema to include current weather, forecast, air pollution, and map URL
const WeatherDataSchema = new mongoose.Schema({
  currentWeather: {
    type: mongoose.Schema.Types.Mixed,
    iconUrl: { type: String }, // Include icon URL within currentWeather
  },
  forecast: [ForecastSchema],
  airPollution: AirPollutionSchema, // New field for air pollution data
  weatherMapUrl: { type: String },
});

// User schema including the new weatherData with air pollution
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  weatherData: WeatherDataSchema, // Include weatherData with air pollution
  searchHistory: [
    {
      query: { type: String, required: true },
      searchedAt: { type: Date, default: Date.now },
    },
  ],
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
