class SpecialFood extends Cell {
  constructor(server, position, size) {
    super(server, null, position, size); // Особливу їжу не має власника, тому передаємо null
    this.type = 4; // Встановлюємо тип їжі як 4 для спеціальної їжі
    this.color = { r: 0xff, g: 0xff, b: 0x33 }; // Жовтий колір для спеціальної їжі
  }

  onEat(playerCell) {
    // Коли клітина їсть особливу їжу, її розмір подвоюється
    playerCell.setSize(playerCell.radius * 2);
  }
}
