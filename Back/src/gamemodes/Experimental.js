const FFA = require("./FFA"); // Base gamemode
const Entity = require("../entity");

// class Experimental extends FFA {
//     constructor() {
//         super();
//         this.ID = 2;
//         this.name = "Experimental";
//         this.specByLeaderboard = true;
//         // Gamemode Specific Variables
//         this.nodesMother = [];
//         // Config
//         this.motherAmount = 10;
//     }
//     // Gamemode Specific Functions
//     spawnMotherCells(server) {
//         var mother = new Entity.MotherCell(server, null, server.randomPos(), 149);
//         let diff = this.motherAmount - this.nodesMother.length;
//         while (--diff >= 0) server.safeSpawn(mother);
//     }
//     spawnCells(server) {
//         this.spawnMotherCells(server);
//     }
//     // Override
//     onServerInit(server) {
//         // Called when the server starts
//         server.run = true;
//         // Ovveride functions for special virus mechanics
//         var self = this;
//         Entity.Virus.prototype.onEat = function (prey) {
//             // Pushes the virus
//             this.setBoost(220, prey.boostDirection.angle());
//         };
//         Entity.MotherCell.prototype.onAdd = function () {
//             self.nodesMother.push(this);
//         };
//         Entity.MotherCell.prototype.onRemove = function () {
//             self.nodesMother.removeUnsorted(this);
//             self.spawnMotherCells(server);
//         };
//         self.spawnCells(server);
//     }
//     onTick(server) {
//         var updateInterval;
//         for (const motherCell of this.nodesMother) {
//             if (motherCell.radius <= motherCell.motherCellMinSize)
//                 updateInterval = Math.random() * (50 - 25) + 25;
//             else updateInterval = 2;
//             if ((server.ticks % ~~updateInterval) === 0)
//                 motherCell.onUpdate();
//         }
//     }
// }

// module.exports = Experimental;

const SpecialFood = require("./SpecialFood"); // New special food class

class Experimental extends FFA {
  constructor() {
    super();
    this.ID = 2;
    this.name = "Experimental";
    this.specByLeaderboard = true;
    this.nodesMother = [];
    // Config
    this.motherAmount = 10;
    this.specialFoodPercentage = 0.02; // 2% of total food
  }

  spawnSpecialFood(server) {
    // Calculate the total amount of food
    const totalFoodAmount = server.nodesFood.length;

    // Calculate the amount of special food to spawn based on 1-3% of total food
    const specialFoodCount = Math.floor(
      totalFoodAmount * (this.specialFoodPercentage + Math.random() * 0.01)
    ); // Random between 1-3%

    // Spawn special food at random positions
    for (let i = 0; i < specialFoodCount; i++) {
      const randomPos = server.randomPos();
      const size = Math.random() * 10 + 10; // Random size between 10 and 20
      const specialFood = new SpecialFood(server, null, randomPos, size);
      server.safeSpawn(specialFood); // Spawn the special food
    }
  }

  spawnMotherCells(server) {
    var mother = new Entity.MotherCell(server, null, server.randomPos(), 149);
    let diff = this.motherAmount - this.nodesMother.length;
    while (--diff >= 0) server.safeSpawn(mother);
  }

  spawnCells(server) {
    this.spawnMotherCells(server);
    this.spawnSpecialFood(server); // Spawn special food as well
  }

  onServerInit(server) {
    server.run = true;
    var self = this;

    Entity.Virus.prototype.onEat = function (prey) {
      this.setBoost(220, prey.boostDirection.angle());
    };

    Entity.MotherCell.prototype.onAdd = function () {
      self.nodesMother.push(this);
    };

    Entity.MotherCell.prototype.onRemove = function () {
      self.nodesMother.removeUnsorted(this);
      self.spawnMotherCells(server);
    };

    self.spawnCells(server);
  }

  onTick(server) {
    var updateInterval;
    for (const motherCell of this.nodesMother) {
      if (motherCell.radius <= motherCell.motherCellMinSize)
        updateInterval = Math.random() * (50 - 25) + 25;
      else updateInterval = 2;

      if (server.ticks % ~~updateInterval === 0) motherCell.onUpdate();
    }

    // Spawn special food periodically
    if (server.ticks % 500 === 0) {
      // Every 500 ticks
      this.spawnSpecialFood(server);
    }
  }
}

module.exports = Experimental;
