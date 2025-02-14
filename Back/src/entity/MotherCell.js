const Cell = require("./Cell");
const Food = require("./Food");
const Virus = require("./Virus");
const Vec2 = require("../modules/Vec2.js");
const SpecialFood = require("./SpecialFood.js");

class MotherCell extends Virus {
  constructor(server, owner, position, size) {
    super(server, owner, position, size);
    this.onEat = Cell.prototype.onEat;

    this.type = 2;
    this.isVirus = true;
    this.isMotherCell = true;
    this.color = {
      r: 0xce,
      g: 0x63,
      b: 0x63,
    };

    this.motherCellMinSize = 149;
    this.motherCellSpawnAmount = 2;

    if (!this.radius) {
      this.setSize(this.motherCellMinSize);
    }
  }

  // Перевизначення методу onEat для материнської клітини
  onEat(cell) {
    if (cell.type === 4) {
      // Спеціальна їжа
      this.setSize(this.radius * 2); // Подвоїмо розмір материнської клітини
    } else {
      super.onEat(cell); // Викликаємо стандартну логіку для інших клітин
    }
  }

  canEat(cell) {
    const maxMass = this.server.config.motherCellMaxMass;
    if (maxMass && this._mass >= maxMass) return false;
    return (
      cell.type == 0 || // can eat player cell
      cell.type == 2 || // can eat virus
      cell.type == 3 || // can eat ejected mass
      cell.type == 4
    ); // спеціальна їжа (новий тип)
  }
  onUpdate() {
    if (this.radius == this.motherCellMinSize) return;

    let size1 = this.radius;
    let size2 = this.server.config.foodMinSize;
    for (let i = 0; i < this.motherCellSpawnAmount; i++) {
      size1 = Math.sqrt(size1 * size1 - size2 * size2 * 2);
      size1 = Math.max(size1, this.motherCellMinSize);
      this.setSize(size1);

      const angle = Math.random() * 2 * Math.PI;
      const pos = this.position.sum(Vec2.fromAngle(angle).multiply(size1));
      // Spawn food

      // Ймовірність створення спеціальної їжі 10%
      let food;
      if (Math.random() < 0.1) {
        food = new SpecialFood(this.server, null, pos, size2); // Створюємо спец. їжу
      } else {
        food = new Food(this.server, null, pos, size2); // Звичайна їжа
      }

      //   const food = new Food(this.server, null, pos, size2);
      food.color = this.server.getRandomColor();
      food.overrideReuse = true;
      this.server.addNode(food);

      // Eject to random distance
      food.setBoost(32 + 42 * Math.random(), angle);
    }
    this.server.updateNodeQuad(this);
  }
}

module.exports = MotherCell;
