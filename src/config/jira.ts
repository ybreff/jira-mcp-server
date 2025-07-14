import axios, { AxiosInstance } from "axios";
import { JiraConfig } from "../types/jira.js";

// Configuración de Jira
export const jiraConfig: JiraConfig = {
  baseURL: process.env.JIRA_BASE_URL || "https://your-domain.atlassian.net",
  username: process.env.JIRA_USERNAME || "",
  apiToken: process.env.JIRA_API_TOKEN || "",
};

// Función para crear cliente Jira
export function createJiraClient(): AxiosInstance {
  const client = axios.create({
    baseURL: `${jiraConfig.baseURL}/rest/api/3`,
    auth: {
      username: jiraConfig.username,
      password: jiraConfig.apiToken,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 30000,
  });

  // Interceptor para logging de errores
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Jira API Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });
      return Promise.reject(error);
    }
  );

  return client;
}
