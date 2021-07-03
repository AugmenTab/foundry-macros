const shadow = {
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
      active: false, 
      loopDuration: 500, 
      animType: "syncCosOscillation", 
      val1: 2, 
      val2: 4
    },
    rotation: {
      active: false,
      loopDuration: 100,
      animType: "syncSinOscillation",
      val1: 33,
      val2: 37
    }
  }
};

function getColorData(k) {
  const flareColors = {
    "R": {name:"red", saturation:1, brightness:1, contrast:1, red:1.8, green:0, blue:0, hex:"#ff0000"}, 
    "O": {name:"orange", saturation:1, brightness:1, contrast:1, red:1.1, green:0.4, blue:0, hex:"#ff6600"},
    "Y": {name:"yellow", saturation:1, brightness:1, contrast:1, red:1.4, green:1.4, blue:0, hex:"#ffff00"},
    "G": {name:"green", saturation:1, brightness:1, contrast:1, red:0, green:1.2, blue:0, hex:"#00ff00"},
    "B": {name:"blue", saturation:1, brightness:1, contrast:1, red:1, green:1, blue:1, hex:"#0000ff"},
    "P": {name:"purple", saturation:1, brightness:1, contrast:1, red:0.6, green:0, blue:1.2, hex:"#80080"},
    "M": {name:"magenta", saturation:0.4, brightness:2.5, contrast:0.8, red:1, green:0, blue:1, hex:"#ff00ff"},
    "W": {name:"white", saturation:0.2, brightness:2.5, contrast:0.4, red:1, green:1, blue:1, hex:"#ffffff"},
    "b": {name:"black", saturation:1, brightness:1, contrast:1, red:0, green:0, blue:0, hex:"#191919"},
    "g": {name:"gray", saturation:0, brightness:5, contrast:1, red:1, green:1, blue:1, hex:"#333333"},
  };  
  return flareColors[k];
};

function buildChatMessage(n, colors) {
  let names = [];
  for (i = 0; i < colors.length; i++) {
    names.push(colors[i].name);
  };
  const seq = `<b>${names.join(", ")}</b>`;
  return `${n} sent up ${names.length > 1 ? "flares" : "a flare"}: ${seq}.`;
};

async function createFlare(effectParams, xPosition, yPosition, i) {
  const flareSound = "worlds/sundered-lands/sounds/effects/flare.flac";
  const tileParams = {
    img: "worlds/sundered-lands/effects/flare.webm",
    width: 512,
    height: 512,
    scale: 1,
    x: xPosition,
    y: yPosition,
    z: 370,
    rotation: 0,
    hidden: false,
    locked: false
  };
  await AudioHelper.play({src: flareSound, volume: 0.8}, true);
  const tile = await Tile.create(tileParams);
  const selected = await canvas.background.tiles[i];
  await TokenMagic.addUpdateFilters(selected, effectParams);
  return tile;
};

async function createLight(color, xPosition, yPosition) {
  const light = await AmbientLight.create({
    x: xPosition + 260,
    y: yPosition + 260,
    dim: 10,
    bright: 15,
    angle: 360,
    tintColor: color.hex,
    tintAlpha: 1
  });
  return light[0].data._id;
}

function buildEffect(colorEffect) {
  let effectParams = [];
  effectParams.push(shadow);
  effectParams.push(colorEffect);
  return effectParams;
}

function prepEffect(color) {
  return {
    filterType: "adjustment",
    filterId: "flareColor",
    gamma: 1,
    alpha: 1,
    saturation: color.saturation,
    brightness: color.brightness,
    contrast: color.contrast,
    red: color.red,
    green: color.green,
    blue: color.blue,
    animated: {
      alpha: { 
        active: false, 
        loopDuration: 2000, 
        animType: "syncCosOscillation",
        val1: 0.35,
        val2: 0.75
      }
    }
  }
};

function sleep(millis) {
  const date = Date.now();
  let currentDate = 0;
  do {
    currentDate = Date.now()
  } while (currentDate - date < millis);
};

async function deleteFlareAndLight(tile, light) {
  await tile[0].delete();
  await canvas.lighting.deleteMany(light);
};

async function sendFlares(colors) {
  const time = 2400 + ((colors.length) * 325);
  for (i = 0; i < colors.length; ++i) {
    pos = await canvas.scene._viewPosition;
    let x = (pos.x / colors.length) * (i + 1) + (512 / 2);
    let y = pos.y - (512 / 2);
    const tile = await createFlare(buildEffect(prepEffect(colors[i])), x, y, i);
    let light = [];
    light.push(await createLight(colors[i], x, y));
    await setTimeout(deleteFlareAndLight, time, tile, light);
    sleep(400);
  };
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
      .filter(function(value, _, _) { return typeof(value) != "undefined"; });
    if (signaller === "") {
      signaller = "An unknown party";
    };
    if (colors.length > 0) {
      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        content: buildChatMessage(signaller, colors)
      }, {});
      sendFlares(colors);
    } else {
      ui.notifications.error("No valid flare colors entered.");
    };
  }
}).render(true);