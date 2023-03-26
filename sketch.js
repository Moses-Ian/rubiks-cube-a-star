import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import * as dat from 'three/addons/dat.gui.module.js';
import { Rubik } from './rubik.js';
import { Turn } from './turn.js';
// import { algorithm1, Algorithm ) from './turn.js';
import { solve, getScore, checkLocalMax, showThePath } from './solve.js';
import { IdealizedRubik } from './IdealizedRubik.js';
import { Score } from './score.js';

let width = 400;
let height = 400;
let oldScore = -1;

// create html objects
let score = new Score();
let keys = Object.keys(score);
let keyElements = keys.map(key => {
	let p = document.createElement('p');
	p.id = key;
	p.style.display = 'none';
	document.body.appendChild(p);
	return p;
});

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
	Solve: () => solve(rubik),
	Algorithm1: () => {
		// my test code
		let algo = 'RLdrlFRLDDrlKRLDDrlfRLDrlk';
		let algorithm = new Algorithm(algo);
		let tl = algorithm.toTurnList('x', 'y');
		tl.start(rubik);
	},
	SolveAlgorithm1: () => {
		let algo = 'RLdrlFRLDDrlKRLDDrlfRLDrlk'.split('').reverse().join('');
		let current = new IdealizedRubik(rubik);
		current.previousTurn = new Algorithm(algo).toTurnList('x', 'y');
		debugger;
		showThePath(rubik, current);
	},
	Debug: () => {
		keyElements.forEach(p => {
			p.style.display = p.style.display == 'none' ? 'block' : 'none'
		});
	}
};

gui.add(options, 'Shuffle');
gui.add(options, 'Solve');
// gui.add(options, 'Algorithm1');
// gui.add(options, 'SolveAlgorithm1');
gui.add(options, 'Debug');

// define the animation loop
function animate() {
	requestAnimationFrame( animate );
	
	// do things
	rubik.updateFrame();
	
	// get the score
	let ideal = new IdealizedRubik(rubik)
	let score = getScore(ideal);
	ideal.score = score.score;
	ideal.neighbors.forEach(neighbor => neighbor.score = getScore(neighbor).score);
	if (score.score != oldScore) {
		keys.forEach(key => 
			document.getElementById(key).innerHTML = `${key} = ${score[key]}`
		);
	}
	oldScore = score.score;
	
	renderer.render( scene, camera );
}

// attach key controls
document.onkeydown = e => {
	rubik.initTurn(e.key);
}


// start the animation
animate();