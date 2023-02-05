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
let rubik = new Rubik();
rubik.addToScene(scene);

// key dictionary
let turns = new Object();
turns[','] = new Turn('y',   1);
turns['o'] = new Turn('y',  -1);
turns['a'] = new Turn('x',  -1);
turns['e'] = new Turn('x',   1);
turns['p'] = new Turn('z',  -1);
turns['u'] = new Turn('z',   1);
turns['<'] = new Turn('-y',  1);
turns['O'] = new Turn('-y', -1);
turns['A'] = new Turn('-x', -1);
turns['E'] = new Turn('-x',  1);
turns['P'] = new Turn('-z', -1);
turns['U'] = new Turn('-z',  1);

// define the animation loop
function animate() {
	requestAnimationFrame( animate );
	
	// do things
	if (turn.framesLeft > 0) {
		rubik.turn(turn.direction, turn.index);
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
	turn = turns[e.key]?.start() || turn;
}


// start the animation
animate();