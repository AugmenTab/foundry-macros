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

function existingNotesForRequestedDate(options) {
  const city = options.city.toLowerCase();
  const noteDate = makeNoteDate(options);
  const notes =
    SimpleCalendar.api
                  .getNotesForDay(noteDate.year, noteDate.month, noteDate.day)
                  .filter(x => x.name.toLowerCase().includes(city));
  return notes[0];
}

function getDataFromHtml(html) {
  const citySelect = html.find("select[name='city']");
  const city =
    citySelect[0].options[citySelect[0].options.selectedIndex].innerText;

  return {
    "day": html.find("input[name='day']").val(),
    "month": html.find("select[name='month']").val(),
    "year": html.find("input[name='year']").val(),
    "city": city,
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
    </form>
  `;
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

async function createDialog() {
  const date = {
    day: SimpleCalendar.api.getCurrentDay().numericRepresentation,
    month: SimpleCalendar.api.getCurrentMonth().numericRepresentation,
    year: SimpleCalendar.api.getCurrentYear().numericRepresentation
  };

  new Dialog({
    title: "Post Existing Forecast",
    content: getDialogContent(date),
    buttons:{
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: "Post",
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
              ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker(),
                content: existingNote.data.content
                });;
            } else {
              ui.notifications.warn(
                `No forecast found for ${options.city} on ${options.dateStr}.`
              );
            }
          }
        }
      }
    },
    close: () => {}
  }).render(true);
}

await createDialog();
