function buildChatMessage(data) {
  const center = "text-align:center;";
  const grid = "display:grid;";
  const bold = "font-weight:700;";
  const citySpan = `<span style="display:block">${data.city.toUpperCase()}</span>`;
  const boxes = "grid-template-columns:repeat(2,1fr);";
  const conditions = getConditions(data.sky_conditions);
  return `
    <div style="${[ center, grid ].join(" ")}">
      <h2>${citySpan}WEATHER FORECAST</h2>
      <h3>${data.date}</h3>
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

function getDataFromHtml(html) {
    const settingCity = html.find("select[name='city']").val();
    const realCity = getRealCity(settingCity);

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

async function getForecast(data) {
  const reqDay = parseFloat(data.day);
  const reqMonth = parseFloat(data.month);
  const reqYear = parseFloat(data.year);
  const currentDay = SimpleCalendar.api.getCurrentDay().numericRepresentation;
  const currentMonth = SimpleCalendar.api.getCurrentMonth().numericRepresentation;
  const currentYear = SimpleCalendar.api.getCurrentYear().numericRepresentation;
  const sameDay = (
    reqDay === currentDay && reqMonth === currentMonth && reqYear === currentYear
  );

  let weekday;
  let queryDate = {
    year: reqYear,
    month: reqMonth - 1,
    day: reqDay - 1,
    hour: 1,
    minute: 1,
    second: 0
  }

  if (sameDay) {
    weekday = SimpleCalendar.api.getCurrentWeekday().name;
  } else {
    const timestamp = SimpleCalendar.api.dateToTimestamp(queryDate);
    const date = SimpleCalendar.api.timestampToDate(timestamp);
    weekday = date.weekdays[date.dayOfTheWeek];
  }

  const url = "https://0mn5swiv1g.execute-api.us-east-2.amazonaws.com"
            + "/Prod/forecast"
            + `?weekday=${weekday}`
            + `&day=${data.day}`
            + `&month=${data.month}`
            + `&year=${data.year}`
            + `&settingCity=${data.settingCity}`
            + `&realCity=${data.realCity}`;
  const results = await fetch(url);
  const body = await results.json();
  if (results.status === 200) {
    return body;
  } else {
    ui.notifications.error(body);
    return undefined;
  }
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
    "arrowbrook": "chicago",
    "ataraxia": "new-york",
  };
  return realCities[city];
}

function handleCreateOrUpdateNote(html, data) {
  // TODO: Check if a note exists for the same city on the forecast date.
  // If yes, create a dialog window asking if the user wants to overwrite.
    // If overwrite:
      // Create ui.notifications.warning saying the note was overwritten.
      // Delete the existing note and create a new note.
    // If no overwite:
      // return "Forecast already exists for that day - overwrite aborted."
  // If no:
    // Create new note using the provided html template (or a table if that fails).
  // IMPORTANT: All notes should have a title of `${data.city.toUpper()} WEATHER FORECAST`
  return "success";
}

async function handleForecastCreate(options) {
  const forecast = await getForecast(options);
  if (typeof(forecast) === "undefined") {
    return;
  }

  const html = buildChatMessage(forecast);
  const noteStatus = handleCreateOrUpdateNote(html, forecast);
  if (noteStatus === "success") {
    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(),
      content: buildChatMessage(forecast)
    }, {});
  } else {
    ui.notifications.warning(noteStatus);
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

function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function getDialogContent() {
  const day = SimpleCalendar.api.getCurrentDay().numericRepresentation;
  const month = SimpleCalendar.api.getCurrentMonth().numericRepresentation;
  const year = SimpleCalendar.api.getCurrentYear().numericRepresentation;
  return `
    <form>
      <div class="form-group">
        <label>City</label>
        <select style="text-align:center" name="city">
          <option value="arrowbrook">Arrowbrook</option>
          <option value="ataraxia">Ataraxia</option>
        </select>
      </div>
      <div class="form-group">
        <label>Day</label>
        <input type="number" name="day" value="${day}"/>
      </div>
      <div class="form-group">
        <label>Month</label>
        <select style="text-align:center" name="month">
          ${makeMonthOptions(month)}
        </select>
      </div>
      <div class="form-group">
        <label>Year</label>
        <input type="number" name="year" value="${year}"/>
      </div>
    </form>
  `;
}

async function createDialog() {
  return new Dialog({
    title: "Generate Forecast",
    content: getDialogContent(),
    buttons:{
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: "Generate"
      }
    },
    default: "yes",
    close: html => {
      const options = getDataFromHtml(html);
      if (options === "invalid") {
        ui.notifications.error("Some of the inputs provided are invalid.");
      } else {
        handleForecastCreate(options);
      }
    }
  }).render(true);
}

await createDialog();
