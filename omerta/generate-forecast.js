function buildChatMessage(data) {
    const center = "text-align:center;";
    const grid = "display:grid;";
    const bold = "font-weight:700;";
    const citySpan = `<span style="display:block">${data.city.toUpperCase()}</span>`;
    const boxes = "grid-template-columns:repeat(2,1fr);";
    console.log(data.sky_conditions);
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
  const attrs = `style="color:black" href="${data.link}"`;
  const a = `<a ${attrs}><i class="fas fa-book"></i>&nbsp;${data.text}</a>`;
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
  // TODO: Attach the actual rules links to these.
  const condResults = {
    "sunny": { "icon": "sun", "text": titleCase(conditions) },
    "partly cloudy": { "icon": "cloud-sun", "text": titleCase(conditions) },
    "overcast": {
      "rules": "TODO", // Overcast conditions grant concealment for creatures flying at high altitude.
      "icon": "cloud",
      "text": titleCase(conditions)
    },
    "light rain": {
      "rules": "TODO", // Rules for drizzle.
      "icon": "cloud-sun-rain",
      "text": titleCase(conditions)
    },
    "moderate rain": {
      "rules": "TODO", // Rules for overcast and rain.
      "icon": "cloud-rain",
      "text": titleCase(conditions)
    },
    "heavy rain": {
      "rules": "TODO", // Rules for overcast and heavy rain.
      "icon": "cloud-showers-heavy",
      "text": titleCase(conditions)
    },
    "violent rain": {
      "rules": "TODO", // Thunderstorm.
      "icon": "bolt",
      "text": titleCase(conditions)
    },
    "light snow": {
      "rules": "TODO", // Rules for light snow.
      "icon": "snowflake",
      "text": titleCase(conditions)
    },
    "moderate snow": {
      "rules": "TODO", // Rules for overcast and medium snow.
      "icon": "snowflake",
      "text": titleCase(conditions)
    },
    "heavy snow": {
      "rules": "TODO", // Rules for overcast heavy snow.
      "icon": "snowflake",
      "text": titleCase(conditions)
    },
    "violent snow": {
      "rules": "TODO", // Blizzard.
      "icon": "snowflake",
      "text": titleCase(conditions)
    },
    "light fog": {
      "rules": "TODO", // Light fog.
      "icon": "smog",
      "text": titleCase(conditions)
    },
    "medium fog": {
      "rules": "TODO", // Medium fog.
      "icon": "smog",
      "text": titleCase(conditions)
    },
    "heavy fog": {
      "rules": "TODO", // Heavy fog.
      "icon": "smog",
      "text": titleCase(conditions)
    },
    "breezy": { "icon": "wind", "text": titleCase(conditions) },
    "windy": { "icon": "wind", "text": titleCase(conditions) },
    "strong winds": {
      "rules": "TODO", // Strong winds.
      "icon": "wind",
      "text": titleCase(conditions)
    },
    "severe winds": {
      "rules": "TODO", // Severe winds.
      "icon": "wind",
      "text": titleCase(conditions)
    },
    "windstorm": {
      "rules": "TODO", // Windstorm.
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
  // TODO: Attach the actual rules links to these.
  if (temperature > 140) {
    return { "rules": "TODO", "text": "Extreme Heat" };
  } else if (temperature > 110) {
    return { "rules": "TODO", "text": "Severe Heat" };
  } else if (temperature > 90) {
    return { "rules": "TODO", "text": "Very Hot" };
  } else if (temperature < 40) {
    return { "rules": "TODO", "text": "Cold" };
  } else if (temperature < 0) {
    return { "rules": "TODO", "text": "Severe Cold" };
  } else if (temperature < -20) {
    return { "rules": "TODO", "text": "Extreme Cold" };
  } else {
    return { "text": "Comfortable" };
  }
}

function getRealCity(city) {
    const realCities = {
        "arrowbrook": "chicago",
        "ataraxia": "new-york",
    };
    return realCities[city];
}


async function makeForecast(options) {
    const forecast = await getForecast(options);
    if (typeof(forecast) === "undefined") {
        return;
    }

    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        content: buildChatMessage(forecast)
    }, {});
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
              makeForecast(options);
          }
      }
  }).render(true);
}

await createDialog();
