// Sky
function setGradient(x, y, w, h, c1, c2, axis) {
    noFill();
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      buffer.stroke(c);
      buffer.line(x, i, x+w, i);
    }
}

// Stars
function drawUniformStars(n, size) {
    for (var i = 0; i < n; i++) {
        var x = random(width);
        var y = random(height);
        var s = random(size)
        buffer.noStroke();
        c = color(obj.starsCol);
        c.setAlpha(obj.starsAlpha * 255);
        buffer.fill(c);
        buffer.circle(x, y, s);
    }
}

function drawStars() {
    // TODO: twinkle (https://editor.p5js.org/wvnl/sketches/5wnuHAXKd)

    // Large stars (0.5% by n, up to full size)
    drawUniformStars(obj.starsNum*0.005, obj.starsSize*1.0)

    // Medium stars (15% by n, up to 50% size)
    drawUniformStars(obj.starsNum*0.150, obj.starsSize*0.5)

    // Small stars (85% by n, up to 20% size)
    drawUniformStars(obj.starsNum*0.850, obj.starsSize*0.2)  
}

// Sun
// https://gist.github.com/uhho/dddd61edc0fdfa1c28e6)
function makeGaussian(amplitude, x0, y0, fwhm) {
    return function(amplitude, x0, y0, fwhm, x, y) {
        var exponent = -(
                ( Math.pow(x - x0, 2) / (2 * Math.pow(fwhm, 2)))
                + ( Math.pow(y - y0, 2) / (2 * Math.pow(fwhm, 2)))
            );
        return amplitude * Math.pow(Math.E, exponent);
    }.bind(null, amplitude, x0, y0, fwhm);
}

function drawSun() {

    if (obj.sunTerrain) { var sunY = obj.terrainPoints[Math.ceil((obj.sunX / width) * Math.pow(2, obj.terrainIterations))][1]; }
    else { var sunY = height - obj.sunY; }
    var gaussian = makeGaussian(255, obj.sunX, sunY, obj.sunSize);
    buffer.loadPixels();
    let d = buffer.pixelDensity();
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            updatePixel(x,y,d,gaussian);
        }
    }
    buffer.updatePixels();
}

// Colour blending: https://stackoverflow.com/questions/9014729/manually-alpha-blending-an-rgba-pixel-with-an-rgb-pixel
function updatePixel(x,y,d,gaussian) {
    a = gaussian(x,y);
    if (a>0) {
        for (let i = 0; i < d; i++) {
            for (let j = 0; j < d; j++) {
                // loop over
                index = 4 * ((y * d + j) * width * d + (x * d + i));
                buffer.pixels[index]   =  a + (buffer.pixels[index] * (255 - a)/255);
                buffer.pixels[index+1] =  a + (buffer.pixels[index+1] * (255 - a)/255);
                buffer.pixels[index+2] =  a + (buffer.pixels[index+2] * (255- a)/255);
            }
        }
    }
}

// Terrain
// Adapted from http://www.somethinghitme.com/2013/11/11/simple-2d-terrain-with-midpoint-displacement/
function terrain(y1, y2, displace, roughness, iterations) {
    // Set placeholders
    var points = [] // Array of [x,y] points
    var power = Math.pow(2, iterations); // Number of segments (for point array indexing)

    // Set initial points
    points[0] = [0,y1];
    points[power] = [width,y2];

    // Increase the number of segments
    for (var i = 1; i < power; i *= 2) {
        // Iterate through each segment calculating the center point
        for (var j = (power / i) / 2; j < power; j += power / i) {
            var y = ((points[j - (power / i) / 2][1] + points[j + (power / i) / 2][1]) / 2);
            y += (random() * displace * 2) - displace;
            points[j] = [(j/power)*width, y];
        }
        // reduce our random range
        displace *= 2 ** (-roughness);
    }
    return points;
}

function drawTerrain() {
    var terPoints = terrain(height-obj.terrainY1, height-obj.terrainY2, obj.terrainDispl, obj.terrainRough, obj.terrainIterations);
    
    // Draw a polygon
    buffer.noStroke();
    buffer.fill(color(obj.terrainCol));
    buffer.beginShape();
    vertex(0,height);
    for(i=0; i < terPoints.length; i++) {
        vertex(terPoints[i][0], terPoints[i][1]);
    }
    vertex(width,height);
    buffer.endShape(CLOSE);

    // Save the terrain points for later use
    obj.terrainPoints = terPoints;
}