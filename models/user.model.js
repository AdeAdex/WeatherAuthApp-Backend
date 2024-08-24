//  /models/user.model.js

import mongoose from "mongoose";

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

const WeatherDataSchema = new mongoose.Schema({
  currentWeather: {
    type: mongoose.Schema.Types.Mixed,
    iconUrl: { type: String }, // Include icon URL within currentWeather
  },
  forecast: [ForecastSchema],
  weatherMapUrl: { type: String },
});

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  weatherData: WeatherDataSchema,
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
