import { lerp, distance } from './helpers';
export class Node {
  constructor(x, y, radius = 3) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.radius = radius;
    this.vx = 0;
    this.vy = 0;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.glow = 0;
    this.friction = 0.85; // Physics upgrade
    this.mass = 1; // Physics upgrade
  }
  update(mouseX, mouseY, influenceRadius = 100) {
    const dist = distance(this.x, this.y, mouseX, mouseY);
    // Interaction Physics
    if (dist < influenceRadius) {
      const force = (influenceRadius - dist) / influenceRadius;
      const angle = Math.atan2(this.y - mouseY, this.x - mouseX);
      const forceX = Math.cos(angle) * force * 2;
      const forceY = Math.sin(angle) * force * 2;
      this.vx += forceX / this.mass; // Mass affects movement
      this.vy += forceY / this.mass;
      this.glow = lerp(this.glow, 1, 0.1);
    } else {
      this.glow = lerp(this.glow, 0, 0.05);
    }
    // Return to base (Spring Physics)
    this.vx += (this.baseX - this.x) * 0.02;
    this.vy += (this.baseY - this.y) * 0.02;
    // Apply Friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
    this.pulsePhase += 0.05;
  }
  draw(ctx) {
    const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    const r = Math.max(1, this.radius * pulse);
    if (this.glow > 0.1) {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 4);
      gradient.addColorStop(0, `rgba(0, 240, 255, ${this.glow * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = `rgba(0, 240, 255, ${0.5 + this.glow * 0.5})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}