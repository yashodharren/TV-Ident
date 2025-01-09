function configureShaders() {
  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);

  // enable hidden-surface removal
  gl.enable(gl.DEPTH_TEST);

  // Initialize shader path
  const vshader = "shader/vshader.glsl";
  const fshader = "shader/fshader.glsl";

  //  Load shaders and initialize attribute buffers
  var program = initShaders(gl, vshader, fshader);
  gl.useProgram(program);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // get the location of the uniform variables
  canvasSizeLoc = gl.getUniformLocation(program, "canvasSize");

  thetaLoc = gl.getUniformLocation(program, "theta");
  scaleLoc = gl.getUniformLocation(program, "scale");
  locationLoc = gl.getUniformLocation(program, "location");
}

function showError(errorText) {
  console.error(errorText);
  const errorBoxDiv = document.getElementById("error-box");
  const errorTextElement = document.createElement("p");
  errorTextElement.innerHTML = errorText;
  errorBoxDiv.appendChild(errorTextElement);
}

function setup() {
  /** @type {HTMLCAnvasElement|null} */
  canvas = document.getElementById("gl-canvas");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    showError("Canvas element not found!");
    return;
  }
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    showError("WebGL isn't available");
    return false;
  }
  return true;
}

function showError(errorText) {
  console.error(errorText);
  const errorBoxDiv = document.getElementById("error-box");
  const errorTextElement = document.createElement("p");
  errorTextElement.innerHTML = errorText;
  errorBoxDiv.appendChild(errorTextElement);
}

function setup() {
  /** @type {HTMLCAnvasElement|null} */
  canvas = document.getElementById("gl-canvas");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    showError("Canvas element not found!");
    return;
  }

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    showError("WebGL isn't available");
    return false;
  }
  return true;
}
