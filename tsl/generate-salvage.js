// Roll salvage vehicle results.
async function getSalvageResults(rollTable) {
  const table  = game.tables.contents.find(t => t.name === rollTable);
  const options = { roll: table.data.formula, displayChat: false, async: true };
  const drawResult = await table.draw(options);
  return drawResult.results[0].data.text;
}

// Roll salvage vehicle body.
async function getSalvageBody() {
  const classification = "Salvage Vehicle Classification";
  const body = await getSalvageResults(classification);
  console.log(body);

  const steamhorse = ["Putter Pony", "Steamhorse", "Quad"];
  const auto = [
    "Barchetta", "Big Axle", "Buggy", "Coupé", "Open-Wheel", "Phaeton",
    "Pickup", "Roadster", "Sedan", "Van", "Wagon"
  ];
  const heavy = ["Bus", "Day Cab Rig", "Double-Decker", "Sleeper Cab Rig", "Tank"];

  const steamhorseAir = ["Libellule", "Gyrocopter"];
  const autoAir = ["Monoplane", "Biplane"];
  const heavyAir = ["Aerostat", "Megaplane"];

  const steamhorseAq = ["Dinghy", "Skimmer"];
  const autoAq = ["Catamaran", "Runabout", "Thunderboat"];
  const heavyAq = ["Barge", "Yacht"];

  let group = "";
  if (steamhorse.includes(body)) {
    group = "Ground Steamhorse";
  } else if (auto.includes(body)) {
    group = "Ground Auto";
  } else if (heavy.includes(body)) {
    group = "Ground Heavy";
  } else if (steamhorseAir.includes(body)) {
    group = "Aerial Steamhorse";
  } else if (autoAir.includes(body)) {
    group = "Aerial Auto";
  } else if (heavyAir.includes(body)) {
    group = "Aerial Heavy";
  } else if (steamhorseAq.includes(body)) {
    group = "Aquatic Steamhorse"
  } else if (autoAq.includes(body)) {
    group = "Aquatic Auto"
  } else if (heavyAq.includes(body)) {
    group = "Heavy Steamhorse"
  }

  return `${body} (${group})`;
}

// Roll salvage vehicle parts table.
async function getSalvageParts(isAerial, isAquatic) {
  const parts = ["Engine", "Transmission", "Suspension", "Chassis"];
  let partsData = "";
  for (let i = 0; i < parts.length; i++) {
    const partData = await getSalvageResults(`Salvage ${parts[i]}`);
    const consume = partData.split("::").map(x => x.trim());
    if ((isAerial || isAquatic) && parts[i] === "Suspension") {
      partsData +=
        `<tr>
          <td>${parts[i]}</td>
          <td>Independent ${consume[0].split(" ").pop()}</td>
          <td>${consume[1]}</td>
          <td>${await getSalvageResults("Part Integrity")}</td>
        </tr>`;
    } else if (isAerial && parts[i] === "Chassis") {
      partsData +=
        `<tr>
          <td>${parts[i]}</td>
          <td>AWD Prop</td>
          <td>Br [[d10]]</td>
          <td>${await getSalvageResults("Part Integrity")}</td>
        </tr>`;
    } else if (isAquatic && parts[i] === "Chassis") {
      partsData += `<tr><td>Chassis</td><td colspan="3">None</td></tr>`;
    } else {
      const partType =
           parts[i] === "Chassis"
        && (consume[0].includes("Tracks") || consume[0].includes("Screw"))
          ? `AWD ${consume[0].split(" ").pop()}`
          : consume[0];
      partsData +=
        `<tr>
          <td>${parts[i]}</td>
          <td>${partType}</td>
          <td>${consume[1]}</td>
          <td>${await getSalvageResults("Part Integrity")}</td>
        </tr>`;
    }
  }
  let html =
  `<table style="text-align:center">
    <thead>
      <tr>
        <th>Part</th>
        <th>Type</th>
        <th style="width:45px">Stat</th>
        <th>Integ.</th>
      </tr>
    </thead>
    <tbody>
      ${partsData}
    </tbody>
  </table>`;
  return html;
}

// Construct HTML message table for chat message.
const hpRoll = await new Roll("d100").roll({async: true});
async function buildMessageTable() {
  const bodyResults = await getSalvageBody();
  const isAerial = bodyResults.includes("Aerial");
  const isAquatic = bodyResults.includes("Aquatic");
  let messageTable =
    `<b><h2>Salvage Vehicle</h2></b>
    <p><b>Vehicle:</b> ${bodyResults}</p>
    <p><b>Hit Points:</b> ${hpRoll.total}%</p>
    ${await getSalvageParts(isAerial, isAquatic)}`;
  return messageTable;
}

// Construct the chat message.
async function buildChatData() {
  return {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: await buildMessageTable(),
  };
}

ChatMessage.create(await buildChatData(), {});