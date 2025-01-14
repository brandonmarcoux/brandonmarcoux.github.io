let funkyFont;
let x;
let speed = 2;
let movingRight = true;

const width = 1650;
  const height = 1650;

// Complex number class
class Complex {
  constructor(real, imag) {
    this.real = real;
    this.imag = imag;
  }

  product(other) {
    const real = this.real * other.real - this.imag * other.imag;
    const imag = this.real * other.imag + this.imag * other.real;
    return new Complex(real, imag);
  }

  numMul(factor) {
    this.real *= factor;
    this.imag *= factor;
    return this;
  }

  divide(other) {
    const denom = other.real ** 2 + other.imag ** 2;
    const real = (this.real * other.real + this.imag * other.imag) / denom;
    const imag = (this.imag * other.real - this.real * other.imag) / denom;
    return new Complex(real, imag);
  }

  closeTo(other, epsilon = 0.001) {
    return (
      Math.abs(this.real - other.real) < epsilon &&
      Math.abs(this.imag - other.imag) < epsilon
    );
  }
}

// Newton's method function
function N(z) {
  const z2 = z.product(z);
  const z3 = z.product(z2);
  z3.numMul(2.0);
  z2.numMul(3.0);
  z2.real -= 1;
  return z3.divide(z2);
}

// Roots of the equation f(z) = z^3 - z
const root1 = new Complex(0, 0); // blue
const root2 = new Complex(1, 0); // green
const root3 = new Complex(-1, 0); // red

// Drawing constants
const factorX = 0;
const factorY = 0;
const startX = -2;
const endX = 2;
const startY = -2;
const endY = 2;
const maxIterations = 50;

function drawPlane() {
  loadPixels();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const a = map(i, 0 + factorX, width + factorX, startX + factorX, endX + factorX);
      const b = map(j, 0 + factorY, height + factorY, startY + factorY, endY + factorY);
      let c2 = new Complex(a, b);
      let n = 0;
      let x = false,
        y = false,
        z = false;

      for (; n < maxIterations; n++) {
        c2 = N(c2);
        if (c2.closeTo(root1)) {
          x = true;
          break;
        }
        if (c2.closeTo(root2)) {
          y = true;
          break;
        }
        if (c2.closeTo(root3)) {
          z = true;
          break;
        }
      }

      let val = 0;
      if (x)
        val =
          map(n, 0, maxIterations, 227, 213) * (maxIterations - n) / maxIterations; // blue
      else if (y) val = map(n, 0, maxIterations, 100, 138); // green
      else if (z)
        val = map(n, 0, maxIterations, 255, 300) * n / maxIterations; // red

      const index = (i + j * width) * 4;
      pixels[index] = val; // R
      pixels[index + 1] = 92; // G
      pixels[index + 2] = 88; // B
      pixels[index + 3] = 255; // A
    }
  }
  updatePixels();
}

function setup() {
  createCanvas(width, height);
  funkyFont = loadFont("PortagoITCTT-48.vlw");
  textFont(funkyFont);
  textAlign(CENTER, CENTER);
  x = width / 2;

  colorMode(HSB, 360, 100, 100);
  pixelDensity(1);
  textSize(32);

  drawPlane();
}

function draw() {
  clear();

  drawPlane();
  fill(128, 0, 128);
  text("Hi Mariana!", x, height / 2);

  // Move the text
  if (movingRight) {
    x += speed; // Move to the right
    if (x > width - 50) movingRight = false; // Reverse direction if hitting the right edge
  } else {
    x -= speed; // Move to the left
    if (x < 50) movingRight = true; // Reverse direction if hitting the left edge
  }
}
