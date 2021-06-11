// Roll Wild Surge
async function getWildSurge() {
  const result = game.tables.contents.find(t => t.name === "Wild Surges").draw();
};

await getWildSurge();