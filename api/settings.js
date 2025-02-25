import { api } from "../utils/api";

export const settingsApi = {
  //system settings
  getAllSettings: () => api.get("/settings"),
  updateSetting: (key, data) => api.put(`/settings/${key}`, data),
};
