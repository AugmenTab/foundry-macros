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

function existingNotesForRequestedDate(options) {
  const city = options.settingCity.toLowerCase();
  const noteDate = makeNoteDate(options);
  const notes =
    SimpleCalendar.api
                  .getNotesForDay(noteDate.year, noteDate.month, noteDate.day)
                  .filter(x => x.name.toLowerCase().includes(city));
  return notes[0];
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

function getDialogContent(date) {
  return `
    <form>
      <div class="form-group">
        <label>City</label>
        <select style="text-align:center" name="city">
          <option value="Arrowbrook">Arrowbrook</option>
          <option value="Ataraxia">Ataraxia</option>
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
    </form>
  `;
}

async function getForecast(options) {
  const url = "https://0mn5swiv1g.execute-api.us-east-2.amazonaws.com"
            + "/Prod/forecast"
            + `?weekday=${options.weekday}`
            + `&day=${options.day}`
            + `&month=${options.month}`
            + `&year=${options.year}`
            + `&settingCity=${options.settingCity}`
            + `&realCity=${options.realCity}`;
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
    "Arrowbrook": "chicago",
    "Ataraxia": "new-york",
  };
  return realCities[city];
}

function getWeekday(date, options) {
  let weekday;
  if (    options.day === date.day
       && options.month === date.month
       && options.year === date.year
     ) {
    weekday = SimpleCalendar.api.getCurrentWeekday().name;
  } else {
    const noteDate = makeNoteDate(options);
    const timestamp = SimpleCalendar.api.dateToTimestamp(noteDate);
    const date = SimpleCalendar.api.timestampToDate(timestamp);
    weekday = date.weekdays[date.dayOfTheWeek];
  }
  return weekday;
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
  const forecast = await getForecast(options);
  // TODO: Merge the two objects together once the API has been modified.
  options.temperature = forecast.temperature;
  options.sky_conditions = forecast.sky_conditions;
  options.precipitation = forecast.precipitation;

  const html = buildForecastContent(options);
  const noteDate = makeNoteDate(options);
  handleCreateCalendarForecastNote(html, options.settingCity, noteDate);
  handleCreateChatMessage(html);
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
  const adjDay = options.day - 1;
  const adjMonth = options.month - 1;
  return {
    year: options.year - (adjDay && adjMonth ? 0 : 1),
    month: adjMonth,
    day: adjDay,
    hour: 1,
    minute: 1,
    second: 1
  }
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
      }
    },
    close: () => {}
  }).render(true);
}

await createDialog();
