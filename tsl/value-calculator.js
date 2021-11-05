function areAnyInvalidInputs(html) {
  const fields = [ "hp", "ho", "engineInteg", "po", "fluid", "transmissionInteg"
                 , "re", "suspensionInteg", "br", "chassisInteg" ];
  return fields.map(x => {
    return parseFloat(html.find(`input[name='${x}']`).val());
  }).some(isNaN);
}

function buildChatMessage(data, speaker) {
  console.log(data.transmission);
}

function decodeBodyData(html) {
  const bodyStyles = {
    "barchetta": 575
  , "buggy": 150
  , "bus": 850
  , "coupe": 550
  , "dayCab": 1000
  , "doubleDecker": 8500
  , "openWheel": 600
  , "phaeton": 900
  , "pickup": 400
  , "putterPony": 75
  , "quad": 100
  , "roadster": 450
  , "sedan": 425
  , "sleeperCab": 1250
  , "steamhorse": 120
  , "van": 475
  , "wagon": 510
  };
  const style = html.find("select[name='body']").val();
  let hp = html.find("input[name='hp']").val();
  if (hp < 1) {
    hp = 0;
  } else if (hp > 100) {
    hp = 100;
  }
  return hp === 0 ? 0 : Math.floor(hp * 0.01 * bodyStyles[style]);
}

function decodeEngineData(html) {
  const cost = [10, 20, 45, 90, 185, 375, 750, 1500, 3000, 6000];
  const type = {
    "steam": 0.9
  , "guzzoline": 1
  , "deezul": 1.05
  , "arcanomotor": 1.5
  , "crystal": 1.5
  , "elemental": 1.75
  , "tourbillon": 2.5
  };

  const typeSelection = html.find("select[name='engineType']").val();
  let ho = parseInt(html.find("input[name='ho']").val());
  let integrity = parseInt(html.find("input[name='engineInteg']").val());

  if (ho < 0) ho = 0;
  if (integrity < 0) {
    integrity = 0;
  } else if (integrity > 10) {
    integrity = 10;
  }

  const hoCost = ho > 10 ? (6000 * 2**(ho - 10)) : cost[ho - 1];
  return integrity === 0 ? 0 : (
    Math.floor(hoCost * type[typeSelection] * (integrity * 0.1))
  );
}

function decodeSuspensionData(html) {
  const cost = [10, 20, 30, 50, 80, 130, 210, 340, 550, 890];
  const dependency = { "dependent": 1, "mixed": 1.5, "independent": 2 };
  const type = {
    "mechanical": 1
  , "hydraulic": 1.2
  , "pneumatic": 1.5
  , "esoteric": 2
  };

  const typeSelection = html.find("select[name='suspensionType']").val();
  const dependencySelection = html.find("select[name='suspensionDependency']").val();
  let re = parseInt(html.find("input[name='re']").val());
  let integrity = parseInt(html.find("input[name='suspensionInteg']").val());

  if (re < 0) re = 0;
  if (integrity < 0) {
    integrity = 0;
  } else if (integrity > 10) {
    integrity = 10;
  }

  const reCost = getReCost(re);
  console.log(reCost);
  return integrity === 0 ? 0 : Math.floor(
    reCost * type[typeSelection] * dependency[dependencySelection] * (integrity * 0.1)
  );
}

function getReCost(re) {
  let num1 = 10;
  let num2 = 20;
  if (re === 1) {
    return num1;
  } else if (re === 2) {
    return num2;
  } else {
    re -= 2;
    for (let i = 0; i < re; i++) {
      let sum = num1 + num2;
      num1 = num2;
      num2 = sum;
    }
  }
  return num2;
}

function decodeTransmissionData(html) {
  const typeSelection = html.find("select[name='transmissionType']").val();
  let po = parseInt(html.find("input[name='po']").val());
  let fluid = parseInt(html.find("input[name='fluid']").val());
  let integrity = parseInt(html.find("input[name='transmissionInteg']").val());

  if (po < 0) {
    po = 1;
  } else if (po > 10) {
    po = 10;
  }

  if (fluid < 0) {
    fluid = 1;
  } else if (fluid > 10) {
    fluid = 10;
  }

  if (integrity < 0) {
    integrity = 0;
  } else if (integrity > 10) {
    integrity = 10;
  }

  const cost = [300, 250, 200, 150, 100, 100, 150, 200, 250, 300];
  const type = {
    "manual": cost[po - 1] * 1
  , "sequential": cost[po - 1] * 1.5
  , "horlogian": cost[po - 1] * 2
  , "spectrum": (cost[po - 1] + cost[fluid - 1]) + ((10**fluid) * 3)
  , "torqueConverter": (cost[po - 1] + cost[fluid - 1]) * Math.abs(po - fluid)
  };
  return integrity === 0 ? 0 : Math.floor(type[typeSelection] * (integrity * 0.1));
}

function getDataFromHtml(html) {
  if (areAnyInvalidInputs(html)) {
    return { invalid: true };
  } else {
    return {
      body: decodeBodyData(html)
    , engine: decodeEngineData(html)
    , transmission: decodeTransmissionData(html)
    , suspension: decodeSuspensionData(html)
    , chassis: 0 // decodeChassisData(html)
    };
  }
}

