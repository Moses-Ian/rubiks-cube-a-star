import { Rubik } from './rubik.js';
import { IdealizedRubik } from './idealizedRubik.js';
import { PriorityQueue } from './PriorityQueue.js';
import { ClosedSet } from './ClosedSet.js';

// optional parameters
const BREAK_POINT = 2000;
const ATTACH_TO_WINDOW = false;
const cubeSize = 3;
const turnScore = 1;
const locationScore = 1;
const closeScore = 0.5;
const nearScore = 0.25;
const scoreWeight = 1;	// bigger is less impactful

// important values
const endRubik = IdealizedRubik.solution(cubeSize);
let perfectScore = getScore(endRubik);

function solve(r) {
	console.log('/----- solve -----/');
	let solveStart = performance.now();
	let solveEnd;
	let equalTime = 0;
	let openOperationsTime = 0;
	let closedOperationsTime = 0;
	let start;
	let end;
	
	let adds = 0;
	let removes = 0;
	let access = 0;
	
	// create the sets
	let openSet = new PriorityQueue(rubik => rubik.f);
	let closedSet = new ClosedSet();
	if (ATTACH_TO_WINDOW) {
		window.openSet = openSet;
		window.closedSet = closedSet;
	}
	
	// get started
	let startRubik = new IdealizedRubik(r);
	start = performance.now();
	openSet.push(startRubik);
	end = performance.now();
	openOperationsTime += end-start;
	adds++;
	
	// set a starting score -> you get no points for your starting position
	const startScore = getScore(startRubik);
	// startRubik.score = startScore;
	perfectScore = getScore(endRubik) - startScore;
	console.log(`perfect score = ${perfectScore}`);
	
	// while open set is not empty
	while(openSet.size()) {
		
		//find the lowest f aka highest score
		//if we have a lot of cubes in the openset, this should be priority queue
		// let current = openSet[0];
		// access++;
		// let index = 0;
		// openSet.forEach((rubik, i) => {
			// if (rubik.f < current.f) {
				// current = rubik;
				// index = i;
			// }
			// access++;
		// });
		start = performance.now();
		let current = openSet.pop();
		end = performance.now();
		openOperationsTime += end-start;
		removes++;
		
		// if (closedSet.size % 10 == 0) {
			// console.log(`score = ${current.score} g = ${current.g} f = ${current.f}`);
			// console.log(openSet.size(), closedSet.size);
		// }
		
		// check whether we're done
		start = performance.now();
		let result = current.equals(endRubik);
		end = performance.now();
		equalTime += end-start;
		if (result) {
			solveEnd = performance.now();
			
			// show the path
			showThePath(r, current);
			
			console.log('done');
			break;
		}
		
		// move it to the other set
		// start = performance.now();
		// openSet.splice(index, 1);
		// end = performance.now();
		// openOperationsTime += end-start;
		// removes++;
		
		start = performance.now();
		closedSet.add(current);
		end = performance.now();
		closedOperationsTime += end-start;
		
		// create neighbors
		current.addNeighbors();
		current.neighbors.forEach(neighbor => {
			// if it's already in the closed set, leave
			// for(let i=0; i<closedSet.length; i++) {
				// start = performance.now();
				// result = closedSet[i].equals(neighbor);
				// end = performance.now();
				// closedOperationsTime += end-start;
				// if (result)
					// return;
			// }
			start = performance.now();
			let result = closedSet.has(neighbor);
			end = performance.now();
			closedOperationsTime += end-start;
			if (result)
				return;
			
			// set g score
			let g = current.g + turnScore;
			// check every element in the queue's underlying heap and compare it
			// for(let i=0; i<openSet.size(); i++) {
				// start = performance.now();
				// result = openSet._hashTable[i].equals(neighbor);
				// end = performance.now();
				// openOperationsTime += end-start
				// access++;
				// if (result) {
					// access++;
					// if (g > openSet._hashTable[i].g) 
						// return;
					// else
						// break;
				// }
			// }
			let addIt = true;
			let other = null;
			openSet.forEach(rubik => {
				result = rubik.equals(neighbor);
				access++;
				if (result) {
					if (g >= rubik.g) 
						addIt = false;
					else
						other = rubik;
				}
			});
			
			// if we don't add it, get out of here
			if (!addIt)
				return;
			
			// we got here faster than the other did -> remove the other
			if (other != null)
				openSet.remove(other);

			neighbor.g = g;
			
			// set score
			neighbor.score = getScore(neighbor) - startScore;
			neighbor.h = perfectScore - neighbor.score;

			// set f
			neighbor.f = neighbor.g + neighbor.h * scoreWeight;
			// neighbor.f = -neighbor.score;
			
			// set cameFrom
			neighbor.previousRubik = current;


			
			
			
			// add it to the open set
			start = performance.now();
			openSet.push(neighbor);
			end = performance.now();
			openOperationsTime += end-start;
			adds++;
			
			
			
			
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
		
		
		
		
		
		
		if (closedSet.size == BREAK_POINT)
			break;
	}
	if (!solveEnd) {
		solveEnd = performance.now();
		console.log(`Could not find solution`);
	}
	console.log(openSet.size(), closedSet.size);
	console.log(`solve run time = ${solveEnd-solveStart}`);
	console.log(`equals run time = ${equalTime}`);
	console.log(`open operations run time = ${openOperationsTime}`);
	console.log(`closed operations run time = ${closedOperationsTime}`);
	console.log(`adds = ${adds} removes = ${removes} accesses = ${access}`);
	
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
	
	//store as bools
	const A = cubie.index.x == i-off;
	const B = cubie.index.y == j-off;
	const C = cubie.index.z == k-off;
	const a = !A;
	const b = !B;
	const c = !C;
	
	// for now, keep it simple
	// if spots are in the right location, add a point
	if ( A && B && C )
		score += locationScore;
	// if (cubie.normal.x == 1 && cubie.index.y == 0 && cubie.index.z == 0)
		// score++;
	// if two spots are in, add half a point
	if ((A && B && c) || (A && b && C) || (a && B && C))
		score += closeScore;
	// if one spot is in, add a quarter points
	if ((A && b && c) || (a && B && c) || (a && b && C))
		score += nearScore;
	
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
	path.reverse();

	console.log('/----- Best Path -----/');
	path.forEach(cube => console.log(`score = ${cube.score} f = ${cube.f}`));
	
	
	// execute the moves
	r.executeMoves(path);
}



export {solve};