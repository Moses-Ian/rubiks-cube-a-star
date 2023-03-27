import * as THREE from 'three';
import { Box } from './box.js';
import { Turn, turnFrames } from './turn.js';

const cubeSize = 3;	// must be odd
const cube = new Array(cubeSize);
const len = 10;
const offset = (cubeSize - 1) / 2;
const MILLIS_PER_FRAME = 25;
const shuffleMoves = 8;

// key dictionary
const turnsDvorak = new Object();	// for example:
turnsDvorak['a'] = new Turn('x'); // L
turnsDvorak['e'] = new Turn('a'); // R
turnsDvorak[','] = new Turn('y'); // U
turnsDvorak['o'] = new Turn('b'); // D
turnsDvorak['p'] = new Turn('c'); // B
turnsDvorak['u'] = new Turn('z'); // F
turnsDvorak['A'] = new Turn('X'); // L'
turnsDvorak['E'] = new Turn('A'); // R'
turnsDvorak['<'] = new Turn('Y'); // U'
turnsDvorak['O'] = new Turn('B'); // D'
turnsDvorak['P'] = new Turn('C'); // B'
turnsDvorak['U'] = new Turn('Z'); // F'

const turnsQwerty = new Object();
turnsQwerty['a'] = new Turn('x'); // L
turnsQwerty['d'] = new Turn('a'); // R
turnsQwerty['w'] = new Turn('y'); // U
turnsQwerty['s'] = new Turn('b'); // D
turnsQwerty['r'] = new Turn('c'); // B
turnsQwerty['f'] = new Turn('z'); // F
turnsQwerty['A'] = new Turn('X'); // L'
turnsQwerty['D'] = new Turn('A'); // R'
turnsQwerty['W'] = new Turn('Y'); // U'
turnsQwerty['S'] = new Turn('B'); // D'
turnsQwerty['R'] = new Turn('C'); // B'
turnsQwerty['F'] = new Turn('Z'); // F'

let turns;

// handle the scheme switch
const toggleSwitch = document.getElementById('checkbox');
const instructionsElement = document.getElementById('control-instructions');

const setScheme = scheme => {
	if (scheme == 'dvorak') {
		turns = turnsDvorak;
		toggleSwitch.checked = true;
		instructionsElement.innerHTML = 'Turn the sides with , a o e p u';
		turns = turnsDvorak;
		localStorage.setItem('control-scheme', 'dvorak');
	} else {
		turns = turnsQwerty;
		toggleSwitch.checked = false;
		instructionsElement.innerHTML = 'Turn the sides with w a s d r f';
		turns = turnsQwerty;
		localStorage.setItem('control-scheme', 'qwerty');
	}
}

const switchControlScheme = e => {
	if ( e.target.checked )
		setScheme('dvorak');
	else
		setScheme('qwerty');
};

toggleSwitch.addEventListener('change', switchControlScheme);
setScheme(localStorage.getItem('control-scheme'));

class Rubik {
	constructor() {
		console.log(document.controlScheme);
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
		
		// the key for the previous shuffle
		this.previousKey = null;
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
			let key;
			do {
				key	= Object.keys(turns)[Math.floor(Math.random() * 12)];
			} while (key == this.previousKey);
			this.previousKey = this.toggleCase(key);
			this.initTurn(key);
		}, turnFrames * MILLIS_PER_FRAME);
		setTimeout(
			() => clearTimeout(shuffleInterval), 
			turnFrames * MILLIS_PER_FRAME * shuffleMoves
		);
	}	
	
	toggleCase(key) {
		// handle , and <
		if (key == ',')
			return '<';
		if (key == '<')
			return ',';

		// handle other keys
		let lower = key.toLowerCase();
		if (lower == key) 
			return key.toUpperCase();
		return lower;
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