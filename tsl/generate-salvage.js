// Roll salvage vehicle results.
async function getSalvageResults(rollTable) {
  const table  = game.tables.contents.find(t => t.name === rollTable);
  const options = { roll: table.data.formula, displayChat: false, async: true };
  const drawResult = await table.draw(options);
  return drawResult.results[0].data.text;
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
  const classification = "Salvage Vehicle Classification";
  let messageTable =
    `<b><h2>Salvage Vehicle</h2></b>
    <p><b>Vehicle:</b> ${await getSalvageResults(classification)}</p>
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
