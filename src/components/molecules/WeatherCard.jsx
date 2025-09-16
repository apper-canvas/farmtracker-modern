import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ weather }) => {
  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      windy: "Wind"
    };
    return icons[condition] || "Sun";
  };

  const getGradientClass = (condition) => {
    const gradients = {
      sunny: "from-yellow-400 to-orange-500",
      cloudy: "from-gray-400 to-gray-600",
      rainy: "from-blue-400 to-blue-600",
      stormy: "from-purple-500 to-indigo-700",
      snowy: "from-blue-200 to-white",
      windy: "from-teal-400 to-cyan-500"
    };
    return gradients[condition] || "from-yellow-400 to-orange-500";
  };

  if (!weather) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Cloud" className="w-5 h-5 text-blue-500" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Weather data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="MapPin" className="w-5 h-5 text-blue-500" />
          {weather.location}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradientClass(weather.current.condition)} flex items-center justify-center shadow-lg`}>
              <ApperIcon 
                name={getWeatherIcon(weather.current.condition)} 
                className="w-6 h-6 text-white" 
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{weather.current.temperature}°F</p>
              <p className="text-sm text-gray-600 capitalize">{weather.current.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="font-semibold text-gray-900">{weather.current.humidity}%</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2">
            <ApperIcon name="Wind" className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-600">Wind</p>
              <p className="text-sm font-medium">{weather.current.windSpeed} mph</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Eye" className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-600">Visibility</p>
              <p className="text-sm font-medium">{weather.current.visibility} mi</p>
            </div>
          </div>
        </div>

        {/* 3-Day Forecast */}
        <div className="pt-4 border-t border-blue-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">3-Day Forecast</h4>
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                <p className="text-xs text-gray-600 mb-1">{day.day}</p>
                <div className={`w-6 h-6 mx-auto mb-1 rounded-full bg-gradient-to-br ${getGradientClass(day.condition)} flex items-center justify-center`}>
                  <ApperIcon 
                    name={getWeatherIcon(day.condition)} 
                    className="w-3 h-3 text-white" 
                  />
                </div>
                <p className="text-xs font-medium">{day.high}°/{day.low}°</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {weather.alerts && weather.alerts.length > 0 && (
          <div className="pt-4 border-t border-blue-200">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <ApperIcon name="AlertTriangle" className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Weather Alert</p>
                  <p className="text-xs text-amber-700">{weather.alerts[0]}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;