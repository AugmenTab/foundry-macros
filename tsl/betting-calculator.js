function buildChatMessage(data) {
  return `
    <h2>Potential Bet Winnings</h2>
    <p>The bet was <b>${pathfinderMoney(data.bet)}</b>.</p>
    <p>The odds for this bet were <b>${data.odds[0]} against ${data.odds[1]}</b>.</p>
    <br>
    <h3><b>Potential Payout:</b> ${pathfinderMoney(data.bet + data.winnings)}</h3>
  `;
}

function getDataFromHtml(html) {
  const bet  = parseFloat(html.find("input[name='bet']").val());
  const odds = html.find("input[name='odds']").val().split("/");
  const winnings = bet * (parseFloat(odds[0]) / parseFloat(odds[1]));
  return { bet: bet, odds: odds, winnings: winnings };
}

function getDialogContent() {
  return `
    <form>
      <div class="form-group">
        <label>What are the odds?</label>
        <input type="text" name="odds" value="0" />
      </div>
      <div class="form-group">
        <label>How much are you betting?</label>
        <input type="number" name="bet" value="0" />
      </div>
    </form>
  `;
}

function pathfinderMoney(num) {
  if (num === 0 || isNaN(num)) return "0 gp";

  const gold   = Math.floor(num);
  const silver = Math.floor((num - gold) * 10);
  const copper = Math.floor((((num - gold) * 10) - silver) * 10);
  return `${gold} gp ${silver} sp ${copper} cp`;
}

new Dialog({
  title: "Betting Calculator",
  content: getDialogContent(),
  buttons: {
    yes: {
      icon: '<i class="fas fa-dice"></i>',
      label: "Get Winnings"
    }
  },
  default: "yes",
  close: html => {
    const data = getDataFromHtml(html);
    if (isNaN(data.winnings)) {
      ui.notifications.error("Some of the inputs provided are invalid.");
    } else {
      const speaker = ChatMessage.getSpeaker();
      ChatMessage.create({
        user: game.user.id,
        speaker: speaker,
        content: buildChatMessage(data)
      }, {});
    }
  }
}).render(true);