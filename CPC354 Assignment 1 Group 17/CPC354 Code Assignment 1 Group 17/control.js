/*
--------------------
COLORS
--------------------
*/
document.body.style.backgroundColor = "#333333";
const colorbg = document.getElementById("colorbg");
colorbg.value = "#333333";
// change the color of the page background based on the color picker
colorbg.addEventListener("input", () => {
  document.body.style.backgroundColor = colorbg.value;
  const bgcolors = hexToRgb(colorbg.value);
  gl.clearColor(bgcolors.r, bgcolors.g, bgcolors.b, bgcolors.a);
});

function hexToRgb(hex) {
  // convert hex to rgb
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  // flatten the values to 0-1
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: 1.0,
  };
}

function rgbToHex(rgb) {
  // convert rgb to hex
  const hex = ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16);
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

/*
--------------------
COLORS
--------------------
*/

/*
--------------------
ACCORDION
--------------------
*/
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    const attribute = this.getAttribute("data-panel");
    const panels = document.querySelectorAll(`[data-panel=${attribute}]`);
    panels.forEach((panel) => {
      if (panel.classList.contains("accordion")) return;
      if (panel.style.display === "flex") {
        panel.style.display = "none";
      } else {
        panel.style.display = "flex";
      }
    });
  });
}

// create a border for every panel based on the data-color attribute
const borderColors = {
  red: "#a52a2a",
  blue: "#2784af",
  purple: "#9B88FD",
  pink: "#D2AAFA",
  green: "#1ccf6a",
};
const panels = document.getElementsByClassName("panel");
for (let i = 0; i < panels.length; i++) {
  const bordercolor = panels[i].getAttribute("data-color");
  panels[i].style.borderLeft = `3px solid ${borderColors[bordercolor]}`;
}

// create a text element for every range input value
const sliders = document.querySelectorAll("input[type=range]");
sliders.forEach((slider) => {
  //create a bar behind the slider thumb and the width based ont he position of the thumb
  // the slider bar start at the start of the slider and end at the thumb
  const sliderBar = document.createElement("span");
  sliderBar.classList.add("slider-bar");
  slider.parentElement.appendChild(sliderBar);
  sliderBar.style.width = ((slider.value / slider.getAttribute("max")) * 100) / 2 + "%";
  sliderBar.setAttribute("data-value", slider.value);

  // update the slider bar width when the slider value change
  slider.addEventListener("input", () => {
    sliderBar.style.width = ((slider.value / slider.getAttribute("max")) * 100) / 2 + "%";
  });

  // reset the slider value to the middle when double click
  slider.addEventListener("dblclick", () => {
    //round the value if decimal
    slider.value = Math.round(slider.getAttribute("max") / 2);
    sliderBar.style.width = ((slider.value / slider.getAttribute("max")) * 100) / 2 + "%";
    sliderText.innerHTML = slider.value;
  });

  // create a text element for every slider value
  const sliderText = document.createElement("span");
  sliderText.innerHTML = slider.value;
  slider.parentElement.appendChild(sliderText);
  slider.addEventListener("input", () => {
    sliderText.innerHTML = slider.value;
  });
});

/*
--------------------
ACCORDION
--------------------
*/

/*
--------------------
BUTTONS
--------------------
*/

// Function to toggle the control panel visibility
const toggleControlPanel = () => {
  controller.style.display = controller.style.display === "block" ? "none" : "block";
  toggle.innerHTML = controller.style.display === "block" ? "Close Controls" : "Open Controls";
};

// Event listener for control toggle button
const toggle = document.getElementById("controltoggle");
toggle.addEventListener("click", toggleControlPanel);

// Function to toggle the rotation direction
const toggleRotationDirection = () => {
  direction = !direction;
  const directionText = direction ? "clockwise" : "counter clockwise";
  directionValue.innerHTML = directionText;
  directionButton.setAttribute("data-direction", direction);
};

// Event listener for direction button
const directionButton = document.getElementById("direction");
const directionValue = document.createElement("span");
directionValue.innerHTML = direction ? "clockwise" : "counter clockwise";
directionButton.appendChild(directionValue);
directionButton.addEventListener("click", toggleRotationDirection);

// Event listeners for animation controls
const playButton = document.getElementById("playbutton");
const pauseButton = document.getElementById("pausebutton");
const animateDisabledElements = document.querySelectorAll("[data-animate-disabled]");
playButton.addEventListener("click", () => {
  isAnimating = true;
  isPaused = false;
  pauseButton.innerHTML = isPaused ? "unpause" : "pause";

  animateDisabledElements.forEach((element) => {
    element.disabled = true;
    element.style.cursor = "not-allowed"; // show not-allowed cursor when disabled
  });
});

pauseButton.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseButton.innerHTML = isPaused ? "unpause" : "pause";
});

const stopButton = document.getElementById("stopbutton");
stopButton.addEventListener("click", () => {
  isAnimating = false;
  isPaused = false;
  animationIndex = 0;
  startTime = undefined;

  animateDisabledElements.forEach((element) => {
    element.disabled = false;
    element.style.cursor = "pointer"; // show pointer cursor when enabled
  });
});

/*
--------------------
BUTTONS
--------------------
*/
