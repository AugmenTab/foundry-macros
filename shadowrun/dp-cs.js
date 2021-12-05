async function buildChatMessage(pool) {
  const poolNum = parseInt(pool);
  if (isNaN(poolNum) || poolNum < 1) {
    ui.notifications.error("Please enter a real, positive number.");
  } else {
    ChatMessage.create({
      user: game.user.id,
      speaker: speaker,
      content: await handleRollRender(pool)
    }, {});
  }
}

async function handleRollRender(pool) {
  const roll = await new Roll(`${pool}d6cs>=5`).roll({async: true});
  const data = await roll.render();
  return data;
}

new Dialog({
  title: "Custom Dice Roll",
  content: `
    <form>
      <div class="form-group">
        <label>Dice Pool</label>
        <input type="number" name="pool"/>
      </div>
    </form>
  `,
  buttons: {
    yes: {
      icon: `<i class="fas fa-dice-six"`,
      label: "Roll"
    }
  },
  default: "yes",
  close: html => {
    const pool = html.find("input[name='pool']").val();
    buildChatMessage(pool);
  }
}).render(true);