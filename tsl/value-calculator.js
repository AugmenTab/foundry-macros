new Dialog({
  title: "Vehicle Value Calculator",
  content: `
    <form>
      <h2>Body</h2>
      <div class="form-group">
        <label>Body Style</label>
        <select name="body">
          <!-- <option value="aerostat">Aerostat</option> -->
          <option value="barchetta">Barchetta</option>
          <!-- <option value="biplane">Biplane</option> -->
          <option value="buggy">Buggy</option>
          <option value="bus">Bus</option>
          <option value="coupe">Coupé</option>
          <option value="dayCab">Day Cab Rig</option>
          <option value="doubleDecker">Double-Decker</option>
          <!-- <option value="gyrocopter">Gyrocopter</option> -->
          <!-- <option value="libellule">Libellule</option> -->
          <!-- <option value="megaplane">Megaplane</option> -->
          <!-- <option value="monoplane">Monoplane</option> -->
          <option value="openWheel">Open-Wheel</option>
          <option value="phaeton">Phaeton</option>
          <option value="pickup">Pickup</option>
          <option value="putterPony">Putter Pony</option>
          <option value="quad">Quad</option>
          <option value="roadster">Roadster</option>
          <option value="sedan">Sedan</option>
          <option value="sleeperCab">Sleeper Cab Rig</option>
          <option value="steamhorse">Steamhorse</option>
          <option value="van">Van</option>
          <option value="wagon">Wagon</option>
        </select>
      </div>
      <div class="form-group">
        <label>Hit Points Percent</label>
        <input type="number" name="hp"/>
      </div>

      <h2>Engine</h2>
      <div class="form-group">
        <label>Engine Type</label>
        <select name="engineType">
          <option value="steam">Steam</option>
          <option value="guzzoline">Guzzoline</option>
          <option value="deezul">Deezul</option>
          <option value="arcanomotor">Arcanomotor</option>
          <option value="crystal">Crystal</option>
          <option value="elemental">Elemental</option>
          <option value="tourbillon">Tourbillon</option>
        </select>
      </div>
      <div class="form-group">
        <label>Engine Horsepower</label>
        <input type="number" name="ho"/>
      </div>
      <div class="form-group">
        <label>Engine Integrity</label>
        <input type="number" name="engineInteg"/>
      </div>

      <h2>Transmission</h2>
      <div class="form-group">
        <label>Transmission Type</label>
        <select name="transmissionType">
          <option value="steam">Manual</option>
          <option value="sequential">Sequential</option>
          <option value="horlogian">Horlogian</option>
          <option value="spectrum">Spectrum</option>
          <option value="torqueConverter">Torque Converter</option>
        </select>
      </div>
      <div class="form-group">
        <label>Transmission Power Transfer</label>
        <input type="number" name="po"/>
      </div>
      <div class="form-group">
        <label>Transmission Fluid</label>
        <input type="number" name="fluid"/>
      </div>
      <div class="form-group">
        <label>Transmission Integrity</label>
        <input type="number" name="transmissionInteg"/>
      </div>

      <h2>Suspension</h2>
      <div class="form-group">
        <label>Suspension Type</label>
        <select name="suspensionType">
          <option value="mechanical">Mechanical</option>
          <option value="hydraulic">Hydraulic</option>
          <option value="pneumatic">Pneumatic</option>
          <option value="esoteric">Esoteric</option>
        </select>
      </div>
      <div class="form-group">
        <label>Suspension Dependency</label>
        <select name="suspensionDependency">
          <option value="dependent">Dependent</option>
          <option value="Mixed"></option>
          <option value="independent">Fully Independent</option>
        </select>
      </div>
      <div class="form-group">
        <label>Suspension Reactivity</label>
        <input type="number" name="re"/>
      </div>
      <div class="form-group">
        <label>Suspension Integrity</label>
        <input type="number" name="suspensionInteg"/>
      </div>

      <h2>Chassis</h2>
      <div class="form-group">
        <label>Chassis Type</label>
        <select name="chassisType">
          <option value="wheels">Wheels</option>
          <option value="rail">Rail</option>
          <option value="pedrail">Pedrail</option>
          <option value="tracks">Tracks</option>
          <option value="screw">Screw</option>
        </select>
      </div>
      <div class="form-group">
        <label>Chassis Drive</label>
        <select name="chassisDrive">
          <option value="fwd">FWD</option>
          <option value="rwd">RWD</option>
          <option value="awd">AWD</option>
        </select>
      </div>
      <div class="form-group">
        <label>Chassis Brakes</label>
        <input type="number" name="br"/>
      </div>
      <div class="form-group">
        <label>Chassis Integrity</label>
        <input type="number" name="chassisInteg"/>
      </div>
    </form>
  `,
  buttons: {
    yes: {
      icon: '<i class="fas fa-check"></i>',
      label: "Calculate"
    }
  },
  default: "yes",
  close: html => {}
}).render(true);