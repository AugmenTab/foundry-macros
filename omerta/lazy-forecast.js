// This function is at the top for quick macro editing.
function getCityOptions() {
  const cities = {
    "Arrowbrook": "chicago",
    "Ataraxia": "new-york"
  };

  let html = "";
  Object.entries(cities).forEach(([setting, real]) => {
    html += `<option value="${real}">${setting}</option>`;
  });
  return html;
}

function buildForecastContent(data) {
  const center = "text-align:center;";
  const grid = "display:grid;";
  const bold = "font-weight:700;";
  const city = data.settingCity.toUpperCase();
  const citySpan = `<span style="display:block">${city}</span>`;
  const boxes = "grid-template-columns:repeat(2,1fr);";
  const conditions = getConditions(data.sky_conditions);
  return `
    <div style="${[ center, grid ].join(" ")}">
      <h2>${citySpan}WEATHER FORECAST</h2>
      <h3>${data.dateStr}</h3>
      <div style="${[ grid, boxes ].join(" ")}">
        <div>
          <h4 style="${bold}">Temperature</h4>
          <h3 style="font-size:3em">${data.temperature}&deg;</h3>
          ${displayLinkOrText(getHeat(data.temperature))}
        </div>
        <div>
          <h4 style="${bold}">Conditions</h4>
          <h3 style="font-size:3em"><i class="fas fa-${conditions.icon}"></i></h3>
          ${displayLinkOrText(conditions)}
        </div>
      </div>
    </div>
  `;
}

function displayLinkOrText(data) {
  const attrs = 'class="compendium-entry"';
  const a = `<a $${attrs}}>@Compendium[${data.rules}]{${data.text}}</a>`;
  const html = data.rules ? a : data.text;
  return `<div style="height:20px">${html}</div>`;
}

function getConditions(conditions) {
  const condResults = {
    "sunny": { "icon": "sun", "text": titleCase(conditions) },
    "partly cloudy": { "icon": "cloud-sun", "text": titleCase(conditions) },
    "overcast": {
      "rules": "world.haarpist.zzw5vUHAOsl7nG8K",
      "icon": "cloud",
      "text": titleCase(conditions)
    },
    "light rain": {
      "rules": "world.haarpist.325AyEidjIzgWis3",
      "icon": "cloud-sun-rain",
      "text": titleCase(conditions)
    },
    "moderate rain": {
      "rules": "world.haarpist.325AyEidjIzgWis3",
      "icon": "cloud-rain",
      "text": titleCase(conditions)
    },
    "heavy rain": {
      "rules": "world.haarpist.325AyEidjIzgWis3",
      "icon": "cloud-showers-heavy",
      "text": titleCase(conditions)
    },
    "violent rain": {
      "rules": "world.haarpist.325AyEidjIzgWis3",
      "icon": "bolt",
      "text": `${getRandomWinds()} Thunderstorm`
    },
    "light snow": {
      "rules": "world.haarpist.kfJ2EJQG4zXSFf8O",
      "icon": "snowflake",
      "text": titleCase(conditions)
    },
    "moderate snow": {
      "rules": "world.haarpist.kfJ2EJQG4zXSFf8O",
      "icon": "snowflake",
      "text": titleCase(conditions)
    },
    "heavy snow": {
      "rules": "world.haarpist.kfJ2EJQG4zXSFf8O",
      "icon": "snowflake",
      "text": titleCase(conditions)
    },
    "violent snow": {
      "rules": "world.haarpist.kfJ2EJQG4zXSFf8O",
      "icon": "snowflake",
      "text": `${getRandomWinds()} Blizzard`
    },
    "light fog": {
      "rules": "world.haarpist.NHVPGoUfb3M35Wr3",
      "icon": "smog",
      "text": titleCase(conditions)
    },
    "medium fog": {
      "rules": "world.haarpist.NHVPGoUfb3M35Wr3",
      "icon": "smog",
      "text": titleCase(conditions)
    },
    "heavy fog": {
      "rules": "world.haarpist.NHVPGoUfb3M35Wr3",
      "icon": "smog",
      "text": titleCase(conditions)
    },
    "breezy": { "icon": "wind", "text": titleCase(conditions) },
    "windy": { "icon": "wind", "text": titleCase(conditions) },
    "strong winds": {
      "rules": "world.haarpist.ySJN88OSry9MmJPM",
      "icon": "wind",
      "text": titleCase(conditions)
    },
    "severe winds": {
      "rules": "world.haarpist.ySJN88OSry9MmJPM",
      "icon": "wind",
      "text": titleCase(conditions)
    },
    "windstorm": {
      "rules": "world.haarpist.ySJN88OSry9MmJPM",
      "icon": "wind",
      "text": titleCase(conditions)
    },
  };
  return condResults[conditions];
}

