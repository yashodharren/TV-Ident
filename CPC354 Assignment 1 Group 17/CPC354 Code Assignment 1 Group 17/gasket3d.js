// webgl properties
let gl;
let canvas;
let canvasSizeLoc;

// shader properties
let points;
// Initialize colors with default values
let colors;
let baseColors = [];

// triangle vertices values
const TriangleVertices = [
  vec3(0.0, 0.0, -1.0),
  vec3(0.0, 0.9428, 0.3333),
  vec3(-0.8165, -0.4714, 0.3333),
  vec3(0.8165, -0.4714, 0.3333),
];
let vertices = TriangleVertices;
const shapeRatio = 1.9; // the lower the value, the bigger the shape

// mutable properties
let theta;
let thetaLoc;
let thislocation;
let locationLoc;
let NumTimesToSubdivide;
let direction = document.getElementById("direction").getAttribute("data-direction");

// animation internal properties
const animationsList = [
  "rotateright",
  "rotateleft",
  "rotatereset",
  "scaleup",
  "scaledown",
  "upright",
  "downleft",
  "center",
  "upleft",
  "downright",
  "center",
];
let animationIndex = 0;
let startTime;

// animation control
let isAnimating = false;
let isPaused = false;

// shader properties ratio
const speedRatio = 0.2;
const scaleRatio = 1.5;
const animationRatio = 0.3;

// main function related

function setupMain() {
  if (!setup()) {
    showError("setup failed");
    return false;
  }
  onMount();
  return true;
}

function setupSubdivisionInput(subdivisionInput) {
  subdivisionInput.addEventListener("input", () => reset(subdivisionInput));
  subdivisionInput.addEventListener("dblclick", () => reset(subdivisionInput));
}

function setupShapesButtons(shapesButtons, subdivisionInput) {
  shapesButtons.forEach((button) => {
    button.addEventListener("click", () => {
      vertices = shapesVertices[button.getAttribute("data-shape")];
      reset(subdivisionInput);
    });
  });
}

function setupColorInputs(colorInputs, subdivisionInput) {
  colorInputs.forEach((input, index) => {
    const hexValue = rgbToHex(baseColors[index].map((color) => color * 255));
    input.value = hexValue;
    input.addEventListener("change", () => {
      const colorValue = hexToRgb(input.value);
      baseColors[index] = vec3(colorValue.r, colorValue.g, colorValue.b);
      reset(subdivisionInput);
    });
  });
}

function onMount() {
  theta = 0.0;
  NumTimesToSubdivide = document.getElementById("subdivision").value;
  points = [];
  colors = [];
  if (baseColors.length === 0) {
    baseColors = [
      vec3(1.0, 0.0, 0.0), // Default color for the first triangle
      vec3(0.0, 1.0, 0.0), // Default color for the second triangle
      vec3(0.0, 0.0, 1.0), // Default color for the third triangle
      vec3(0.0, 0.0, 0.0), // Default color for the fourth triangle
    ];
  }
}

function reset(subdivisionInput) {
  subdivisionInput.setAttribute("data-subdivision", NumTimesToSubdivide);
  // Redivide the tetrahedron with the new subdivision value
  onMount();
  if (NumTimesToSubdivide > 0)
    divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);
  configureShaders();
}

function Main() {
  const isSetupSuccessful = setupMain();
  if (!isSetupSuccessful) {
    return;
  }

  onMount();
  divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);

  const subdivisionInput = document.getElementById("subdivision");
  setupSubdivisionInput(subdivisionInput);

  const shapesButtons = document.querySelectorAll('.panel[data-panel="shapes"] button');
  setupShapesButtons(shapesButtons, subdivisionInput);

  const colorInputs = Array.from(
    document.querySelectorAll('.panel[data-panel="colors"] input')
  ).slice(1);
  setupColorInputs(colorInputs, subdivisionInput);

  configureShaders();
  render();
}

// render functions related

function updateSpeed() {
  if (isAnimating) return;
  const speedInput = document.getElementById("speed");
  const speed = (speedInput.value / 100) * speedRatio;
  if (!isPaused) theta += direction ? speed : -speed;
  speedInput.setAttribute("theta", theta);
}

function updateSize() {
  const sizeInput = document.getElementById("size");
  const size = (sizeInput.value / 100) * scaleRatio;
  scale = size;
}

function updateLocation() {
  const sliderX = document.getElementById("location-x").value;
  const sliderY = document.getElementById("location-y").value;
  thislocation = {
    x: (sliderX / 100) * (canvas.width * 2) - canvas.width,
    y: (sliderY / 100) * (canvas.height * 2) - canvas.height,
  };
}

