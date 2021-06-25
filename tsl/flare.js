const flareColors = {
  "R": "red",
  "O": "orange",
  "Y": "yellow",
  "G": "green",
  "B": "blue",
  "P": "purple",
  "M": "magenta",
  "W": "white",
  "b": "black",
  "g": "gray"
};

function getColor(k) {
  return flareColors[k];
};

function buildChatMessage(name, colors) {
  // for (i = 0; i < colors.length; i++) {
  //   if (colors[i] === "")
  // };
  const seq = `<b>${colors.join(", ")}</b>`;
  return `${name} sent up ${colors.length > 1 ? "flares" : "a flare"}: ${seq}.`;
};

new Dialog({
  title:'Flare Sequence',
  content:`
    <form>
      <div class="form-group">
        <table style="text-align:center">
          <thead>
            <tr>
              <th>Red</th>
              <th>Orange</th>
              <th>Yellow</th>
              <th>Green</th>
              <th>Blue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>R</td>
              <td>O</td>
              <td>Y</td>
              <td>G</td>
              <td>B</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>Purple</th>
              <th>Magenta</th>
              <th>White</th>
              <th>Black</th>
              <th>Gray</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>P</td>
              <td>M</td>
              <td>W</td>
              <td>b</td>
              <td>g</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-group">
        <label>Enter Sequence:</label>
        <input id="field" type="text"></input>
      </div>
      <div class="form-group">
        <label>Sending Party:</label>
        <input id="party" type="text"></input>
      </div>
    </form>`,
  buttons:{
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: "Signal"
    }
  },
  default:"yes",
  close: html => {
    let signaller = html.find("input[id='party']").val();
    const colors = html.find("input[id='field']").val().split("").map(getColor)
      .filter(function(value, index, arr) { return value; });
    if (signaller === "") {
      signaller = "An unknown party";
    };
    if (colors.length > 0) {
      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        content: buildChatMessage(signaller, colors)
      }, {});
      // for (i = 0; i < result.length; ++i) {
        // TODO: Call function to trigger animations.
      // };
    } else {
      ui.notifications.error("No valid flare colors entered.");
    };
  }
}).render(true);