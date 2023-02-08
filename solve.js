import { Rubik } from './rubik.js';
import { IdealizedRubik } from './idealizedRubik.js';

// optional parameters
const ATTACH_TO_WINDOW = true;
const cubeSize = 3;
const turnScore = 1;

// important values
const endRubik = IdealizedRubik.solution(cubeSize);
const perfectScore = getScore(endRubik);
console.log(`perfect score = ${perfectScore}`);

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
		
		//find the lowest f aka highest score
		//if we have a lot of cubes in the openset, this should be priority queue
		let current = openSet[0];
		let index = 0;
		openSet.forEach((rubik, i) => {
			if (rubik.f < current.f) {
				current = rubik;
				index = i;
			}
		});
		
		console.log(`current score = ${current.score}`);
		
		// check whether we're done
		if (current.equals(endRubik)) {
			
			// show the path
			showThePath(r, current);
			
			console.log('done');
			return;
		}
		
		// move it to the other set
		openSet.splice(index, 1);
		closedSet.push(current);
		
		// create neighbors
		current.addNeighbors();
		current.neighbors.forEach(neighbor => {
			// if it's already in the closed set, leave
			for(let i=0; i<closedSet.length; i++)
				if (closedSet[i].equals(neighbor))
					return;
			
			// set g score
			let g = current.g + turnScore;
			for(let i=0; i<openSet.length; i++)
				if (openSet[i].equals(neighbor))
					if (g > openSet[i].g)
						return;
					else
						break;
			neighbor.g = g;
			
			// set score
			neighbor.score = getScore(neighbor);
			neighbor.h = perfectScore - neighbor.score;

			// set f
			neighbor.f = neighbor.g + neighbor.h;
			// neighbor.f = -neighbor.score;
			
			// set cameFrom
			neighbor.previousRubik = current;


			
			
			
			// add it to the open set
			openSet.push(neighbor);
			
			
			
			
		});
		
		// validate that neighbors got added correctly
		// current.neighbors.forEach(n => {
			// for(let i=0; i<3; i++)
				// for(let j=0; j<3; j++)
					// for(let k=0; k<3; k++) {
						// console.log(n.cube[i][j][k].index);
						// console.log(n.cube[i][j][k].normal);
					// }
		// });
		
		
		
		
		console.log(openSet.length, closedSet.length);
		
		
		i++;
		if (i == 8)
			break;
	}
	
}

function getScore(current) {
	let score = 0;
	for(let i=0; i<3; i++)
		for(let j=0; j<3; j++)
			for(let k=0; k<3; k++)
				score += getCubieScore(current, i, j, k);
	return score;
}

function getCubieScore(current, i, j, k) {
	let off = current.offset;
	let cubie = current.cube[i][j][k];
	let score = 0;
	
	// for now, keep it simple
	if (cubie.index.x == i-off && cubie.index.y == j-off && cubie.index.z == k-off)
		score++;
	// if (cubie.normal.x == 1 && cubie.index.y == 0 && cubie.index.z == 0)
		// score++;
	return score;
}

function showThePath(r, current) {
	// create the move set
	let path = [];
	let temp = current;
	do {
		path.push(temp);
		temp = temp.previousRubik;
	}while(temp);
	
	// execute the moves
	r.executeMoves(path);
}

export {solve};