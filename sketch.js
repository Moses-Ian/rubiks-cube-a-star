let width = 400;
let height = 400;

// create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

// add a cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// set camera position
camera.position.z = 5;

// define the animation loop
function animate() {
	requestAnimationFrame( animate );
	
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;	
	
	renderer.render( scene, camera );
}

// start the animation
animate();