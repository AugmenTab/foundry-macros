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

  const steamhorse = ["Motorsled", "Putter Pony", "Steamhorse", "Quad"];
  const auto = [
    "Barchetta", "Buggy", "Coupé", "Open-Wheel", "Phaeton", "Pickup",
    "Roadster", "Sedan", "Van", "Wagon"
  ];
  const heavy = ["Bus", "Day Cab Rig", "Sleeper Cab Rig"];
  const steamhorseAr = ["Libellule", "Gyrocopter"];
  const autoAr = ["Monoplane", "Biplane"];
  const heavyAr = ["Aerostat", "Megaplane"];

  let group = "";
  if (steamhorse.includes(body)) {
    group = "Ground Steamhorse";
  } else if (auto.includes(body)) {
    group = "Ground Auto";
  } else if (heavy.includes(body)) {
    group = "Ground Heavy";
  } else if (steamhorseAr.includes(body)) {
    group = "Aerial Steamhorse";
  } else if (autoAr.includes(body)) {
    group = "Aerial Auto";
  } else if (heavyAr.includes(body)) {
    group = "Aerial Heavy";
  }

  return `${body} (${group})`;
}

// Roll salvage vehicle parts table.
async function getSalvageParts() {
  const parts = ["Engine", "Transmission", "Suspension", "Chassis"];
  let partsData = "";
  for (let i = 0; i < parts.length; i++) {
    const partData = await getSalvageResults(`Salvage ${parts[i]}`);
    const consume = partData.split("::").map(x => x.trim());
    const row =
    `<tr>
      <td>${parts[i]}</td>
      <td>${consume[0]}</td>
      <td>${consume[1]}</td>
      <td>${await getSalvageResults("Part Integrity")}</td>
    </tr>`;
    partsData += row;
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
async function buildMessageTable() {
  let messageTable =
    `<b><h2>Salvage Vehicle</h2></b>
    <p><b>Vehicle:</b> ${await getSalvageBody()}</p>
    ${await getSalvageParts()}`;
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
