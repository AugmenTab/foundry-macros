// Roll Random Attack Targets
const table = await game.tables.contents.find(t => t.name === "Random Target");
const tableSize = table.results.size

async function getRandomTargets(n) {
  await table.drawMany(n);
  table.reset();
};

new Dialog({
  title:'Random Targets',
  content:`
    <form>
      <div class="form-group">
        <label>Select Targets (Max ${tableSize}):</label>
        <input type='number' name='inputField'></input>
      </div>
    </form>`,
  buttons:{
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Attack`
    }},
  default:'yes',
  close: html => {
    let result = html.find('input[name=\'inputField\']').val();
    if (result !== '' && tableSize >= result) {
        getRandomTargets(result);
    } else {
        ui.notifications.error("Invalid input. Please enter a number between 1 and " + tableSize + ".");
    }
  }
}).render(true);
