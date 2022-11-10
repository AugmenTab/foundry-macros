function getDataFromHtml(html) {
  const blast = parseInt(html.find("input[name='blast']").val());
  const kill = parseInt(html.find("input[name='kill']").val());

  if (isNaN(blast) && isNaN(kill)) return "invalid";

  let options = {};
  if (!isNaN(blast) && blast > 0) {
    options.blast = { "val": blast, "color": "#ff0000" };
  }
  if (!isNaN(kill) && kill > 0) {
    options.kill = { "val": kill,  "color": "#510400" };
  }
  return options;
}

function getDialogContent(date) {
  return `
    <form>
      <div class="form-group">
        <label>Blast Radius</label>
        <input type="number" name="blast" value="0"/>
      </div>
      <div class="form-group">
        <label>Kill Radius</label>
        <input type="number" name="kill" value="0"/>
      </div>
    </form>
  `;
}

function makeError(msg) {
  ui.notifications.error(msg);
}

function makeMeasureTemplateData({ x, y }, color, num) {
  return {
    t: "circle",
    x,
    y,
    distance: num,
    fillColor: color
  };
}

function makePosition(xPos, yPos) {
  const halfSq = Math.round(game.scenes.current.dimensions.size / 2);
  return {
    x: xPos + halfSq,
    y: yPos + halfSq
  };
}

async function createDialog() {
  new Dialog({
    title: "Post Blast/Kill Template",
    content: getDialogContent(),
    buttons: {
      yes: {
        icon: "<i class='fas fa-bomb'></i>",
        label: "Blast!",
        callback: async html => {
          const options = getDataFromHtml(html);
          if (options === "invalid") {
            return makeError("Some of the inputs provided are invalid.");
          }

          const boom = game.scenes.current.tokens.find(x => x.name === 'Boom');
          if (boom === undefined) {
            return makeError("The Boom Token has to be on the Scene!");
          }

          const pos = makePosition(boom.x, boom.y);
          let templates = [];
          Object.values(options).forEach(data =>
            templates.push(makeMeasureTemplateData(pos, data.color, data.val))
          );
          canvas.scene.createEmbeddedDocuments("MeasuredTemplate", templates);
        }
      },
    },
    close: () => {}
  }).render(true);
}

await createDialog();
