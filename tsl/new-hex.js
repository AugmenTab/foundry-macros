// Roll esoterics effects.
async function getEsotericsResults() {
  const table = game.tables.contents.find(t => t.name === "Esoterics Effects");
  const roll = await new Roll(table.data.formula).roll({async: true});
  let text = "";
  if (roll.total === 100) {
    const options = {roll: table.data.formula, displayChat: false, async: true};
    const new1 = await table.draw(options);
    const new2 = await table.draw(options);
    text = `${new1.results[0].data.text} & ${new2.results[0].data.text}`;
  } else {
    const [rollResult] = await table.getResultsForRoll(roll.total);
    text = rollResult.data.text;
  }
  table.reset();
  return text;
};

// Roll weather event.
async function getWeatherResults(terrain) {
  return "test";
};

// Roll terrain event.
async function getTerrainResults() {
  return "test";
};

// Roll encounter event.
async function getEncounterEvent() {
  return "test";
};

// Construct HTML message table for chat message.
async function buildMessageTable() {
  const messageTable =  
    "<b><h2>New Day or Hex</h2></b>" + 
    "<p><b>Esoterics Effects: </b>" + await getEsotericsResults() +
    "<hr><p><b>Terrain Event: </b>" + await getTerrainResults() +
    "<hr><p><b>Weather Event: </b>" + await getWeatherResults() +
    "<hr><p><b>Encounter: </b>" + await getEncounterEvent();
  return messageTable;
};

// Construct the chat message.
async function buildChatData() {
  return {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: await buildMessageTable(),
    whisper: game.users.contents.filter(u => u.isGM).map(u => u.id)  
  };
};

ChatMessage.create(await buildChatData(), {});
