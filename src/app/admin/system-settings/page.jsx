"use client";
import { settingsApi } from "@/api/settings";
import React, { useState, useEffect } from "react";

const SystemSettings = () => {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const response = await settingsApi.getAllSettings();
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching system settings", error);
      }
    };

    fetchSystemSettings();
  }, []);

  const handleUpdateSetting = async (key, newValue) => {
    try {
      // Optimistic UI Update
      const updatedSettings = settings.map((setting) =>
        setting.key === key
          ? { ...setting, value: JSON.stringify(newValue) }
          : setting
      );
      setSettings(updatedSettings);

      // API Call
      await settingsApi.updateSetting(key, { value: newValue });

      console.log("Setting updated successfully:", key, newValue);
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  // Categorize settings
  const categorizedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) acc[setting.category] = [];
    acc[setting.category].push(setting);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl ml-20 mt-10 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">
        System Settings
      </h2>

      {Object.entries(categorizedSettings).map(([category, settings]) => (
        <div key={category} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-300 pb-2 mb-4 capitalize">
            {category}
          </h3>

          <div className="space-y-4">
            {settings.map(({ key, value, data_type, description }) => (
              <div key={key} className="p-4 rounded-lg">
                <p className="text-gray-700 font-medium capitalize">
                  {description}
                </p>

                {data_type === "boolean" ? (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600">
                      {JSON.parse(value) ? "Enabled" : "Disabled"}
                    </span>
                    <label className="relative inline-flex cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={JSON.parse(value)}
                        onChange={(e) =>
                          handleUpdateSetting(key, e.target.checked)
                        }
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ) : (
                  <input
                    type="number"
                    className="w-full mt-2 p-2 border rounded-lg"
                    value={JSON.parse(value)}
                    onChange={(e) =>
                      handleUpdateSetting(key, Number(e.target.value))
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemSettings;
