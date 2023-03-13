// If I'm really concerned about memory usage, I can make this mostly static too

import * as THREE from 'three';
import { Box } from './box.js';
import { Turn, turnFrames } from './turn.js';

const cubeSize = 3;	// must be odd
const cube = new Array(cubeSize);
const len = 10;
const offset = (cubeSize - 1) / 2;
const MILLIS_PER_FRAME = 25;
const shuffleMoves = 10;

// key dictionary
const turns = new Object();	// for example:
turns['a'] = new Turn('x'); // L
turns['e'] = new Turn('a'); // R
turns[','] = new Turn('y'); // U
turns['o'] = new Turn('b'); // D
turns['p'] = new Turn('c'); // B
turns['u'] = new Turn('z'); // F
turns['A'] = new Turn('X'); // L'
turns['E'] = new Turn('A'); // R'
turns['<'] = new Turn('Y'); // U'
turns['O'] = new Turn('B'); // D'
turns['P'] = new Turn('C'); // B'
turns['U'] = new Turn('Z'); // F'

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
		this.runTurn(turns[key]);
	}
	
	runTurn(turnObject) {		
		if (this.currentTurn.framesLeft > 0)
			return;
		this.currentTurn = turnObject?.start() || this.currentTurn;
	}
	
	turn(direction) {
		this.forEach(`turn_${direction}`);
	}
	
	// rounds things so that they don't drift out of position
	updateCube() {
		this.forEach('update');
	}
	
	forEach(fun) {
		for(let i=0; i<cubeSize; i++) 
			for(let j=0; j<cubeSize; j++) 
				for(let k=0; k<cubeSize; k++) 
					Box[fun].call(this.cube[i][j][k]);
	}

	shuffle() {
		let shuffleInterval = setInterval(() => {
			let key = Object.keys(turns)[Math.floor(Math.random() * 12)];
			this.initTurn(key);
		}, turnFrames * MILLIS_PER_FRAME);
		setTimeout(
			() => clearTimeout(shuffleInterval), 
			turnFrames * MILLIS_PER_FRAME * shuffleMoves
		);
	}	

	executeMoves(moveList) {
		moveList.forEach(({ previousTurn:move }, index) => 
			setTimeout(
				() => this.runTurn(move),
				index * turnFrames * MILLIS_PER_FRAME
			)
		);
	}

	updateFrame() {
		if (this.currentTurn.framesLeft > 0) {
			this.turn(this.currentTurn.direction);
			this.currentTurn.framesLeft--;
			if (this.currentTurn.framesLeft == 0)
				this.updateCube();
		}
	}
}

export {Rubik, len};