import { useState, useEffect } from "react";
import "./App.css";
import { sendAnalyticsData, getDeviceID } from "./lib/Analytics";
import { getVersion } from "@tauri-apps/api/app";
import { arch, platform } from "@tauri-apps/plugin-os";

function App() {
  const [os, setOs] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [appVersion, setappVersion] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

    setOs(await platform());
    setappVersion(await getVersion());
    setDeviceId(await getDeviceID());
    sendAnalyticsData();
  }

  useEffect(() => {
    sendAnalyticsData();
    const interval = setInterval(() => {
      sendAnalyticsData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <h1>Analytics Client App</h1>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        {/* <input id="greet-input" placeholder="Enter a name..." /> */}
        <button type="submit">Send</button>
      </form>
      <p>{os}</p>
      <p>{deviceId}</p>
      <p>{appVersion}</p>
    </main>
  );
}

export default App;