function getDataFromHtml(html) {
  const citySelect = html.find("select[name='city']");
  const realCity = citySelect.val();
  const settingCity =
    citySelect[0].options[citySelect[0].options.selectedIndex].innerText;

  if (typeof(realCity) === undefined) {
    return 'invalid'
  } else {
    return {
      "day": html.find("input[name='day']").val(),
      "month": html.find("select[name='month']").val(),
      "year": html.find("input[name='year']").val(),
      "settingCity": settingCity,
      "realCity": realCity
    }
  }
}

function getDialogContent(date) {
  return `
    <form>
      <div class="form-group">
        <label>City</label>
        <select style="text-align:center" name="city">
          ${getCityOptions()}
        </select>
      </div>
      <div class="form-group">
        <label>Day</label>
        <input type="number" name="day" value="${date.getDate()}"/>
      </div>
      <div class="form-group">
        <label>Month</label>
        <select style="text-align:center" name="month">
          ${makeMonthOptions(date.getMonth() + 1)}
        </select>
      </div>
      <div class="form-group">
        <label>Year</label>
        <input type="number" name="year" value="${date.getFullYear()}"/>
      </div>
    </form>
  `;
}

async function getForecast(options) {
  const url = "https://0mn5swiv1g.execute-api.us-east-2.amazonaws.com"
            + "/Prod/forecast"
            + `?city=${options.realCity}`
            + `&day=${options.day}`
            + `&month=${options.month}`
            + `&cutoffYear=${options.cutoff}`;

  return await fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return "Something went wrong with Haarpist.";
    }
  }).catch(e => {
    return e
  });
}

function getHeat(temperature) {
  const coldRules = "pf-content.pf-rules.pXwhr9IdI6o8aqm5";
  const heatRules = "pf-content.pf-rules.d5jA5Uo7F7mpbfZE";
  if (temperature > 140) {
    return { "rules": heatRules, "text": "Extreme Heat" };
  } else if (temperature > 110) {
    return { "rules": heatRules, "text": "Severe Heat" };
  } else if (temperature > 90) {
    return { "rules": heatRules, "text": "Very Hot" };
  } else if (temperature < 40) {
    return { "rules": coldRules, "text": "Cold" };
  } else if (temperature < 0) {
    return { "rules": coldRules, "text": "Severe Cold" };
  } else if (temperature < -20) {
    return { "rules": coldRules, "text": "Extreme Cold" };
  } else {
    return { "text": "Comfortable" };
  }
}

function getRandomWinds() {
  const plusWinds = [ 'Strong', 'Severe', 'Violent' ];
  return plusWinds[Math.random() * plusWinds.length | 0];
}

function getRealCity(city) {
  const realCities = {
    "Arrowbrook": "chicago",
    "Ataraxia": "new-york",
  };
  return realCities[city];
}

async function handleForecastCreate(options) {
  const forecast = await getForecast(options);
  if ([ "undefined", "string" ].includes(typeof(forecast))){
    ui.notifications.error(forecast);
    return;
  }

  const data = { ...forecast, ...options };
  ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: buildForecastContent(data)
  });
}

function makeMonthOptions(currentMonth) {
  let html = '';
  for (let i = 0; i < 12; i++) {
    const selected = i + 1 === currentMonth ? "selected" : "";
    html += `<option value="${i + 1}"${selected}>Month #${i + 1}</option>`
  }
  return html;
}

function suffixNumber(num) {
  const j = num % 10;
  const k = num % 100;
  if (j == 1 && k != 11) {
      return num + "st";
  }
  if (j == 2 && k != 12) {
      return num + "nd";
  }
  if (j == 3 && k != 13) {
      return num + "rd";
  }
  return num + "th";
}

function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

async function createDialog() {
  const date = new Date();
  new Dialog({
    title: "Generate Forecast",
    content: getDialogContent(date),
    buttons:{
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: "Generate",
        callback: async html => {
          const options = getDataFromHtml(html);
          if (options === "invalid") {
            ui.notifications.error("Some of the inputs provided are invalid.");
          } else {
            options.day = parseFloat(options.day);
            options.month = parseFloat(options.month);
            options.year = parseFloat(options.year);
            options.cutoff = date.getFullYear();
            options.dateStr =
                `${suffixNumber(options.day)} Day of the `
              + `${suffixNumber(options.month)} Month, `
              + `Year ${options.year}`;
            handleForecastCreate(options);
          }
        }
      }
    },
    close: () => {}
  }).render(true);
}

await createDialog();
