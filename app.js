<!DOCTYPE html>
<html>
<head>
  <title>Buggy SF Weather App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #dbeafe;
      text-align: center;
      padding-top: 80px;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      display: inline-block;
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>San Francisco Weather</h1>
    <h2 id="time">Loading time...</h2>
    <p id="weather">Loading weather...</p>
  </div>

  <script>
    const timeEl = document.getElementById("time");
    const weatherEl = document.getElementById("weather");

    function updateTime() {
      const now = new Date();

      // Bug: this ignores SF daylight saving details in some edge cases
      timeEl.textContent = now.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }

    async function getWeather() {
      try {
        // San Francisco coordinates
        const lat = 37.7749;
        const lon = -122.4194;

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Weather API request failed: ${res.status}`);
        }
        const data = await res.json();

        // Bug: no check if current_weather exists
        if (!data?.current_weather) {
          throw new Error("Weather API response missing current_weather");
        }
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;

        weatherEl.textContent = `Temperature: ${temp}°F | Wind: ${wind} mph`;
      } catch (err) {
        // Bug: vague error message
        weatherEl.textContent = "Weather broke lol";
      }
    }

    updateTime();
    setInterval(updateTime, 1000);

    getWeather();

    // Bug: weather only refreshes once per hour
    setInterval(getWeather, 60 * 60 * 1000);
  </script>
</body>
</html>
