// If I'm really concerned about memory usage, I can make this mostly static too

import * as THREE from 'three';
import { Box } from './box.js';
import { Turn, turnFrames } from './turn.js';

const cubeSize = 3;	// must be odd
const cube = new Array(cubeSize);
const len = 10;
const offset = (cubeSize - 1) / 2;
const MILLIS_PER_FRAME = 25;
const shuffleMoves = 50;

// key dictionary
const turns = new Object();
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

		// create the turn object
		this.currentTurn = new Turn();
	}
	
	addToScene(scene) {
		for(let i=0; i<cubeSize; i++) 
			for(let j=0; j<cubeSize; j++) 
				for(let k=0; k<cubeSize; k++) 
					this.cube[i][j][k].addToScene(scene);
	}

	initTurn(key) {
		if (this.currentTurn.framesLeft > 0)
			return;
		this.currentTurn = turns[key]?.start() || this.currentTurn;
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

	async shuffle() {
		let shuffleInterval = setInterval(() => {
			let key = Object.keys(turns)[Math.floor(Math.random() * 12)];
			this.initTurn(key);
		}, turnFrames * MILLIS_PER_FRAME);
		setTimeout(
			() => clearTimeout(shuffleInterval), 
			turnFrames * MILLIS_PER_FRAME * shuffleMoves
		);
		
		
	}	

	updateFrame() {
		if (this.currentTurn.framesLeft > 0) {
			this.turn(this.currentTurn.direction, this.currentTurn.index);
			this.currentTurn.framesLeft--;
			if (this.currentTurn.framesLeft == 0)
				this.updateCube();
		}
	}
}

export {Rubik, len};