import {Rubik, len} from './rubik.js';
import {Cubie} from './cubie.js';

class IdealizedRubik {
	constructor(rubik) {
		// parameters
		let cubeSize = rubik.cube.length;
		let offset = (cubeSize-1)/2;
		
		// create the cube
		this.cube = new Array(cubeSize);
		for(let i=0; i<cubeSize; i++) {
			this.cube[i] = new Array(cubeSize);
			for(let j=0; j<cubeSize; j++) {
				this.cube[i][j] = new Array(cubeSize);
				for(let k=0; k<cubeSize; k++) {
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
}

export {IdealizedRubik};