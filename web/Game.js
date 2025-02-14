// Game.js

const SpecialFoodRenderer = require("./assets/js/SpecialFoodRenderer.js");

class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.specialFoodRenderer = new SpecialFoodRenderer(this.ctx);
    this.specialFoods = []; // Масив для зберігання всіх спеціальних їж

    this.cells = []; // Тут будуть клітини гравців

    this.gameLoop();
  }

  // Функція для створення спеціальної їжі
  spawnSpecialFood(specialFood) {
    this.specialFoods.push(specialFood); // Додаємо нову їжу на мапу
  }

  // Основна ігрова петля
  gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Очищаємо канвас

    // Рендеримо всі клітини
    for (const cell of this.cells) {
      this.drawCell(cell); // Функція для малювання клітини
    }

    // Перевіряємо колізії клітин зі спеціальною їжею
    for (const cell of this.cells) {
      for (const specialFood of this.specialFoods) {
        this.checkCollision(cell, specialFood);
      }
    }

    // Рендеримо спеціальну їжу
    for (const specialFood of this.specialFoods) {
      this.specialFoodRenderer.draw(specialFood);
    }

    requestAnimationFrame(() => this.gameLoop()); // Запускаємо наступний кадр
  }

  // Функція для малювання клітини
  drawCell(cell) {
    this.ctx.beginPath();
    this.ctx.arc(cell.position.x, cell.position.y, cell.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = cell.color; // Колір клітини
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Перевіряємо колізії клітини з їжею
  checkCollision(cell, specialFood) {
    const dx = cell.position.x - specialFood.position.x;
    const dy = cell.position.y - specialFood.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < cell.radius + specialFood.radius) {
      // Колізія відбулася — їжа з'їдена
      this.onEatSpecialFood(cell);
      specialFood.onRemove(); // Видалити спеціальну їжу з карти
    }
  }

  // Логіка при поїданні спеціальної їжі
  onEatSpecialFood(cell) {
    cell.setSize(cell.radius * 2); // Подвоїти розмір клітини
    this.showGrowthMessage(cell); // Показати повідомлення про збільшення розміру
  }

  // Функція для показу повідомлення
  showGrowthMessage(cell) {
    const message = document.createElement("div");
    message.className = "growth-message";
    message.innerText = "Your size has doubled!";
    message.style.position = "absolute";
    message.style.left = `${cell.position.x}px`;
    message.style.top = `${cell.position.y}px`;
    document.body.appendChild(message);

    setTimeout(() => {
      message.remove(); // Видалити повідомлення через 2 секунди
    }, 2000);
  }
}

module.exports = Game;
