import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { Rubik } from './rubik.js';
import { Turn } from './turn.js';

let width = 400;
let height = 400;

let turn = new Turn();

// create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

// create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xAAAAAA );

// set camera position
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
camera.position.z = 50;
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// add a cube
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
let rubik = new Rubik();
rubik.addToScene(scene);

// define the animation loop
function animate() {
	requestAnimationFrame( animate );
	
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;	
	// rubik.rotate();
	// do things
	if (turn.framesLeft > 0) {
		switch (turn.direction) {
			case 'x':
				rubik.turn(turn.direction, turn.index);
				break;
			case 'y':
				rubik.turn(turn.direction, turn.index);
				break;
			case 'z':
				rubik.turn(turn.direction, turn.index);
				break;
		}
		turn.framesLeft--;
		if (turn.framesLeft == 0)
			rubik.updateCube();
	}

	
	renderer.render( scene, camera );
}

// attach key controls
document.onkeydown = e => {
	if (turn.framesLeft > 0)
		return;
	if (e.key == ',') {
		turn = new Turn('y', 1);
		return;
	}
	if (e.key == 'o') {
		turn = new Turn('y', -1);
		return;
	}
	if (e.key == 'a') {
		turn = new Turn('x', -1);
		return;
	}
	if (e.key == 'e') {
		turn = new Turn('x', 1);
		return;
	}
	if (e.key == 'p') {
		turn = new Turn('z', -1);
		return;
	}
	if (e.key == 'u') {
		turn = new Turn('z', 1);
		return;
	}
		
}


// start the animation
animate();