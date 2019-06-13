function drawTree(x1, y1, angle, angle_change, angle_vary_prop, large_angle, large_angle_prob, length, length_change, length_vary_prop, w, width_change, split_prob, split_prob_change, depth, max_depth, trunk_col) {
    // Compute for higher depths, so the random slider works better by not changing subsequent branches
    if (depth > 0 && depth <= 10) {
        // Calculatre end position of segment
        var x2 = x1 + cos(radians(angle)) * length;
        var y2 = y1 - sin(radians(angle)) * length;

        // Draw a line
        //strokeWeight(depth);
        //stroke(0,0,0);
        //line(x1, y1, x2, y2);

        // Only plot if depth > 1
        if (depth > 10 - max_depth) {
                // Draw a rectangle
                push();
                //trunk
                let c = color(trunk_col);
                fill(c);
                strokeWeight(0);
                var rx = (x1 + x2) / 2;
                var ry = (y1 + y2) / 2;
                translate(rx,ry);
                rotate(radians(-angle+90));
                rect(0, 0, w, length);

                //trunk spikes
                if (obj.spike3Show) {
                    texture.push();
                    texture.translate(rx,ry);
                    texture.rotate(radians(-angle+90));
                    drawSpikes(0, 0, w, length, 1, obj.spike3Col, obj.spike3Angle);
                    texture.pop();
                }

                pop();
        }  

        // Randomise the angle & length changes
        l1 = length_change + ((random()-0.5) * length_change * length_vary_prop);
        l2 = length_change + ((random()-0.5) * length_change * length_vary_prop);
        a1 = angle_change  + ((random()-0.5) * angle_change  * angle_vary_prop);
        a2 = angle_change  + ((random()-0.5) * angle_change  * angle_vary_prop);
        
        // Reduce split probability
        split_prob  *= split_prob_change;

        // Add large angle split
        if (random() < large_angle_prob) { a1 = large_angle * random(); }
        if (random() < large_angle_prob) { a2 = large_angle * random(); }

        var rnd1 = random();
        var rnd2 = random();
        // Draw two more branches
        if (rnd1 < split_prob) {
            drawTree(x2, y2, angle-a1, angle_change, angle_vary_prop, large_angle, large_angle_prob, length*l1, length_change, length_vary_prop, w*width_change, width_change, split_prob, split_prob_change, depth-1, max_depth, trunk_col);
        }
        if (rnd2 < split_prob) {
            drawTree(x2, y2, angle+a2, angle_change, angle_vary_prop, large_angle, large_angle_prob, length*l2, length_change, length_vary_prop, w*width_change, width_change, split_prob, split_prob_change, depth-1, max_depth, trunk_col);
        }

        //leaf spikes
        if ((rnd1 > split_prob && rnd2 > split_prob) && depth > (10-max_depth) || depth==(10-max_depth)+1) {
            // Yellow ones
            if (obj.spike2Show) {
                texture.push();
                rx = x2;
                ry = y2;
                texture.translate(rx,ry);
                texture.rotate(radians(-angle+90));
                drawSpikes(0, 0, w, length*obj.spike1Length*0.25, 1, obj.spike2Col, obj.spike2Angle);
                texture.pop();
            }  
            // Green ones
            if (obj.spike1Show) {
                texture.push();
                rx = x2;
                ry = y2;
                texture.translate(rx,ry);
                texture.rotate(radians(-angle+90));
                drawSpikes(0, -(length*obj.spike1Length)/2, w, length*obj.spike1Length, -1, obj.spike1Col, obj.spike1Angle);
                texture.pop();
            }   
   
        }
    }
}

// TODO:
// optimise so that it only draws if there's a state change

function drawSpikes(x0, y0, w, l, spike_direction, spike_colour, spike_max_angle) {
    // Determined by global spike properties
    var spike_jitter=obj.spikeJitter;
    var spike_width=obj.spikeW;
    var spike_length=obj.spikeL;
    var spike_density_x=obj.spikeDensX;
    var spike_density_y=obj.spikeDensY;
    var spike_darken=obj.spikeDarken;
    var spike_colour_jitter=obj.spikeColVary;

    // Corner of rect
    var rx = x0 - w/2;
    var ry = y0 - l/2;

    // Space between spikes
    var nx = Math.round(Math.ceil((1 / spike_width) * spike_density_x))
    var ny = Math.round(Math.ceil((1 / (spike_length*w/l)) * spike_density_y))
    var spikex = npLinspace(rx+w, rx, nx);
    var spikey = npLinspace(ry+l, ry, ny);

    for (i=0; i<spikey.length; i++) {
        for (j=0; j<spikex.length; j++) {
            var sy = spikey[i];
            var sx = spikex[j];
            // Jitter the base
            var jitter_x1 = 1+((random2()-0.5)*spike_jitter)
            var jitter_x2 = 1+((random2()-0.5)*spike_jitter)
            // Set triangle base vertices
            var sx1 = sx-(jitter_x1*spike_width*w/2);
            var sy1 = sy;
            var sx2 = sx+(jitter_x1*spike_width*w/2);
            var sy2 = sy;

            // Calculate and jitter the tip
            var edge_distance = (((sx1+sx2)/2)-x0) / (w/2); // what proportion are they to the edge (with +/- sign)
            var angles = spike_direction*spike_max_angle*edge_distance;
            var sx3 = sx + spike_direction * spike_length*w * Math.cos(radians(90-angles));
            var sy3 = sy + spike_direction * spike_length*w * Math.sin(radians(90-angles));
            var jitter_x3 = ((random2()-0.5)*spike_jitter)*spike_width*w; 
            var jitter_y3 = ((random2()-0.5)*spike_jitter)*spike_width*w*2; //y should jitter a bit more than x!
            sx3 += jitter_x3;
            sy3 += jitter_y3;

            // Draw
            var c = darken(mod_col(spike_colour,spike_colour_jitter*255),spike_darken);
            texture.fill(c);;
            texture.triangle(sx1, sy1, sx2, sy2, sx3, sy3);
        }
    }
    
}