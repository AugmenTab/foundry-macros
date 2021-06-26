const file = "";
const flareColors = {
  "R": {name:"red" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */}, 
  "O": {name:"orange" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */},
  "Y": {name:"yellow" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */},
  "G": {name:"green" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */},
  "B": {name:"blue" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */},
  "P": {name:"purple" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */},
  "M": {name:"magenta" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */},
  "W": {name:"white" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */},
  "b": {name:"black" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */},
  "g": {name:"gray" /*, saturation:_, brightness:_, contrast:_, gamma:_, red:_, green:_, blue:_ */}
};

let params = [
  {
    filterType: "adjustment",
    filterId: "flareColor",
    saturation: 1,
    brightness: 1,
    contrast: 1,
    gamma: 1,
    red: 0,
    green: 0,
    blue: 0,
    alpha: 1,
    animated: {
      alpha: { 
        active: false, 
        loopDuration: 2000, 
        animType: "syncCosOscillation",
        val1: 0.35,
        val2: 0.75
      }
    }
  },
  {
    filterType: "shadow",
    filterId: "flareShadow",
    rotation: 35,
    blur: 2,
    quality: 5,
    distance: 20,
    alpha: 0.7,
    padding: 10,
    shadowOnly: false,
    color: 0x000000,
    zOrder: 6000,
    animated: {
      blur: { 
        active: true, 
        loopDuration: 500, 
        animType: "syncCosOscillation", 
        val1: 2, 
        val2: 4
      },
      rotation: {
        active: true,
        loopDuration: 100,
        animType: "syncSinOscillation",
        val1: 33,
        val2: 37
      }
    }
  }
];

function getColorData(k) {
  return flareColors[k];
};

function buildChatMessage(n, colors) {
  names = [];
  for (i = 0; i < colors.length; i++) {
    names.push(colors[i].name);
  };
  const seq = `<b>${names.join(", ")}</b>`;
  return `${n} sent up ${names.length > 1 ? "flares" : "a flare"}: ${seq}.`;
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
    const colors = html.find("input[id='field']").val().split("")
      .map(getColorData)
      .filter(function(value, index, arr) { return value.name; });
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