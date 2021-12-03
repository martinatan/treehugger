
function init () {
    // init Scene object
    var scene = new THREE.Scene();

    var box = getBox(1, 1, 1);
    var plane = getPlane(5, 4);

    //test grabbing plane by name to rotate in update fxn
    plane.name = 'plane-1';

    box.position.y = box.geometry.parameters.height/2;
    plane.rotation.x = Math.PI/2;
    
    // add meshes to scene
    scene.add(box);
    scene.add(plane);

    // init PerspectiveCamera object
    var camera =  new THREE.PerspectiveCamera(
        45, //field of view
        window.innerWidth/window.innerHeight, //aspect ratio
        1, //near clipping plane
        1000 //far clipping plane
    );

    //re position camera angle
    camera.position.x = 1;
    camera.position.y = 2;    
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // init Renderer object
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('webgl').appendChild(renderer.domElement);
    update(renderer, scene, camera)
};

function getBox(w, h, d) {
    // load tree surface as texture
    // const treeTexture = new THREE.TextureLoader().load('assets/textures/TreehuggerSurface_for_web.png');
    // const material = new THREE.MeshBasicMaterial( { map: treeTexture } );

    // test making a box mesh from geo + material
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshBasicMaterial({
        color: 0x0000ff
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}

function getPlane(w, d) {
    // load tree surface as texture
    // const treeTexture = new THREE.TextureLoader().load('assets/textures/TreehuggerSurface_for_web.png');
    // const material = new THREE.MeshBasicMaterial( { map: treeTexture } );

    // test making a box mesh from geo + material
    var geometry = new THREE.PlaneGeometry(w, d);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}


function update(renderer, scene, camera) {
    renderer.render(
        scene,
        camera
    ); // call renderer function on render using scene+camera

    //rotate plane animation
    var plane = scene.getObjectByName('plane-1');
    plane.rotation.y += 0.001;
    plane.rotation.z += 0.001;

    requestAnimationFrame(function() {
        update(renderer, scene, camera);
    })
}


init();