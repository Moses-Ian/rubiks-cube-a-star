// I should REALLY consider making a lot of this static

import {Rubik, len} from './rubik.js';
import {Cubie} from './cubie.js';
import { Turn } from './turn.js';

// optional parameters
const cubeSize = 3;

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

class IdealizedRubik {
	constructor(rubik) {
		// each cube has a value function
		this.score = 0;		// better score == closer to ideal cube
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.neighbors = [];
		this.previousRubik = null;
		this.previousTurn = null;
		this.moveCount = 0;
		
		if (rubik == null) 
			return;
		
		// parameters
		this.cubeSize = rubik.cube.length;
		this.offset = (this.cubeSize-1)/2;
		
		// create the cube
		this.cube = new Array(this.cubeSize);
		for(let i=0; i<this.cubeSize; i++) {
			this.cube[i] = new Array(this.cubeSize);
			for(let j=0; j<this.cubeSize; j++) {
				this.cube[i][j] = new Array(this.cubeSize);
				for(let k=0; k<this.cubeSize; k++) {
					let box = rubik.cube[i][j][k];
					this.cube[i][j][k] = new Cubie(
						//refs
						i, j, k,
						//indexes
						box.index.x, box.index.y, box.index.z,
						//normal
						box.normal.x/len, box.normal.y/len, box.normal.z/len
					);
				}
			}
		}
	}
	
	static solution(cubeSize) {
		let solutionRubik = new IdealizedRubik();
		
		// parameters
		// let cubeSize = cubeSize;
		let offset = (cubeSize-1)/2;
		
		// create the cube
		let cube = new Array(cubeSize);
		for(let i=0; i<cubeSize; i++) {
			cube[i] = new Array(cubeSize);
			for(let j=0; j<cubeSize; j++) {
				cube[i][j] = new Array(cubeSize);
				for(let k=0; k<cubeSize; k++) {
					cube[i][j][k] = new Cubie(
						//refs
						i, j, k,
						//indexes
						i-offset, j-offset, k-offset,
						//normal
						1, 0, 0
					);
				}
			}
		}
		
		solutionRubik.cube = cube;
		solutionRubik.cubeSize = cubeSize;
		solutionRubik.offset = offset;
		
		return solutionRubik;
	}
	
	// checking if they're equal, in the sense that they have the blocks in the same place
	equals(other, log) {
		for(let i=0; i<this.cubeSize; i++)
			for(let j=0; j<this.cubeSize; j++)
				for(let k=0; k<this.cubeSize; k++) 
					if (!this.cube[i][j][k].equals(other.cube[i][j][k], log))
						return false;
		return true;
	}
	
	// checking priority, where we compare f values
	static comparePriority(a, b) {
		return a.f < b.f;
	}
	
	// for each turn that can be made, create a new idealized rubik and add it to the list of neighbors
	addNeighbors(depth) {
		// add the neighbors
		this.neighbors = [];
		Object.keys(turns).forEach(key => 
			this.neighbors.push(this.fromTurn(turns[key]))
		);
		
		// go deeper
		depth--;
		if (depth > 0)
			this.neighbors.forEach(neighbor => neighbor.addNeighbors(depth));
	}
	
	// does not turn THIS cube
	// it creates a new cube that is a copy of this one, turns and returns THAT one
	fromTurn(turn) {
		let rubik = this.copy();
		rubik.previousTurn = turn;
		
		rubik.forEach(`turn_${turn.direction}`);
		
		return rubik;
	}
	
	// does not turn THIS cube
	fromTurnList(turnList) {
		let rubik = this.copy();
		
		
		
		return rubik;
	}
	
	forEach(fun, index) {
		for(let i=0; i<cubeSize; i++) 
			for(let j=0; j<cubeSize; j++) 
				for(let k=0; k<cubeSize; k++) 
					Cubie[fun].call(this.cube[i][j][k], index);
	}
	
	copy() {
		let rubik = new IdealizedRubik();
		let cubeSize = this.cubeSize;
		let offset = this.offset;
		
		let cube = new Array(cubeSize);
		for(let i=0; i<cubeSize; i++) {
			cube[i] = new Array(cubeSize);
			for(let j=0; j<cubeSize; j++) {
				cube[i][j] = new Array(cubeSize);
				for(let k=0; k<cubeSize; k++) {
					let c = this.cube[i][j][k];
					cube[i][j][k] = new Cubie(
						// refs
						i, j, k,
						//indexes
						c.index.x, c.index.y, c.index.z,
						//normal
						c.normal.x, c.normal.y, c.normal.z
					);
				}
			}
		}
		
		rubik.cube = cube;
		rubik.cubeSize = cubeSize;
		rubik.offset = offset;
		
		return rubik;
	}
	
	getPath() {
		// create the move set
		let path = [];
		let temp = this;
		do {
			path.push(temp);
			temp = temp.previousRubik;
		}while(temp);
		path.reverse();
		
		return path;
	}
	
}

export {IdealizedRubik};