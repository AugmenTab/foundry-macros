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
  const table = game.tables.contents.find(t => t.name === "Weather Events");
  const draw = await table.draw({ displayChat: false, async: true });
  const result = draw.results[0].text;
  // console.log(draw.results[0]);
  return result;
  // if (terrain.includes("Black Sand") && result.includes("Flaywind Storm")) {
  //   return "@JournalEntry[e8x3hdXbx8NG8AJ7]{Necrotic Flaywind}";
  // } else {
  //   return result;
  // }
};

// Roll terrain event.
async function getTerrainResults() {
  const table = game.tables.contents.find(t => t.name === "Terrain Events");
  const draw = await table.draw({ displayChat: false, async: true });
  const result = draw.results[0].text;
  if (result) {
    return result;
  } else {
    const title = draw.results[0].data.text;
    const journal = game.journal.contents.find(j => j.name === title);
    console.log(journal);
    return `@JournalEntry[${journal.id}]{${journal.name}}`;
  }
};

// Roll encounter event.
async function getEncounterEvent() {
  return "TODO";
};

// Construct HTML message table for chat message.
const esoterics = await getEsotericsResults();
const terrain = await getTerrainResults();
const weather = await getWeatherResults(terrain);
const encounter = "TODO"; //await getEncounterEvent();
async function buildMessageTable() {
  const messageTable = `
    <b><h2>New Day or Hex</h2></b>
    <p><b>Esoterics Effects:</b> ${esoterics}</p>
    <hr><p><b>Terrain Event:</b> ${terrain}</p>
    <hr><p><b>Weather Event:</b> ${weather}</p>
    <hr><p><b>Encounter:</b> ${encounter}</p>`;
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
