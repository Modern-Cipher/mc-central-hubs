document.addEventListener("DOMContentLoaded", () => {
  // --- DITO KA MAG-UUPDATE NG VERSION ---
  const majorVersion = 1;
  const minorVersion = 0;

  const GAS_URL = "https://script.google.com/macros/s/AKfycbxrYCWNerjMtwP8HDYs-OMMla5fwrUgc1ws_enRYGpUTYMGIsX3zSrnfMgqt7afvMI/exec";
  const fullUrl = `${GAS_URL}?major=${majorVersion}&minor=${minorVersion}`;
  const versionElement = document.getElementById("version-display");

  if (versionElement) {
    fetch(fullUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(`API Error: ${data.error}`);
        }

        const { major, minor, timestamp, fixDate } = data;

        if (typeof major === "undefined" || typeof minor === "undefined") {
          throw new Error("Received incomplete data from API. Check Google Sheet.");
        }

        const fullVersionString = `Version ${major}.${minor}.${timestamp}.${fixDate}`;
        versionElement.textContent = fullVersionString;
      })
      .catch((error) => {
        versionElement.textContent = "Error loading version.";
      });
  }
});