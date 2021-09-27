// Calculate a Range for the Mimic Gun.
async function getRange() {
  const roll = await new Roll("d20").roll({ async: true });
  const text =
  `<i class="cci cci-range i--m i--dark"></i> ${roll.total}` +
  `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;::&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
  `${Math.ceil(roll.total / 2) + 1} ` +
  `<i class="cci cci-kinetic i--m damage--kinetic"></i>`;
  return text;
}

// Construct HTML message table for chat message.
async function buildMessageTable() {
  const messageTable =  
    "<b><h2>Mimic Gun Ranges</h2></b>" + 
    "<p><b>Range 1: </b>" + await getRange() +
    "<hr><p><b>Range 2: </b>" + await getRange() +
    "<hr><p><b>Range 3: </b>" + await getRange()
  return messageTable;
}

// Construct the chat message.
async function buildChatData() {
  return {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: await buildMessageTable()
  };
}

ChatMessage.create(await buildChatData(), {});
