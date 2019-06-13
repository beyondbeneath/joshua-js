  var treeTypes = ['Type I', 'Type Ia', 'Type Ib', 'Type II', 'Type IIa', 'Type IIb'];
  var randTree = treeTypes[Math.floor(Math.random() * treeTypes.length)];
  
  // Add some interesting ones from UI gradients (https://uigradients.com)
  var ui_dict = {
      alihossein:['#f7ff00','#db36a4'],
      blue_lagoon:['#191654','#43C6AC'],
      blue_skies:['#2F80ED','#56CCF2'],
      cosmic_fusion:['#333399','#ff00cc'],
      crimson_tide:['#642B73','#C6426E'],
      dania:['#7BC6CC','#BE93C5'],
      dark_skies:['#283E51','#4B79A1'],
      dawn:['#3B4371','#F3904F'],
      deep_sea_space:['#2C3E50','#4CA1AF'],
      dusk:['#2C3E50','#FD746C'],
      electric_violet:['#4776E6','#8E54E9'],
      frost:['#000428','#004e92'],
      grapefruit_sunset:['#904e95','#e96443'],
      ibiza_sunset:['#ee0979','#ff6a00'],
      jupiter:['#19547b','#ffd89b'],
      kashmir:['#516395','#614385'],
      love_couple:['#3a6186','#89253e'],
      nepal:['#2657eb','#de6161'],
      shroom_haze:['#5C258D','#4389A2'],
      sunset:['#0B486B','#F56217'],
      sweet_morning:['#FF5F6D','#FFC371'],
      transfile:['#CB3066','#16BFFD'],
      visions_of_grandeur:['#000046','#1CB5E0'],
      what_lies_beyond:['#000C40', '#F0F2F0'] 
  }
  var randGrad = Object.keys(ui_dict)[Math.floor(Math.random() * Object.keys(ui_dict).length)]

  var obj = {
      canvasFullscreen: true,
      canvasWidth: 640,
      canvasHeight: 480,

      landscapeChange: true,
      landscapeSeed: Math.floor(Math.random()*1e6),
      generateSeed1: function(){
        obj.landscapeSeed = Math.floor(Math.random()*1e6);
        seed0.updateDisplay();
        obj.landscapeChange = true;
      },

      bgType: 'gradient',
      bgColour: [1,1,1],
      bgGradient: ui_dict[randGrad],

      // Stars
      starsShow: true,
      starsNum: 5000,
      starsSize: 5,
      starsCol: [255,255,255],
      starsAlpha: 1,

      // Sun
      sunShow: false,
      sunSize: 200,
      sunTerrain: true,
      sunX: 800,
      sunY: 800,

      // Terrain
      terrainY1: 200,
      terrainY2: 200,
      terrainRough: 1.2,
      terrainDispl: 100,
      terrainIterations: 10,
      terrainCol: [0,0,0],
      terrainPoints: [],

      // Trees
      treeSeed: Math.floor(Math.random()*1e6),
      generateSeed2: function(){
        obj.treeSeed = Math.floor(Math.random()*1e6);
        seed2.updateDisplay();
      },      
      treeType: randTree,
      length: 150,
      angle: 90,
      lengthChange: treeParams[randTree].lengthChange, 
      lengthVaryProp: treeParams[randTree].lengthVaryProp,
      lengthWidth: treeParams[randTree].lengthWidth,
      widthChange: treeParams[randTree].widthChange,
      angleChange: treeParams[randTree].angleChange,
      angleVaryProp: treeParams[randTree].angleVaryProp,
      largeAngleProb: treeParams[randTree].largeAngleProb,
      largeAngle: treeParams[randTree].largeAngle,
      splitProb: treeParams[randTree].splitProb,
      splitProbChange: treeParams[randTree].splitProbChange,
      depth: treeParams[randTree].depth,
      trunkCol: [0,0,0],

      // Spikes - individual
      spike1Show: true,
      spike1Col: [150,199,130], //green
      spike1Angle: 40,
      spike1Length: 0.5,

      spike2Show: true,
      spike2Col: [189, 204, 153], //yellow
      spike2Angle: 70,

      spike3Show: true,
      spike3Col: [160,114,112], //brown
      spike3Angle: 15,

      // Spikes - general
      spikeW: 0.3,
      spikeL: 2,
      spikeJitter: 0.5,
      spikeDensX: 3,
      spikeDensY: 3,
      spikeDarken: 0,
      spikeColVary: 0.1,

      saveImage: function(){save('joshua-js.png');},
      showFPS: false
  };

  var gui = new dat.gui.GUI();
  gui.remember(obj);

  // Canvas config
  var configCanvas = gui.addFolder('Canvas');
  var cv1 = configCanvas.add(obj, 'canvasFullscreen');
  var cv2 = configCanvas.add(obj, 'canvasWidth');
  var cv3 = configCanvas.add(obj, 'canvasHeight');
  // TODO: make an enable and disable function
  cv1.onChange(function(value) {
    if (value) {
      cv2.domElement.style.pointerEvents = "none";
      cv2.domElement.style.opacity = 0.5;
      cv3.domElement.style.pointerEvents = "none";
      cv3.domElement.style.opacity = 0.5; 
    }
    else {
      cv2.domElement.style.pointerEvents = "auto";
      cv2.domElement.style.opacity = 1.0;
      cv3.domElement.style.pointerEvents = "auto";
      cv3.domElement.style.opacity = 1.0;
    }
  });
  cv2.domElement.style.pointerEvents = "none";
  cv2.domElement.style.opacity = 0.5;
  cv3.domElement.style.pointerEvents = "none";
  cv3.domElement.style.opacity = 0.5;


  // Landscape config
  var configLandscape = gui.addFolder('Landscape');
  // Seed
  var seed0 = configLandscape.add(obj, 'landscapeSeed');
  var seed1 = configLandscape.add(obj, 'generateSeed1');
  seed0.onChange(function(value) { obj.landscapeChange = 1; });

  // Landscape - Sky config
  var landscapeSky = configLandscape.addFolder('Sky');
  var sk1 = landscapeSky.add(obj, 'bgType', ['gradient', 'solid']);
  var sk2 = landscapeSky.add(obj, 'bgGradient', ui_dict);
  var sk3 = landscapeSky.addColor(obj, 'bgColour');
  sk1.onChange(function(value) { obj.landscapeChange = true; });
  sk2.onChange(function(value) { obj.landscapeChange = true; obj.bgGradient = split(obj.bgGradient,","); });
  sk3.onChange(function(value) { obj.landscapeChange = true; });

  // Landscape - Stars config
  var landscapeStars = configLandscape.addFolder('Stars');
  var st1 = landscapeStars.add(obj, 'starsShow')
  var st2 = landscapeStars.add(obj, 'starsNum').min(0).max(5000).step(10);
  var st3 = landscapeStars.add(obj, 'starsSize').min(0).max(10).step(1);
  var st4 = landscapeStars.addColor(obj, 'starsCol');
  var st5 = landscapeStars.add(obj, 'starsAlpha').min(0).max(1).step(0.01);
  st1.onChange(function(value) { obj.landscapeChange = true; });
  st2.onChange(function(value) { obj.landscapeChange = true; });
  st3.onChange(function(value) { obj.landscapeChange = true; });
  st4.onChange(function(value) { obj.landscapeChange = true; });
  st5.onChange(function(value) { obj.landscapeChange = true; });

  // Landscape - Sun config
  var landscapeSun = configLandscape.addFolder('Sun');
  var sun1 = landscapeSun.add(obj, 'sunShow')
  var sun2 = landscapeSun.add(obj, 'sunSize').min(0).max(1000).step(5);
  var sun3 = landscapeSun.add(obj, 'sunTerrain')
  var sun4 = landscapeSun.add(obj, 'sunX').min(0).max(100).step(1);
  var sun5 = landscapeSun.add(obj, 'sunY').min(0).max(100).step(1);
  sun1.onChange(function(value) { obj.landscapeChange = true; });
  sun2.onChange(function(value) { obj.landscapeChange = true; });
  sun3.onChange(function(value) { obj.landscapeChange = true; });
  sun4.onChange(function(value) { obj.landscapeChange = true; });
  sun5.onChange(function(value) { if (obj.sunTerrain == false) {obj.landscapeChange = true;} });

  // Landscape - Terrain config
  var landscapeTerrain = configLandscape.addFolder('Terrain');
  var t1 = landscapeTerrain.add(obj, 'terrainY1').min(0).max(100).step(5);
  var t2 = landscapeTerrain.add(obj, 'terrainY2').min(0).max(100).step(5);
  var t3 = landscapeTerrain.add(obj, 'terrainRough').min(0).max(2).step(0.1);
  var t4 = landscapeTerrain.add(obj, 'terrainDispl').min(0).max(500).step(10);
  var t5 = landscapeTerrain.add(obj, 'terrainIterations').min(1).max(10).step(1);
  var t6 = landscapeTerrain.addColor(obj, 'terrainCol');
  t1.onChange(function(value) { obj.landscapeChange = true; });
  t2.onChange(function(value) { obj.landscapeChange = true; });
  t3.onChange(function(value) { obj.landscapeChange = true; });
  t4.onChange(function(value) { obj.landscapeChange = true; });
  t5.onChange(function(value) { obj.landscapeChange = true; });
  t6.onChange(function(value) { obj.landscapeChange = true; });

  var configTree = gui.addFolder('Tree');
  var seed2 = configTree.add(obj, 'treeSeed');
  var seed3 = configTree.add(obj, 'generateSeed2');
  var tt1 = configTree.add(obj, 'treeType', ['Type I', 'Type Ia', 'Type Ib', 'Type II', 'Type IIa', 'Type IIb']);
  tt1.onChange(function(value) {
      obj.lengthChange = treeParams[value].lengthChange; 
      obj.lengthVaryProp = treeParams[value].lengthVaryProp;
      obj.lengthWidth = treeParams[value].lengthWidth;
      obj.widthChange = treeParams[value].widthChange;
      obj.angleChange = treeParams[value].angleChange;
      obj.angleVaryProp = treeParams[value].angleVaryProp;
      obj.largeAngleProb = treeParams[value].largeAngleProb;
      obj.largeAngle = treeParams[value].largeAngle;
      obj.splitProb = treeParams[value].splitProb;
      obj.splitProbChange = treeParams[value].splitProbChange;
      obj.depth = treeParams[value].depth;
      for (var i in configTree.__controllers) {
        configTree.__controllers[i].updateDisplay();
      }
  });

  configTree.add(obj, 'length').min(0).max(500).step(1);
  configTree.add(obj, 'lengthChange').min(0).max(2).step(0.02);
  configTree.add(obj, 'lengthVaryProp').min(0).max(1).step(0.01);
  configTree.add(obj, 'lengthWidth').min(0).max(1).step(0.01);
  configTree.add(obj, 'widthChange').min(0).max(2).step(0.02);
  configTree.add(obj, 'angle').min(0).max(180).step(1);
  configTree.add(obj, 'angleChange').min(0).max(90).step(1);
  configTree.add(obj, 'angleVaryProp').min(0).max(2).step(0.02);
  configTree.add(obj, 'largeAngleProb').min(0).max(1).step(0.01);
  configTree.add(obj, 'largeAngle').min(0).max(90).step(1);
  configTree.add(obj, 'splitProb').min(0).max(1).step(0.01);
  configTree.add(obj, 'splitProbChange').min(0).max(1).step(0.01);
  configTree.add(obj, 'depth').min(1).max(10).step(1);
  configTree.addColor(obj, 'trunkCol');

  // Spikes
  var configSpikes = gui.addFolder('Spikes');
  var configSpikes1 = configSpikes.addFolder('Leaves (Alive)'); //green
  configSpikes1.add(obj, 'spike1Show');
  configSpikes1.addColor(obj, 'spike1Col');
  configSpikes1.add(obj, 'spike1Angle').min(0).max(90).step(1);
  configSpikes1.add(obj, 'spike1Length').min(0).max(2).step(0.02);

  var configSpikes2 = configSpikes.addFolder('Leaves (Dying)'); //brown
  configSpikes2.add(obj, 'spike2Show');
  configSpikes2.addColor(obj, 'spike2Col');
  configSpikes2.add(obj, 'spike2Angle').min(0).max(90).step(1);

  var configSpikes3 = configSpikes.addFolder('Trunk'); //brown
  configSpikes3.add(obj, 'spike3Show');
  configSpikes3.addColor(obj, 'spike3Col');
  configSpikes3.add(obj, 'spike3Angle').min(0).max(90).step(1);

    // Spikes - general
  configSpikes.add(obj, 'spikeW').min(0).max(1).step(0.01);
  configSpikes.add(obj, 'spikeL').min(0).max(5).step(0.05);
  configSpikes.add(obj, 'spikeJitter').min(0).max(1).step(0.01);
  configSpikes.add(obj, 'spikeDensX').min(0).max(10).step(0.1);
  configSpikes.add(obj, 'spikeDensY').min(0).max(10).step(0.1);
  configSpikes.add(obj, 'spikeDarken').min(0).max(1).step(0.01);
  configSpikes.add(obj, 'spikeColVary').min(0).max(1).step(0.01);

  // Save & FPS
  gui.add(obj, 'saveImage');
  gui.add(obj, 'showFPS');