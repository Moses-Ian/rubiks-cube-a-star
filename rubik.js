import * as THREE from 'three';
import { Box } from './box.js';

class Rubik {
	constructor() {
		// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// const material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
		// this.cube = new THREE.Mesh( geometry, material );
		this.box = new Box(0, 0, 0, 0, 0, 0, 10);
	}
	
	addToScene(scene) {
		// scene.add(this.cube);
		this.box.addToScene(scene);
	}
	
	rotate() {
		// this.cube.rotation.x += 0.01;
		// this.cube.rotation.y += 0.01;	
	}
}

export {Rubik};