// If I'm really concerned about memory usage, I can make this mostly static too

import * as THREE from 'three';
import { Box } from './box.js';

let cubeSize = 3;	// must be odd
let cube = new Array(cubeSize);
let len = 10;
let offset = (cubeSize - 1) / 2;
let turnFrames = 30;
let turnSpeed;	

class Rubik {
	constructor() {
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
	
	turn(direction, index) {
		switch (direction) {
			case 'x':
				this.turnX(index);
				break;
			case 'y':
				this.turnY(index);
				break;
			case 'z':
				this.turnZ(index);
				break;
			case '-x':
				this.turnNegX(index);
				break;
			case '-y':
				this.turnNegY(index);
				break;
			case '-z':
				this.turnNegZ(index);
				break;
		}
	}
	
	turnX(index) {
		this.forEach('turnX', index);
	}
	
	turnY(index) {
		this.forEach('turnY', index);
	}
	
	turnZ(index) {
		this.forEach('turnZ', index);
	}

	turnNegX(index) {
		this.forEach('turnNegX', index);
	}
	
	turnNegY(index) {
		this.forEach('turnNegY', index);
	}
	
	turnNegZ(index) {
		this.forEach('turnNegZ', index);
	}

	// rounds things so that they don't drift out of position
	updateCube() {
		this.forEach('update');
	}
	
	forEach(fun, index) {
		for(let i=0; i<cubeSize; i++) 
			for(let j=0; j<cubeSize; j++) 
				for(let k=0; k<cubeSize; k++) 
					Box[fun].call(this.cube[i][j][k], index);
	}

}

export {Rubik};