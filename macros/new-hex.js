// Roll Esoterics Effects
async function rollEsoterics() {
  const table = await game.tables.contents.find(t => t.name === "Esoterics Effects");
  const roll = await new Roll(table.data.formula).roll({async: true});
  if (roll._total == 100) {
    await table.drawMany(2);
  } else {
    newRoll = await new Roll(`1d99`).roll({async: true});
    await table.draw({roll: newRoll});
  };
};
  
// Roll Weather & Terrain Effects
async function rollWeatherAndTerrain() {
  const weatherTable = await game.tables.contents.find(t => t.name === "Weather Events");
  const terrainTable = await game.tables.contents.find(t => t.name === "Terrain Events");
  const weatherRoll = await new Roll(weatherTable.data.formula).roll({async: true})
  const terrainRoll = await new Roll(terrainTable.data.formula).roll({async: true})
  /* If weather result = flaywind storm & terrain result & black sand:
    await terrainTable.draw({roll:terrainRoll})
    await weatherTable.draw({roll:(the die result for the necrotic flaywind)})
  else: */
  await terrainTable.draw({roll:terrainRoll});
  await weatherTable.draw({roll:weatherRoll});
};

// Roll Encounter Event
// todo

// Function Calls
await rollEsoterics();
await rollWeatherAndTerrain();
