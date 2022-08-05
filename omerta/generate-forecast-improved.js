function existingNotesForRequestedDate(options) {
  const city = options.settingCity.toLowerCase();
  const noteDate = makeNoteDate(options);
  const notes =
    SimpleCalendar.api
                  .getNotesForDay(noteDate.year, noteDate.month, noteDate.day)
                  .filter(x => x.name.toLowerCase().includes(city));
  return notes[0];
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

function handleAskForOverwrite(date, options, existingNote) {
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
        callback: () => {
          SimpleCalendar.api.removeNote(existingNote.id);
          handleForecastCreate(date, options);
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

function handleCreateChatMessage(html) {
  ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: html
  });
}

function handleForecastCreate(date, options) {
  // TODO: Get forecast, create note, and create chat message.
  console.log("Create a new forecast.");
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
            date.weekday = getWeekday(date, options);

            const month = SimpleCalendar.api.getAllMonths()[date.month - 1].name;
            options.dateStr =
              `${date.weekday}, ${date.day} ${month}, ${date.year} YA`;

            const existingNote = existingNotesForRequestedDate(options);
            if (existingNote) {
              handleAskForOverwrite(date, options, existingNote);
            } else {
              handleForecastCreate(date, options);
            }
          }
        }
      }
    },
    close: () => {}
  }).render(true);
}

await createDialog();
