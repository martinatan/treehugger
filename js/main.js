function init () {
    // init Scene object
    var scene = new THREE.Scene();

    //init dat.gui mini controller for objects
    var gui = new dat.GUI();

    // load textures onto materials
    const treeTexture = new THREE.TextureLoader().load('assets/textures/TreehuggerSurface_for_web.png');
    const trunkMaterial = new THREE.MeshBasicMaterial( { map: treeTexture } );
    
    //init 3D objects
    var trunk = createTrunk();
    //var trunk = getCylinder(1.5, 1.5, 4, 64);
    //var disc = getCylinder(5, 5, 1, 64);

    var plane = getPlane(300, 300);

    //assign textures to 3D objects
    trunk.material = trunkMaterial;
    //plane.material = asphaltMaterial;

    //init light objects
    var directionalLight = getDirectionalLight(0xffffff, 1);
    var lightSphere = getSphere(0.05);
    var ambientLight = getAmbientLight('rgb(10, 30, 50)', 1);

    //test grabbing plane by name to rotate in update fxn
    //plane.name = 'plane-1';

    //manipulate 3D objects
    //trunk.position.y = trunk.geometry.parameters.height/2;
    plane.rotation.x = Math.PI/2;
    plane.position.y = -(trunk.geometry.parameters.height/2);

    //manipulate lighting objects
    directionalLight.position.x = 0;
    directionalLight.position.y = 0;
    directionalLight.position.z = 5;
    directionalLight.intensity = 1;

    //manipulate materials
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

    //create dat.gui controller
    gui.add(directionalLight, 'intensity', 0, 10);
    gui.add(directionalLight.position, 'x', 1.2, 10);
    gui.add(directionalLight.position, 'y', 1.2, 10);
    gui.add(directionalLight.position, 'z', 1.2, 10);
    gui.add(ambientLight, 'intensity', 0, 10);

    // add meshes to scene
    scene.add(trunk);
    scene.add(plane);

    //add lighting to scene
    directionalLight.add(lightSphere);
    scene.add(directionalLight);
    scene.add(ambientLight);

    // init PerspectiveCamera object
    var camera =  new THREE.PerspectiveCamera(
        30, //field of view
        window.innerWidth/window.innerHeight, //aspect ratio
        1, //near clipping plane
        1000 //far clipping plane
    );

    //re position camera angle

    // camera.position.x = 5;
    // camera.position.y = 0;    
    // camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // init Renderer object
    var renderer = new THREE.WebGLRenderer( {antialias: true});
    renderer.shadowMap.enabled = true; //enable shadows line 1 of ??
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x51A3A3);
    
    // add renderer to HTML
    document.getElementById('webgl').appendChild(renderer.domElement);

    // allow for orbit control of scene
    var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minPolarAngle = Math.PI/2;
    orbitControls.maxPolarAngle = Math.PI/2;

    console.log("height: " + window.innerHeight);
    console.log("width: " + window.innerWidth);
    //manipulate camera and orbit controls based on screen format
    if (window.innerHeight <= window.innerWidth) { //landscape type viewport, taller tree
        camera.position.x = 6;
        camera.position.y = 0;    
        camera.position.z = 6;
        orbitControls.minDistance = 6;
        orbitControls.maxDistance = 8;
    } else { //portrait type viewport, squatter tree
        camera.position.x = 3.5;
        camera.position.y = 0;    
        camera.position.z = 3.5;
        orbitControls.minDistance = 3;
        orbitControls.maxDistance = 4.9;
    }

    // continuously update display
    update(renderer, scene, camera, orbitControls);
};


function createTrunk() {
    const windHeight = window.innerHeight;
    const windWidth = window.innerWidth;
    var trunkRadius;
    var trunkHeight;

    if (windHeight <= windWidth) { //landscape type viewport, taller tree
        trunkRadius = windWidth / 750;
        trunkHeight = trunkRadius * 2;
    } else { //portrait type viewport, squatter tree
        trunkRadius = windWidth / 450;
        trunkHeight = trunkRadius * 3;
    }

    console.log("trunkrad = " + trunkRadius);
    console.log("trunkheight = " + trunkHeight);
    var trunk = getCylinder(trunkRadius, trunkRadius, trunkHeight, 64);

    return trunk;
}


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

function getPlane(w, d) {

    // const asphaltTexture = new THREE.TextureLoader().load('assets/textures/Asphalt_004_SD/Asphalt_004_COLOR.jpg');

    // asphaltTexture.wrapS = THREE.RepeatWrapping;
    // asphaltTexture.wrapT = THREE.RepeatWrapping;
    // asphaltTexture.repeat.set = (20,20);

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

function getSphere(radius) {

    // test making a box mesh from geo + material
    var geometry = new THREE.SphereGeometry(radius, 24, 24); // size, width and height segments
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)'
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}

function getPointLight(color, intensity) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true; //enable shadows line 2 of ??

    // introduced in spotLight module, might not be necessary
    light.shadow.bias = 0.001; 
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.heigh = 2048;

    return light;
}

function getDirectionalLight(color, intensity) {
    var light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true; //enable shadows line 2 of ??

    // introduced in spotLight module, might not be necessary
    light.shadow.bias = 0.001; 
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    return light;
}

function getAmbientLight(color, intensity) {
    var light = new THREE.AmbientLight(color, intensity);
    //light.castShadow = true; //ambient does not cast shadows

    return light;
}


function getCylinder(radTop, radBott, h, radSeg) {
    // test making a box mesh from geo + material
    var geometry = new THREE.CylinderGeometry(radTop, radBott, h, radSeg);
    var material = new THREE.MeshBasicMaterial({
        color: 0x75485E
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.castShadow = true;
    //mesh.receiveShadow = true;

    return mesh;
}


function update(renderer, scene, camera, controls) {
    renderer.render(
        scene,
        camera
    ); // call renderer function on render using scene+camera

    //rotate plane animation
    // var plane = scene.getObjectByName('plane-1');
    // plane.rotation.y += 0.001;
    // plane.rotation.z += 0.001;

    controls.update();

    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls);
    })
}


init();