function updateUniforms() {
  if (!isPaused) {
    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(scaleLoc, scale);
    gl.uniform2f(locationLoc, thislocation.x, thislocation.y);
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (isAnimating) {
    startAnimating();
  } else {
    updateSpeed();
    updateSize();
    updateLocation();
  }

  gl.uniform2f(canvasSizeLoc, canvas.width, canvas.height);
  updateUniforms();

  gl.drawArrays(gl.TRIANGLES, 0, points.length);
  requestAnimFrame(render);
}

function startAnimating() {
  // reset the location before starting new animation
  if (animationIndex === 0) {
    thislocation = {
      x: 0.0,
      y: 0.0,
    };
    scale = 0.25 * scaleRatio; // the original scale from slider value
  }

  // Check if animation should be played
  if (startTime === undefined) {
    // Set start time if not already set
    theta = 0.0;
    startTime = performance.now();
    animationIndex = 0; // Reset animation index
    return 0;
  }

  // sleep for 0.3 seconds
  if (performance.now() - startTime < 300) {
    return 0;
  }

  // Check if it's time to start the next animation
  if (animationIndex < animationsList.length) {
    animate(animationsList[animationIndex]);
  } else {
    // All animations are done
    startTime = undefined;
    theta = 0;
  }
}

function animate(animation) {
  if (isPaused) return;
  const animationSpeedFactor = document.getElementById("animationspeed").value / 400;
  const movingSpeedFactor = animationSpeedFactor * 100;

  switch (animation) {
    case "rotateright":
    case "rotateleft":
    case "rotatereset":
      animate_rotate(animation, animationSpeedFactor);
      break;
    case "scaleup":
    case "scaledown":
      animate_scale(animation, animationSpeedFactor);
      break;
    case "upright":
    case "downleft":
    case "upleft":
    case "downright":
    case "center":
      animate_location(animation, movingSpeedFactor);
      break;
    default:
      // Handle unknown animation type
      break;
  }

  function animate_rotate(animation, valueFactor) {
    if (animation === "rotateright") {
      if (theta >= Math.PI) {
        animationIndex++;
      } else {
        theta += valueFactor;
      }
    } else if (animation === "rotateleft") {
      if (theta >= -Math.PI) {
        theta -= valueFactor;
      } else {
        animationIndex++;
      }
    } else if (animation === "rotatereset") {
      if (theta < 0) {
        theta += valueFactor;
      } else {
        theta = 0;
        animationIndex++;
      }
    }
  }

  function animate_scale(animation, valueFactor) {
    if (animation === "scaleup") {
      if (scale <= 1.0) {
        scale += valueFactor / 2;
      } else {
        animationIndex++;
      }
    } else if (animation === "scaledown") {
      if (scale > 0.25 * scaleRatio) {
        scale -= valueFactor / 2;
      } else {
        animationIndex++;
      }
    }
  }

  function animate_location(animation, movingSpeedFactor) {
    if (animation === "upright") {
      thislocation = {
        x: thislocation.x + movingSpeedFactor,
        y: thislocation.y + movingSpeedFactor,
      };
      if (thislocation.x >= canvas.width && thislocation.y >= canvas.height) {
        animationIndex++;
      }
    } else if (animation === "downleft") {
      thislocation = {
        x: thislocation.x - movingSpeedFactor,
        y: thislocation.y - movingSpeedFactor,
      };

      if (thislocation.x <= -canvas.width && thislocation.y <= -canvas.height) {
        animationIndex++;
      }
    } else if (animation === "upleft") {
       thislocation = {
        x: thislocation.x - movingSpeedFactor,
        y: thislocation.y + movingSpeedFactor,
      };

      if (thislocation.x <= -canvas.width && thislocation.y >= canvas.height) {
        animationIndex++;
      }
    } else if (animation === "downright") {
      // Move to the bottom-right corner
      thislocation = {
        x: thislocation.x + movingSpeedFactor,
        y: thislocation.y - movingSpeedFactor,
      };
      if (thislocation.x >= canvas.width && thislocation.y <= -canvas.height) {
        animationIndex++;
      }
  
     } else if (animation === "center") {
      const centerX = 0.0, centerY = 0.0;
      const dx = centerX - thislocation.x;
      const dy = centerY - thislocation.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        animationIndex++;
      } else {
        thislocation = {
          x: thislocation.x + (dx / distance) * movingSpeedFactor,
          y: thislocation.y + (dy / distance) * movingSpeedFactor,
        };
      }
    }
  }
}

try {
  Main();
} catch (e) {
  showError(e);
}

// vertex and fragments utilities function

function triangle(a, b, c, color) {
  // add colors and vertices for one triangle
  colors.push(baseColors[color]);
  points.push(a);
  colors.push(baseColors[color]);
  points.push(b);
  colors.push(baseColors[color]);
  points.push(c);
}

function tetra(a, b, c, d) {
  // tetrahedron with each side using
  // a different color
  triangle(a, c, b, 0);
  triangle(a, c, d, 1);
  triangle(a, b, d, 2);
  triangle(b, c, d, 3);
}

function divideTetra(a, b, c, d, count) {
  //check for end of recursion
  if (count === 0) {
    tetra(a, b, c, d);
    return;
  }
  let ab = mix(a, b, 0.5);
  let ac = mix(a, c, 0.5);
  let ad = mix(a, d, 0.5);
  let bc = mix(b, c, 0.5);
  let bd = mix(b, d, 0.5);
  let cd = mix(c, d, 0.5);

  --count;

  divideTetra(a, ab, ac, ad, count);
  divideTetra(ab, b, bc, bd, count);
  divideTetra(ac, bc, c, cd, count);
  divideTetra(ad, bd, cd, d, count);
}

