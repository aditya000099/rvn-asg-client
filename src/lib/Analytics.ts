import { getVersion } from "@tauri-apps/api/app";
import { arch, platform } from "@tauri-apps/plugin-os";
import { v4 as uuidv4 } from "uuid";

let temp_deviceId: string | null = null;

export async function getOrCreateDeviceID(): Promise<string> {
  if (!temp_deviceId) {
    temp_deviceId = uuidv4();
  }
  return temp_deviceId;
}

export async function getDeviceID(): Promise<string | null> {
  return temp_deviceId;
}

export async function sendAnalyticsData() {
  const BACKEND_URL = "http://localhost:8000/";

  try {
    const dataToSend = {
      deviceId: await getOrCreateDeviceID(),
      appVersion: await getVersion(),
      platform: await platform(),
      architecture: await arch(),
      timestamp: new Date().toISOString(),
    };

    console.log("Sending analytics payload:", dataToSend);

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Server response:", responseData);
  } catch (error) {
    console.error("Failed to send: ", error);
  }
}
