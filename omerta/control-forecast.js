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
  const conditions = getConditions(data.conditions);
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

  const weather = html.find("select[name='weather']").val();
  const severity = html.find("select[name='severity']").val();

  if ([ realCity, severity, weather ].some(x => typeof(x) === undefined)
    return 'invalid'
  } else {
    return {
      "day": html.find("input[name='day']").val(),
      "month": html.find("select[name='month']").val(),
      "year": html.find("input[name='year']").val(),
      conditions: makeConditionsFromOptions(weather, severity);
      "settingCity": settingCity,
      "realCity": realCity,
      "temperature": html.find("input[name='temperature']").val()
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
        <input type="number" name="day" value="${date.day}"/>
      </div>
      <div class="form-group">
        <label>Month</label>
        <select style="text-align:center" name="month">
          ${makeMonthOptions(date.month)}
        </select>
      </div>
      <div class="form-group">
        <label>Year</label>
        <input type="number" name="year" value="${date.year}"/>
      </div>
      <div class="form-group">
        <label>Temperature (&deg;F)</label>
        <input type="number" name="temperature" value="${0}"/>
      </div>
      <div class="form-group">
        <label>Weather</label>
        <select style="text-align:center" name="weather">
          ${makeWeatherOptions()}
        </select>
      </div>
      <div class="form-group">
        <label>Severity</label>
        <select style="text-align:center" name="severity">
          ${makeSeverityOptions()}
        </select>
      </div>
    </form>
  `;
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

function handleAskForOverwrite(options, existingNote) {
  const content = `
    <p>${options.settingCity} on ${options.dateStr} already has a forecast.</p>
    <p>Would you like to overwrite it?</p>
  `;

  new Dialog({
    title: "Forecast Conflict",
    content: content,
    buttons:{
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: "Overwrite",
        callback: async () => {
          SimpleCalendar.api.removeNote(existingNote.id);
          await handleForecastCreate(options);
          ui.notifications.warn(
              `Forecast for ${options.settingCity} on `
            + `${options.dateStr} has been overwritten.`
          );
        }
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: "Abort",
        callback: () => {
          handleCreateChatMessage(existingNote.data.content);
          ui.notifications.notify(
              `Forecast already exists for ${options.settingCity} on `
            + `${options.dateStr} - reprinting today's forecast.`
          );
        }
      }
    },
    default: "no",
    close: () => {}
  }).render(true);
}

function handleCreateCalendarForecastNote(html, city, date) {
  SimpleCalendar.api.addNote(
    `${city} Weather Forecast`, // title
    html, // content
    date, // startDate
    date, // endDate
    true, // allDay
    SimpleCalendar.api.NoteRepeat.Never, // repeats
    [ 'Forecast' ] // categories
  );
}

function handleCreateChatMessage(html) {
  ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: html
  });
}

async function handleForecastCreate(options) {
  const html = buildForecastContent(data);
  const noteDate = makeNoteDate(options);
  handleCreateCalendarForecastNote(html, options.settingCity, noteDate);
  handleCreateChatMessage(html);
}

function makeConditionsFromOptions(weather, severity) {
  if ([ "rain", "snow" ].contains(weather)) {
    return `${severity} ${weather}`;
  } else if (weather === "fog") {
    fogSeverity =
      switch(severity) {
        case "violent":  return `heavy ${weather}`;
        case "moderate": return `medium ${weather}`;
        default:         return `${severity} ${weather}`;
      }
  } else if (weather === "winds") {
      switch(severity) {
        case "violent":  return "windstorm";
        case "heavy":    return "severe winds";
        case "moderate": return "strong winds";
        case "light":    return "windy";
        default:         return "sunny"; // This should never happen.
  } else {
    return weather;
  }
}

function makeMonthOptions(currentMonth) {
  const months = SimpleCalendar.api.getAllMonths();
  let html = '';
  for (let i = 0; i < 12; i++) {
    const value = months[i].numericRepresentation;
    const selected = value === currentMonth ? "selected" : "";
    const name = months[i].name;
    html += `<option value="${value}"${selected}>${name}</option>`
  }
  return html;
}

function makeNoteDate(options) {
  return {
    year: options.year,
    month: options.month - 1,
    day: options.day - 1,
    hour: 1,
    minute: 1,
    second: 1
  }
}

function makeSeverityOptions() {
  let html = "";
  [ "Light", "Moderate", "Heavy", "Violent" ].forEach(severity => {
    html += `<option value="${severity.toLowerCase()}">${severity}</option>`;
  });
  return html;
}

function makeWeatherOptions() {
  const weather =
    [ "Sunny", "Partly Cloudy", "Overcast", "Rain", "Snow", "Fog", "Breezy", "Winds" ];

  let html = "";
  weather.forEach(evnt => {
    html += `<option value="${evnt.toLowerCase()}">${evnt}</option>`;
  });
  return html;
}

function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

async function createDialog() {
  const date = {
    day: SimpleCalendar.api.getCurrentDay().numericRepresentation,
    month: SimpleCalendar.api.getCurrentMonth().numericRepresentation,
    year: SimpleCalendar.api.getCurrentYear().numericRepresentation
  };

  new Dialog({
    title: "Control the Weather",
    content: getDialogContent(date),
    buttons:{
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: "Control Weather",
        callback: async html => {
          const options = getDataFromHtml(html);
          if (options === "invalid") {
            ui.notifications.error("Some of the inputs provided are invalid.");
            return;
          }

          options.day = parseFloat(options.day);
          options.month = parseFloat(options.month);
          options.year = parseFloat(options.year);
          options.weekday = getWeekday(date, options);

          const month =
            SimpleCalendar.api.getAllMonths()[options.month - 1].name;
          options.dateStr =
            `${options.weekday}, ${options.day} ${month}, ${options.year} YA`;

          const existingNote = existingNotesForRequestedDate(options);
          if (existingNote) {
            handleAskForOverwrite(options, existingNote);
          } else {
            handleForecastCreate(options);
          }
        }
      }
    },
    close: () => {}
  }).render(true);
}

await createDialog();
