// Roll Wild Surge
async function getWildSurge() {
  const table = game.tables.contents.find(t => t.name === "Wild Surges");
  const draw = await table.draw({ displayChat: false, async: true });
  console.log(draw);
  ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: `<h2>Wild Surge</h2><p>${await draw.results[0].data.text}</p>`,
    whisper: game.users.contents.filter(u => u.isGM).map(u => u.id)
  }, {});
};

await getWildSurge();
