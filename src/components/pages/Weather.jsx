import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import WeatherCard from "@/components/molecules/WeatherCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { weatherService } from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await weatherService.getCurrent();
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
      console.error("Weather loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAgriculturalAdvice = (weather) => {
    if (!weather) return [];

    const advice = [];
    const temp = weather.current.temperature;
    const humidity = weather.current.humidity;
    const condition = weather.current.condition;

    if (temp > 85) {
      advice.push({
        type: "warning",
        icon: "Thermometer",
        title: "High Temperature Alert",
        description: "Consider increased irrigation and shade protection for sensitive crops."
      });
    }

    if (temp < 35) {
      advice.push({
        type: "error",
        icon: "Snowflake",
        title: "Frost Warning",
        description: "Protect sensitive crops from frost damage with covers or heating."
      });
    }

    if (condition === "rainy") {
      advice.push({
        type: "info",
        icon: "CloudRain",
        title: "Rain Expected",
        description: "Reduce irrigation schedule and ensure proper field drainage."
      });
    }

    if (humidity < 30) {
      advice.push({
        type: "warning",
        icon: "Droplets",
        title: "Low Humidity",
        description: "Monitor crops for stress and consider misting systems for sensitive plants."
      });
    }

    if (weather.current.windSpeed > 25) {
      advice.push({
        type: "warning",
        icon: "Wind",
        title: "High Wind Advisory",
        description: "Secure greenhouse structures and check for plant damage after winds subside."
      });
    }

    return advice;
  };

  const getSeasonalTips = () => {
    const month = new Date().getMonth();
    const season = Math.floor(month / 3);
    
    const seasonalAdvice = {
      0: { // Winter (Dec-Feb)
        season: "Winter",
        tips: [
          "Plan crop rotations for spring planting",
          "Maintain and repair equipment during downtime",
          "Order seeds and supplies for next season",
          "Protect perennial crops from cold damage"
        ]
      },
      1: { // Spring (Mar-May)
        season: "Spring",
        tips: [
          "Prepare soil and begin spring plantings",
          "Monitor soil temperature for optimal planting",
          "Apply pre-emergent herbicides",
          "Check irrigation systems before peak season"
        ]
      },
      2: { // Summer (Jun-Aug)
        season: "Summer",
        tips: [
          "Maintain consistent irrigation schedules",
          "Monitor crops for pest and disease pressure",
          "Harvest early summer crops at peak ripeness",
          "Plan and plant fall crops"
        ]
      },
      3: { // Fall (Sep-Nov)
        season: "Fall",
        tips: [
          "Harvest main season crops",
          "Prepare fields for winter cover crops",
          "Clean and store seasonal equipment",
          "Plan next year's crop selection"
        ]
      }
    };

    return seasonalAdvice[season];
  };

  if (loading) return <Layout title="Weather"><Loading /></Layout>;
  if (error) return <Layout title="Weather"><Error message={error} onRetry={loadWeatherData} /></Layout>;

  const agriculturalAdvice = getAgriculturalAdvice(weather);
  const seasonalTips = getSeasonalTips();

  return (
    <Layout title="Weather">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weather & Agricultural Conditions</h1>
          <p className="text-gray-600">Stay informed about weather conditions affecting your farm operations</p>
        </div>

        {/* Current Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherCard weather={weather} />
          
          {/* Agricultural Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-amber-600" />
                Agricultural Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agriculturalAdvice.length === 0 ? (
                <div className="flex items-center gap-3 text-green-600">
                  <ApperIcon name="CheckCircle" className="w-5 h-5" />
                  <span>No weather alerts for your crops today</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {agriculturalAdvice.map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.type === "error"
                          ? "border-red-500 bg-red-50"
                          : alert.type === "warning"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <ApperIcon 
                          name={alert.icon} 
                          className={`w-5 h-5 mt-0.5 ${
                            alert.type === "error"
                              ? "text-red-600"
                              : alert.type === "warning"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        />
                        <div>
                          <h4 className={`font-medium ${
                            alert.type === "error"
                              ? "text-red-800"
                              : alert.type === "warning"
                              ? "text-yellow-800"
                              : "text-blue-800"
                          }`}>
                            {alert.title}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            alert.type === "error"
                              ? "text-red-700"
                              : alert.type === "warning"
                              ? "text-yellow-700"
                              : "text-blue-700"
                          }`}>
                            {alert.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Extended Forecast */}
        {weather && weather.forecast && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Calendar" className="w-5 h-5 text-blue-600" />
                Extended Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weather.forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                  >
                    <div className="text-center">
                      <p className="font-medium text-gray-900 mb-2">{day.day}</p>
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <ApperIcon name="Sun" className="w-6 h-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-gray-900">{day.high}°F</p>
                        <p className="text-sm text-gray-600">Low: {day.low}°F</p>
                        <p className="text-sm text-gray-500 capitalize">{day.condition}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seasonal Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Leaf" className="w-5 h-5 text-green-600" />
              {seasonalTips.season} Farming Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasonalTips.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
                >
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800">{tip}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Weather;