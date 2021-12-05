/*
 * tree.js
 * WebGL and Three.JS usage for 3D
 * orbitable environment of spinning tree.
 */

// init: initialize use of WebGL and Three.JS in the window
function init () {
    var scene = new THREE.Scene();

    //init dat.gui mini controller for objects
    //var gui = new dat.GUI();

    //init 3D objects
    var trunk = createTrunk();
    trunk.name = 'trunk-1';

    var plane = getFloor(300, 300);
    plane.name = 'ground-1';

    //init light objects
    var ambientLight = getAmbientLight('rgb(10, 30, 50)', 1);
    //var directionalLight = getDirectionalLight(0xffffff, 1);

    //manipulate asphalt plane
    plane.rotation.x = Math.PI/2;
    plane.position.y = -(trunk.geometry.parameters.height/2);

    //add environmental map to background of scene
    scene = assignCubemap(scene);

    //create dat.gui controller
    //gui = addGuiControls(gui, directionalLight, ambientLight);

    // add meshes to scene
    scene.add(trunk);
    scene.add(plane);

    //add lighting to scene
    //directionalLight.add(lightSphere);
    //scene.add(directionalLight);
    scene.add(ambientLight);

    // init PerspectiveCamera object
    var camera =  new THREE.PerspectiveCamera(
        30, //field of view
        window.innerWidth/window.innerHeight, //aspect ratio
        1, //near clipping plane
        1000 //far clipping plane
    );

    // scene.add(camera);
    // camera.add(test);
    // test.position.set( 0, 5, -20 );

    // init Renderer object
    var renderer = initRenderer();
    // add renderer to HTML
    document.getElementById('webgl').appendChild(renderer.domElement);

    // allow for orbit control of scene
    var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    //orbitControls.enablePan = false;
    orbitControls.minPolarAngle = Math.PI/2;
    orbitControls.maxPolarAngle = Math.PI/2;

    //manipulate camera and orbit controls based on screen format
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = -0.25;
    if (window.innerHeight <= window.innerWidth) { //landscape type viewport, taller tree
        camera.position.x = 6;
        camera.position.y = 0;    
        camera.position.z = 6;
        orbitControls.minDistance = 6;
        orbitControls.maxDistance = 8;
    } else { //portrait type viewport, squatter tree
        camera.position.x = 8;
        camera.position.y = 0;    
        camera.position.z = 8;
        orbitControls.minDistance = 4;
        orbitControls.maxDistance = 8;
    }

    // continuously update display
    update(renderer, scene, camera, orbitControls);
};

// initRenderer: create and return WebGLRenderer object
function initRenderer() {
    var renderer = new THREE.WebGLRenderer( {antialias: true});
    renderer.shadowMap.enabled = true; //enable shadows line 1 of ??
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x51A3A3);

    return renderer;
}

// assignCubemap: use cubemap as environment background in scene
function assignCubemap(scene) {
    //load cube map
    var path = 'assets/cubemap/Pond/';
    var format = '.jpg';
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    scene.background = reflectionCube; //set cubemap as background

    return scene;
}

// createSheet: Returns plane mesh with scanned sheet as texture
// function createSheet() {

// }

// createTrunk: Returns cylinder mesh with trunk surface texture
function createTrunk() {
    const windHeight = window.innerHeight;
    const windWidth = window.innerWidth;
    var trunkRadius;
    var trunkHeight;

    if (windHeight <= windWidth) { //landscape type viewport, taller tree
        trunkRadius = windWidth / 750;
        trunkHeight = trunkRadius * 3;
    } else { //portrait type viewport, squatter tree
        trunkRadius = windWidth / 450;
        trunkHeight = trunkRadius * 4.9;
    }

    var trunk = getCylinder(trunkRadius, trunkRadius, trunkHeight, 32);

    var loader = new THREE.TextureLoader();
    var trunkTexture = loader.load( 'assets/textures/TreehuggerSurface_for_web.png', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set( 1, 1 );
    
    } );

    trunk.material.map = trunkTexture;

    return trunk;
}

// getFloor: Returns Plane mesh with asphalt texture to use as "floor"
function getFloor(w, d) {
    var loader = new THREE.TextureLoader();

    var texture = loader.load( 'assets/textures/Asphalt_004_SD/Asphalt_004_COLOR.jpg', function ( texture ) {
    
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set( 60, 60 );
    
    } );

    // test making a box mesh from geo + material
    var geometry = new THREE.PlaneGeometry(w, d);
    var material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texture
    });

    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.receiveShadow = true;

    return mesh;
}

// getSphere: Create and return sphere mesh
function getSphere(radius, color) {
    var geometry = new THREE.SphereGeometry(radius, 24, 24); // size, width and height segments
    var material = new THREE.MeshBasicMaterial({
        color: color
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

// getAmbientLight: Create and return ambient light
function getAmbientLight(color, intensity) {
    var light = new THREE.AmbientLight(color, intensity);
    //light.castShadow = true; //ambient does not cast shadows
    return light;
}

// getCylinder: Create and return cylinder mesh
function getCylinder(radTop, radBott, h, radSeg) {
    // test making a box mesh from geo + material
    var geometry = new THREE.CylinderGeometry(radTop, radBott, h, radSeg);
    var material = new THREE.MeshBasicMaterial({
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true;

    return mesh;
}

// update: Recursively update display
function update(renderer, scene, camera, controls) {
    renderer.render(
        scene,
        camera
    ); // call renderer function on render using scene+camera
    renderer.setSize( window.innerWidth, window.innerHeight );

    var trunk = scene.getObjectByName('trunk-1');
    trunk.height = window.innerHeight;

    controls.update();

    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls);
    })
}

/****
 * ARTIFACT FUNCTIONS from learning ThreeJS
****/

//rotate plane animation
// var plane = scene.getObjectByName('plane-1');
// plane.rotation.y += 0.001;
// plane.rotation.z += 0.001;

// addGuiControls: Create controls for dat.GUI
function addGuiControls(gui, directionalLight, ambientLight) {
    gui.add(directionalLight, 'intensity', 0, 10);
    gui.add(directionalLight.position, 'x', 1.2, 10);
    gui.add(directionalLight.position, 'y', 1.2, 10);
    gui.add(directionalLight.position, 'z', 1.2, 10);
    gui.add(ambientLight, 'intensity', 0, 10);

    return gui;
}

// getPointLight: Create and return point light
function getPointLight(color, intensity) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true; //enable shadows line 2 of ??

    // introduced in spotLight module, might not be necessary
    light.shadow.bias = 0.001; 
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.heigh = 2048;

    return light;
}

// getDirectionalLight: Create and return directional light
function getDirectionalLight(color, intensity) {
    var light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true; //enable shadows line 2 of ??

    // introduced in spotLight module, might not be necessary
    light.shadow.bias = 0.001; 
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    return light;
}

// getBox: Create and return box mesh
function getBox(w, h, d) {
    // test making a box mesh from geo + material
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({
        color: 0x75485E
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.castShadow = true;

    return mesh;
}


init();




