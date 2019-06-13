function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    buffer = createGraphics(windowWidth, windowHeight);
    texture = createGraphics(windowWidth, windowHeight);

    // Set limit on sliders (e.g., Sun, Terrain)
    setConfigLimits();
    rectMode(CENTER);
}

function draw() {
    // Check for manual canvas resize
    if (obj.canvasFullscreen != true && (obj.canvasWidth != width || obj.canvasHeight != height)) {
        resizeCanvas(obj.canvasWidth, obj.canvasHeight);
        buffer.resizeCanvas(obj.canvasWidth, obj.canvasHeight);
        obj.landscapeChange = true;
        setConfigLimits();
    }
    else if (obj.canvasFullscreen == true && (width != windowWidth || height != windowHeight)) {
        windowResized()
    }
    // Background: only update if something has changed
    if (obj.landscapeChange) {
        // Seed
        randomSeed(obj.landscapeSeed);

        // Sky
        if (obj.bgType == 'gradient') { setGradient(0, 0, width, height, color(obj.bgGradient[0]), color(obj.bgGradient[1])); }
        else { background(obj.bgColour); } 

        // Stars
        if (obj.starsShow) { drawStars(); };

        // Sun
        if (obj.sunShow) { drawSun(); };

        // Seed again so star changes don't impact terrain
        randomSeed(obj.landscapeSeed);

        // Terrain  
        drawTerrain();

        // No more updates
        obj.landscapeChange = false;
    }

    // Show background landscape (buffer)
    image(buffer,0,0);
    texture.clear();

    // Draw a tree (simple examle)
    randomSeed(obj.treeSeed);
    textureSeed = 1;
    drawTree(width/2,
        obj.terrainPoints[Math.ceil(0.5 * Math.pow(2, obj.terrainIterations))][1],
        obj.angle,
        obj.angleChange,
        obj.angleVaryProp,
        obj.largeAngle,
        obj.largeAngleProb,
        obj.length,
        obj.lengthChange,
        obj.lengthVaryProp,
        obj.length * obj.lengthWidth,
        obj.widthChange,
        obj.splitProb,
        obj.splitProbChange,
        10,
        obj.depth,
        obj.trunkCol);
 
    image(texture,0,0);

    // Frame rate
    if (obj.showFPS) { drawFPS(); };

}

function windowResized() {
    if (obj.canvasFullscreen) {
        resizeCanvas(windowWidth, windowHeight);
        buffer.resizeCanvas(windowWidth, windowHeight);
        texture.resizeCanvas(windowWidth, windowHeight);
        obj.landscapeChange = true;
        setConfigLimits();
    }
}

function drawFPS() {
    let fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);    
}

function setConfigLimits() {
    // Sun
    obj.sunX = width/2;
    obj.sunY = height/2;
    sun4.__max = width;
    sun5.__max = height;
    sun4.updateDisplay();
    sun5.updateDisplay()
    // Terrain 
    obj.terrainY1 = height/4;
    obj.terrainY2 = height/4;
    t1.__max = height;
    t2.__max = height;
    t1.updateDisplay();
    t2.updateDisplay()
}

// Silly random function so we can have a separate seeded random
var textureSeed = 1;
function random2() {
    var x = Math.sin(textureSeed++) * 10000;
    return x - Math.floor(x);
}

//Darken (amount > 0) or lighten (amount < 0) an [R,G,B] colour
function darken(col, amount) {
    var new_col = [col[0] - (col[0]*amount), col[1] - (col[1]*amount), col[2] - (col[2]*amount)];
    return new_col;
}

//Modify a given [R,G,B] colour by a fixed amount (randomly)
function mod_col(col, amount, n) {
    var new_col = [col[0]+((random2()-0.5)*amount), col[1]+((random2()-0.5)*amount), col[2]+((random2()-0.5)*amount)];
    return new_col;
}

// See if two objects have the same values - not used yet
// http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

// np.linspace equiv
// https://stackoverflow.com/questions/40475155/does-javascript-have-a-method-that-returns-an-array-of-numbers-based-on-start-s
function npLinspace(startValue, stopValue, cardinality) {
  if (cardinality == 1) { return [stopValue]; }
    var arr = [];
  var currValue = startValue;
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(currValue + (step * i));
  }
  return arr;
}