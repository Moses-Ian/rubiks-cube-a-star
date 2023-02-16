// I should REALLY consider making a lot of this static

import {Rubik, len} from './rubik.js';
import {Cubie} from './cubie.js';
import { Turn } from './turn.js';

// optional parameters
const cubeSize = 3;

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
		
		// do more things
		switch (turn.direction) {
			case 'x':
				rubik.turnX(turn.index);
				break;
			case 'y':
				rubik.turnY(turn.index);
				break;
			case 'z':
				rubik.turnZ(turn.index);
				break;
			case '-x':
				rubik.turnNegX(turn.index);
				break;
			case '-y':
				rubik.turnNegY(turn.index);
				break;
			case '-z':
				rubik.turnNegZ(turn.index);
				break;
		}
		return rubik;
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
	
}

export {IdealizedRubik};