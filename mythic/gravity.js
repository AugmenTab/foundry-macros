function calculateCharacteristicModifier(score) {
  return score < 0 ? 0 : Math.floor(score / 10);
}

function calculateWeaponRangeThrown(result) {
  const base = calculateCharacteristicModifier(result.str) + result.mythicStr;
  const penalty = calculateWeightPenaltyThrown(base);
  const range = base * (
    15 - Math.floor(result.weight / penalty.weight) * penalty.multiplier
  );
  return range > 0.5 ? range : 0;
}

function calculateWeightPenaltyThrown(mod) {
  let penalty = { weight: 1, multiplier: 1 };
  if (mod >= 19) penalty.weight = 7;
  else if (mod >= 13) penalty.weight = 6;
  else if (mod >= 10) penalty.weight = 5;
  else if (mod >= 8) penalty.weight = 2;
  else if (mod >= 3) penalty.multiplier = 2;
  else penalty.multiplier = 3;
  return penalty;
}

new Dialog({
  title:'Gravity Hammer Distance',
  content:`
    <form>
      <div class="form-group">
        <label>Strength:</label>
        <input type='number' name='str'></input>
      </div>
      <div class="form-group">
        <label>Mythic Strength:</label>
        <input type='number' name='mythicStr'></input>
      </div>
      <div class="form-group">
        <label>Degrees of Success:</label>
        <input type='number' name='dos'></input>
      </div>
      <div class="form-group">
        <label>Object Weight (kgs):</label>
        <input type='number' name='weight'></input>
      </div>
    </form>`,
  buttons:{
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Get Distance`
    }},
  default:'yes',
  close: html => {
    const result = {
      str: parseFloat(html.find('input[name=\'str\']').val()),
      mythicStr: parseFloat(html.find('input[name=\'mythicStr\']').val()),
      dos: parseFloat(html.find('input[name=\'dos\']').val()),
      weight: parseFloat(html.find('input[name=\'weight\']').val())
    }
    const distance = calculateWeaponRangeThrown(result) + result.dos;
    const msgContent = 
    `
    <p><b>Distance:</b> ${distance} meters</p>
    <p><b>Speed:</b> ${(Math.floor(distance) / 6).toLocaleString()} meters per round</p>
    `;
    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(),
      content: msgContent
    });
  }
}).render(true);
