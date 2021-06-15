// Roll esoterics effects.
async function getEsotericsResults() {
  return "test";
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
    "<hr><p><b>Terrain Event: </b>" + await getWeatherResults() +
    "<hr><p><b>Weather Event: </b>" + await getTerrainResults() +
    "<hr><p><b>Encounter: </b>" + await getEncounterEvent();
  return messageTable;
};

// Construct the chat message.
async function buildChatData() {
  return {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: await buildMessageTable(),
    whisper: game.users.entities.filter(u => u.isGM).map(u => u._id)  
  };
};

ChatMessage.create(await buildChatData(), {});
