import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import * as dat from 'three/addons/dat.gui.module.js';
import { Rubik } from './rubik.js';
import { Turn } from './turn.js';
import { solve, getScore } from './solve.js';
import { IdealizedRubik } from './IdealizedRubik.js';

let width = 400;
let height = 400;
let oldScore = 0;

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

// gui
const gui = new dat.GUI();
const options = { 
	Shuffle: () => rubik.shuffle(),
	Solve: () => solve(rubik)
};

gui.add(options,'Shuffle');
gui.add(options,'Solve');

// define the animation loop
function animate() {
	requestAnimationFrame( animate );
	
	// do things
	rubik.updateFrame();
	
	// get the score
	let score = getScore(new IdealizedRubik(rubik));
	if (score != oldScore)
		document.getElementById("score").innerHTML = `score = ${score}`;
	oldScore = score;
	
	renderer.render( scene, camera );
}

// attach key controls
document.onkeydown = e => {
	rubik.initTurn(e.key);
}


// start the animation
animate();