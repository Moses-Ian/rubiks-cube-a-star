import { Rubik } from './rubik.js';
import { IdealizedRubik } from './idealizedRubik.js';

// optional parameters
const ATTACH_TO_WINDOW = true;
const cubeSize = 3;

// important values
const endRubik = IdealizedRubik.solution(cubeSize);

function solve(r) {
	console.log('solve');
	
	// create the sets
	let openSet = [];
	let closedSet = [];
	if (ATTACH_TO_WINDOW) {
		window.openSet = openSet;
		window.closedSet = closedSet;
	}
	
	// get started
	let startRubik = new IdealizedRubik(r);
	openSet.push(startRubik);
	
	// escape!
	let i=0;

	// while open set is not empty
	while(openSet.length) {
		
		//find the lowest f
		//if we have a lot of cubes in the openset, this should be priority queue
		let lowestRubik = openSet[0];
		let index = 0;
		openSet.forEach((rubik, i) => {
			if (rubik.f < lowestRubik.f) 
				lowestRubik = rubik;
				index = i;
		});
		
		if (lowestRubik.equals(endRubik)) {
			console.log('done');
		}
		
		openSet.splice(index, 1);
		closedSet.push(lowestRubik);
		
		lowestRubik.addNeighbors();
		
		// validate that neighbors got added correctly
		// lowestRubik.neighbors.forEach(n => {
			// for(let i=0; i<3; i++)
				// for(let j=0; j<3; j++)
					// for(let k=0; k<3; k++) {
						// console.log(n.cube[i][j][k].index);
						// console.log(n.cube[i][j][k].normal);
					// }
		// });
		
		i++;
		if (i == 1)
			break;
	}
	
}

export {solve};