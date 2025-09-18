class WeatherService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'weather_c';
  }

  async getCurrent() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "wind_speed_c"}},
          {"field": {"Name": "visibility_c"}},
          {"field": {"Name": "forecast_condition_c"}},
          {"field": {"Name": "forecast_day_c"}},
          {"field": {"Name": "forecast_high_c"}},
          {"field": {"Name": "forecast_low_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.data && response.data.length > 0) {
        const weather = response.data[0];
        
        // Transform data for UI compatibility
        return {
          location: weather.location_c,
          temperature: weather.temperature_c,
          condition: weather.condition_c,
          humidity: weather.humidity_c,
          windSpeed: weather.wind_speed_c,
          visibility: weather.visibility_c,
          forecast: [{
            day: weather.forecast_day_c,
            condition: weather.forecast_condition_c,
            high: weather.forecast_high_c,
            low: weather.forecast_low_c
          }]
        };
      }
      
      // Return default weather if no data
      return {
        location: "Farm Location",
        temperature: 22,
        condition: "Sunny",
        humidity: 65,
        windSpeed: 8,
        visibility: 10,
        forecast: [{
          day: "Today",
          condition: "Sunny",
          high: 25,
          low: 18
        }]
      };
    } catch (error) {
      console.error("Error fetching current weather:", error);
      // Return default weather on error
      return {
        location: "Farm Location",
        temperature: 22,
        condition: "Sunny",
        humidity: 65,
        windSpeed: 8,
        visibility: 10,
        forecast: [{
          day: "Today",
          condition: "Sunny",
          high: 25,
          low: 18
        }]
      };
    }
  }

  async getForecast(days = 3) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "wind_speed_c"}},
          {"field": {"Name": "visibility_c"}},
          {"field": {"Name": "forecast_condition_c"}},
          {"field": {"Name": "forecast_day_c"}},
          {"field": {"Name": "forecast_high_c"}},
          {"field": {"Name": "forecast_low_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": days, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.data && response.data.length > 0) {
        const weather = response.data[0];
        
        return {
          location: weather.location_c,
          temperature: weather.temperature_c,
          condition: weather.condition_c,
          humidity: weather.humidity_c,
          windSpeed: weather.wind_speed_c,
          visibility: weather.visibility_c,
          forecast: response.data.slice(0, days).map(w => ({
            day: w.forecast_day_c,
            condition: w.forecast_condition_c,
            high: w.forecast_high_c,
            low: w.forecast_low_c
          }))
        };
      }
      
      // Return default forecast if no data
      return {
        location: "Farm Location",
        temperature: 22,
        condition: "Sunny",
        humidity: 65,
        windSpeed: 8,
        visibility: 10,
        forecast: Array.from({length: days}, (_, i) => ({
          day: `Day ${i + 1}`,
          condition: "Sunny",
          high: 25 - i,
          low: 18 - i
        }))
      };
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      // Return default forecast on error
      return {
        location: "Farm Location",
        temperature: 22,
        condition: "Sunny",
        humidity: 65,
        windSpeed: 8,
        visibility: 10,
        forecast: Array.from({length: days}, (_, i) => ({
          day: `Day ${i + 1}`,
          condition: "Sunny",
          high: 25 - i,
          low: 18 - i
        }))
      };
    }
  }
}

export const weatherService = new WeatherService();