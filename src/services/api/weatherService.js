import weatherData from "@/services/mockData/weather.json";

class WeatherService {
  constructor() {
    this.weather = { ...weatherData };
  }

  async getCurrent() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...this.weather };
  }

  async getForecast(days = 3) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      ...this.weather,
      forecast: this.weather.forecast.slice(0, days)
    };
  }
}

export const weatherService = new WeatherService();