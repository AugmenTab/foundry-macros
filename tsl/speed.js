function buildChatMessage(val, units) {
  const converter =
  { "spd": val
  , "mph": Math.ceil((val - 40) / 2)
  , "kph": Math.ceil(((val / 1.6093440) - 40) / 2)
  , "spr": Math.ceil((((val * 30) / 88) - 40) / 2)
  };

  const conversion = converter[units];
  const spd = conversion > 1 ? conversion : 0;
  const mph = spd > 0 ? (spd * 2) + 40 : 0;
  const kph = Math.floor(mph * 1.6093440);
  const spr = Math.floor((mph * 88) / 30);

  return `
    <h2>Speed Conversion</h2>
    <table style="text-align:center">
      <thead>
        <tr>
          <th>Units</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
            <td><b>Speed</b></td>
            <td>${spd.toLocaleString()}</td>
          </tr>
          <tr>
            <td><b>MPH</b></td>
            <td>${mph.toLocaleString()}</td>
          </tr>
          <tr>
            <td><b>KPH</b></td>
            <td>${kph.toLocaleString()}</td>
          </tr>
          <tr>
            <td><b>Squares per Round</b></td>
            <td>${spr.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>`;
}

new Dialog({
  title: "Speed Conversion",
  content:`
    <form>
      <div class="form-group">
        <label>Units</label>
        <input type="number" name="val"/> 
      </div>
      <div class="form-group">
        <label>Speed Unit</label>
        <select name="units">
          <option value="spd">Speed</option>
          <option value="mph">MPH</option>
          <option value="kph">KPH</option>
          <option value="spr">SPR</option>
        </select> 
      </div>
    </form>
  `,
  buttons: {
    yes: {
      icon: '<i class="fas fa-check"></i>',
      label: "Convert"
    }
  },
  default: "yes",
  close: html => {
    const val = parseFloat(html.find("input[name='val']").val());
    const units = html.find("select[name='units']").val();
    if (isNaN(val)) {
      ui.notifications.error("Please enter a valid number.");
    } else {
      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        content: buildChatMessage(val, units)
      }, {});
    }
  }
}).render(true);