// SpecialFoodRenderer.js
class SpecialFoodRenderer {
  constructor(canvasContext) {
    this.ctx = canvasContext;
  }

  draw(specialFood) {
    this.ctx.beginPath();
    this.ctx.arc(
      specialFood.position.x,
      specialFood.position.y,
      specialFood.radius,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = "#33FF33"; // Color for special food
    this.ctx.fill();
    this.ctx.closePath();
  }
}

module.exports = SpecialFoodRenderer;