function getDialogContent() {
  return `
  <form>
    <h2>Body</h2>
    <div class="form-group">
      <label>Body Style</label>
      <select name="body">
        <!-- <option value="aerostat">Aerostat</option> -->
        <option value="barchetta">Barchetta</option>
        <!-- <option value="biplane">Biplane</option> -->
        <option value="buggy">Buggy</option>
        <option value="bus">Bus</option>
        <option value="coupe">Coupé</option>
        <option value="dayCab">Day Cab Rig</option>
        <option value="doubleDecker">Double-Decker</option>
        <!-- <option value="gyrocopter">Gyrocopter</option> -->
        <!-- <option value="libellule">Libellule</option> -->
        <!-- <option value="megaplane">Megaplane</option> -->
        <!-- <option value="monoplane">Monoplane</option> -->
        <option value="openWheel">Open-Wheel</option>
        <option value="phaeton">Phaeton</option>
        <option value="pickup">Pickup</option>
        <option value="putterPony">Putter Pony</option>
        <option value="quad">Quad</option>
        <option value="roadster">Roadster</option>
        <option value="sedan">Sedan</option>
        <option value="sleeperCab">Sleeper Cab Rig</option>
        <option value="steamhorse">Steamhorse</option>
        <option value="van">Van</option>
        <option value="wagon">Wagon</option>
      </select>
    </div>
    <div class="form-group">
      <label>Hit Points Percent</label>
      <input type="number" name="hp" value="0"/>
    </div>

    <h2>Engine</h2>
    <div class="form-group">
      <label>Engine Type</label>
      <select name="engineType">
        <option value="steam">Steam</option>
        <option value="guzzoline">Guzzoline</option>
        <option value="deezul">Deezul</option>
        <option value="arcanomotor">Arcanomotor</option>
        <option value="crystal">Crystal</option>
        <option value="elemental">Elemental</option>
        <option value="tourbillon">Tourbillon</option>
      </select>
    </div>
    <div class="form-group">
      <label>Engine Horsepower</label>
      <input type="number" name="ho" value="0"/>
    </div>
    <div class="form-group">
      <label>Engine Integrity</label>
      <input type="number" name="engineInteg" value="0"/>
    </div>

    <h2>Transmission</h2>
    <div class="form-group">
      <label>Transmission Type</label>
      <select name="transmissionType">
        <option value="manual">Manual</option>
        <option value="sequential">Sequential</option>
        <option value="horlogian">Horlogian</option>
        <option value="spectrum">Spectrum</option>
        <option value="torqueConverter">Torque Converter</option>
      </select>
    </div>
    <div class="form-group">
      <label>Transmission Power Transfer</label>
      <input type="number" name="po" value="0"/>
    </div>
    <div class="form-group">
      <label>Transmission Fluid</label>
      <input type="number" name="fluid" value="0"/>
    </div>
    <div class="form-group">
      <label>Transmission Integrity</label>
      <input type="number" name="transmissionInteg" value="0"/>
    </div>

    <h2>Suspension</h2>
    <div class="form-group">
      <label>Suspension Type</label>
      <select name="suspensionType">
        <option value="mechanical">Mechanical</option>
        <option value="hydraulic">Hydraulic</option>
        <option value="pneumatic">Pneumatic</option>
        <option value="esoteric">Esoteric</option>
      </select>
    </div>
    <div class="form-group">
      <label>Suspension Dependency</label>
      <select name="suspensionDependency">
        <option value="dependent">Dependent</option>
        <option value="Mixed"></option>
        <option value="independent">Fully Independent</option>
      </select>
    </div>
    <div class="form-group">
      <label>Suspension Reactivity</label>
      <input type="number" name="re" value="0"/>
    </div>
    <div class="form-group">
      <label>Suspension Integrity</label>
      <input type="number" name="suspensionInteg" value="0"/>
    </div>

    <h2>Chassis</h2>
    <div class="form-group">
      <label>Chassis Type</label>
      <select name="chassisType">
        <option value="wheels">Wheels</option>
        <option value="rail">Rail</option>
        <option value="pedrail">Pedrail</option>
        <option value="tracks">Tracks</option>
        <option value="screw">Screw</option>
      </select>
    </div>
    <div class="form-group">
      <label>Chassis Drive</label>
      <select name="chassisDrive">
        <option value="fwd">FWD</option>
        <option value="rwd">RWD</option>
        <option value="awd">AWD</option>
      </select>
    </div>
    <div class="form-group">
      <label>Chassis Brakes</label>
      <input type="number" name="br" value="0"/>
    </div>
    <div class="form-group">
      <label>Chassis Integrity</label>
      <input type="number" name="chassisInteg" value="0"/>
    </div>
  </form>
`;
}

new Dialog({
  title: "Vehicle Value Calculator",
  content: getDialogContent(),
  buttons: {
    yes: {
      icon: '<i class="fas fa-check"></i>',
      label: "Calculate"
    }
  },
  default: "yes",
  close: html => {
    const data = getDataFromHtml(html);
    if (data.invalid) {
      ui.notifications.error("Some of the inputs provided are invalid.");
    } else {
      const speaker = ChatMessage.getSpeaker();
      ChatMessage.create({
        user: game.user.id,
        speaker: speaker,
        content: buildChatMessage(data, speaker)
      }, {});
    }
  }
}).render(true);