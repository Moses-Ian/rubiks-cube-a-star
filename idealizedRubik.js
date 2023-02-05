import {Rubik, len} from './rubik.js';
import {Cubie} from './cubie.js';

const cubeSize = 3;

class IdealizedRubik {
	constructor(rubik) {
		// each cube has a value function
		this.f = 0;
		this.g = 0;
		this.h = 0;
		
		if (rubik == null) 
			return;
		
		// parameters
		this.cubeSize = rubik.cube.length;
		let offset = (this.cubeSize-1)/2;
		
		// create the cube
		this.cube = new Array(this.cubeSize);
		for(let i=0; i<this.cubeSize; i++) {
			this.cube[i] = new Array(this.cubeSize);
			for(let j=0; j<this.cubeSize; j++) {
				this.cube[i][j] = new Array(this.cubeSize);
				for(let k=0; k<this.cubeSize; k++) {
					let box = rubik.cube[i][j][k];
					this.cube[i][j][k] = new Cubie(
						//indexes
						box.index.x, box.index.y, box.index.z,
						//rotation
						box.rotation.x, box.rotation.y, box.rotation.z
					);
				}
			}
		}
		
		console.log(this.cube);
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
						//indexes
						i-offset, j-offset, k-offset,
						//rotation
						0, 0, 0
					);
				}
			}
		}
		
		solutionRubik.cube = cube;
		solutionRubik.cubeSize = cubeSize;
		solutionRubik.offset = offset;
		
		return solutionRubik;
	}
	
	equals(other) {
		for(let i=0; i<this.cubeSize; i++)
			for(let j=0; j<this.cubeSize; j++)
				for(let k=0; k<this.cubeSize; k++) 
					if (!this.cube[i][j][k].equals(other.cube[i][j][k]))
						return false;
		return true;
	}
}

export {IdealizedRubik};