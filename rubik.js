import * as THREE from 'three';
import { Box } from './box.js';

let cubeSize = 3;	// must be odd
let cube = new Array(cubeSize);
let len = 10;
let offset = (cubeSize - 1) / 2;
let turnFrames = 30;
let turnSpeed;	

let space = 10;



class Rubik {
	constructor() {
		// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// const material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
		// this.cube = new THREE.Mesh( geometry, material );
		// this.box = new Box(0, 0, 0, 0, 0, 0, 10);
		// create the cube
		this.cube = new Array(cubeSize);
		for(let i=0; i<cubeSize; i++) {
			this.cube[i] = new Array(cubeSize);
			for(let j=0; j<cubeSize; j++) {
				this.cube[i][j] = new Array(cubeSize);
				for(let k=0; k<cubeSize; k++) {
					this.cube[i][j][k] = new Box(
						(i-offset)*len, (j-offset)*len, (k-offset)*len, 
						i-offset, j-offset, k-offset, 
						len
					);
				}
			}
		}
	}
	
	addToScene(scene) {
		for(let i=0; i<cubeSize; i++) 
			for(let j=0; j<cubeSize; j++) 
				for(let k=0; k<cubeSize; k++) 
					this.cube[i][j][k].addToScene(scene);
	}
	
	rotate() {
		// this.cube.rotation.x += 0.01;
		// this.cube.rotation.y += 0.01;	
	}
}

export {Rubik};