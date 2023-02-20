import { Rubik } from './rubik.js';
import { IdealizedRubik } from './idealizedRubik.js';
import { PriorityQueue } from './PriorityQueue.js';
import { ClosedSet } from './ClosedSet.js';
import { Cubie } from './cubie.js';
import { Score } from './score.js';

// optional parameters
const BREAK_POINT = 10000;
const ATTACH_TO_WINDOW = false;
const cubeSize = 3;
const turnScore = 5.5;	// average h difference is ~13.4. I wonder if that's going to be relevant?
const locationScore = 1;
const closeScore = 0.8;
const nearScore = 0.15;
const correctNeighborScore = .6;
const orientationScore = 1;
const relativeOrientationScore = 1;
const wrongRelativeOrientationPenalty = 1;
const loneCubiePenalty = -1;
const loneCubieCloseScore = 1;
const lonePairPenalty = 0;	// remember that this gets doubled
const localMaximumPenalty = 10;
const scoreWeight = 1;	// bigger -> broader
const maxMoves = 50;

// important values
const endRubik = IdealizedRubik.solution(cubeSize);
let perfectScore = getScore(endRubik).score;
let openSet;
let closedSet;
let startScore;
let bestCube;
let useAlgorithms = false;

function solve(r) {
	console.log('/----- solve -----/');
	console.log(`use algorithms= ${useAlgorithms}`);
	//html nonsense
	document.getElementById("done").style.display = "none";
	document.getElementById("solving").style.display = "block";
	
	let solveStart = performance.now();
	let solveEnd;
	let equalTime = 0;
	let openOperationsTime = 0;
	let closedOperationsTime = 0;
	let start;
	let end;
	let gWatermark = 0;
	
	let adds = 0;
	let removes = 0;
	let access = 0;
	
	// create the sets
	openSet = new PriorityQueue(rubik => rubik.f);	// 'proper' heuristic
	// let openSet = new PriorityQueue(rubik => -rubik.score); // intuition
	closedSet = new ClosedSet();
	if (ATTACH_TO_WINDOW) {
		window.openSet = openSet;
		window.closedSet = closedSet;
	}
	
	// get started
	let startRubik = new IdealizedRubik(r);
	openSet.push(startRubik);
	
	// set a starting score -> you get no points for your starting position
	startScore = getScore(startRubik).score;
	perfectScore = getScore(endRubik).score - startScore;
	startRubik.score = startScore;
	startRubik.g = 0;
	startRubik.h = perfectScore;
	startRubik.f = startRubik.g + startRubik.h * scoreWeight;
	bestCube = startRubik;
	console.log(`perfect score = ${perfectScore}`);
	
	// while open set is not empty
	while(openSet.size()) {
		// console.log('// ---- new cube ---- //');
		
		//find the lowest f aka highest score
		let current = openSet.pop();
		// console.log(current);
		
		// if (closedSet.size % 10 == 0) {
			// console.log(`score = ${current.score} g = ${current.g} h = ${current.h} f = ${current.f}`);
			// console.log(openSet.size(), closedSet.size);
		// }
		
		if (current.g > gWatermark)
			gWatermark = current.g;
		
		// compare to the best so far
		if (current.score > bestCube.score)
			bestCube = current;
		
		// check whether we're done
		let result = current.equals(endRubik);
		if (result) {
			solveEnd = performance.now();
			
			// show the path
			showThePath(r, current);
			
			console.log('done');
			break;
		}
		
		// move it to the other set
		closedSet.add(current);
		
		// create neighbors
		// look one space ahead
		if (current.neighbors.length == 0) {
			if (useAlgorithms)
				current.addNeighborsWithAlgorithms();
			current.addNeighbors(1);
		}
		current.neighbors.forEach(neighbor => setNeighborScore(neighbor, current));
		
		// look two spaces ahead
		// current.addNeighbors(2);
		// current.neighbors.forEach(neighbor => {
			// setNeighborScore(neighbor, current);
			// neighbor.neighbors.forEach(n => setNeighborScore(n, neighbor));
		// });
		
		// look three spaces ahead
		// current.addNeighbors(3);
		// current.neighbors.forEach(neighbor => {
			// setNeighborScore(neighbor, current);
			// neighbor.neighbors.forEach(n => {
				// setNeighborScore(neighbor, current);
				// neighbor.neighbors.forEach(n => setNeighborScore(n, neighbor));
			// });
		// });
		
		// check whether I'm a local maximum
		let { localMax } = checkLocalMax(current);
		// if i am, just add neighbors 2 levels deep
		// if (localMax && !current.equals(startRubik)) {
			// console.log('local max true');
			// go ahead and just add all of the neighbors nearby
			// current.neighbors.forEach(neighbor => neighbor.addNeighbors(2));
			// current.neighbors.forEach(neighbor => {
				// setNeighborScore(neighbor, current);
				// neighbor.neighbors.forEach(n => {
					// setNeighborScore(neighbor, current);
					// neighbor.neighbors.forEach(n => setNeighborScore(n, neighbor));
				// });
			// });
			
			// instead of that, remove all those neighbors so we don't get stuck in a 'hilly' area
			// current.neighbors.forEach(neighbor => openSet.remove(neighbor));
		// }
		
		// escape if it's taking too long
		if (closedSet.size == BREAK_POINT) {
			showThePath(r, bestCube);
			break;
		}
	}
	
	// print performance results
	if (!solveEnd) {
		solveEnd = performance.now();
		console.log(`Could not find solution`);

		// check whether we're where we started
		if (bestCube.equals(startRubik)) {
			console.log("start using algorithms!");
			useAlgorithms = true;
		}
			
	}
	console.log(openSet.size(), closedSet.size);
	console.log(`most moves tried= ${gWatermark / turnScore}`);
	console.log(`solve run time = ${solveEnd-solveStart}`);
	// console.log(`equals run time = ${equalTime}`);
	// console.log(`open operations run time = ${openOperationsTime}`);
	// console.log(`closed operations run time = ${closedOperationsTime}`);
	// console.log(`adds = ${adds} removes = ${removes} accesses = ${access}`);
	
	//html nonsense
	document.getElementById("done").style.display = "block";
	document.getElementById("solving").style.display = "none";
	
	// attempt to force garbage collection
	openSet = null;
	closedSet = null;
	let hello = "hello";
}

function setNeighborScore(neighbor, current) {
	// set score
	neighbor.score = getScore(neighbor).score;
	// console.log(neighbor);

	// if it's already in the closed set, leave
	let result = closedSet.has(neighbor);
	// console.log(result);
	if (result)
		return;
	
	// set g score
	let g = current.g + turnScore;
	
	// get out if it's too many moves
	if (g > maxMoves)
		return;
	
	// check every element in the queue's underlying heap and compare it
	// let addIt = true;
	// let other = null;
	// openSet.forEach(rubik => {
		// result = rubik.equals(neighbor);
		// if (result) {
			// if (g >= rubik.g) 
				// addIt = false;
			// else
				// other = rubik;
		// }
	// });
	
	// if we don't add it, get out of here
	// if (!addIt)
		// return;
	
	// we got here faster than the other did -> remove the other
	// if (other != null)
		// openSet.remove(other);

	// set g
	neighbor.g = g;
	
	// set h
	neighbor.h = perfectScore - (neighbor.score - startScore);

	// set f
	neighbor.f = neighbor.g + neighbor.h * scoreWeight;
	
	// set cameFrom
	neighbor.previousRubik = current;
	
	// add it to the open set
	openSet.push(neighbor);
}

function getScore(current) {
	let score = new Score();
	for(let i=0; i<3; i++)
		for(let j=0; j<3; j++)
			for(let k=0; k<3; k++)
				score.merge(getCubieScore(current, i, j, k));
	
	// we have to account for the lonePairs being erroneously doubled
	score.lonePairs /= 2.0;
	
	return score;
}

function getCubieScore(current, i, j, k) {
	let off = current.offset;
	let cubie = current.cube[i][j][k];
	
	if (cubie.i != i || cubie.j != j || cubie.k != k) {
		debugger;
	}
	
	
	let score = new Score();
	
	//store as bools
	const A = cubie.index.x == i-off;
	const B = cubie.index.y == j-off;
	const C = cubie.index.z == k-off;
	const a = !A;
	const b = !B;
	const c = !C;
	
	// if spots are in the right location, add a point
	if ( A && B && C ) {
		score.score += locationScore;
		score.cubiesInCorrectPosition++;
	}

	// if spots are one move away, add half a point
	if (cubie.type == 'corner') {
		if ((A && B && c) || (A && b && C) || (a && B && C)) {
			score.score += closeScore;
			score.cubieClose++;
		}
	}
	else if (cubie.type == 'edge') {
		if ((A && b && c) || (a && B && c) || (a && b && C)) {
			score.score += closeScore;
			score.cubieClose++;
		}
	}
			
	// if spots are two moves away, add a quarter point
	if (cubie.type == 'corner') {
		if ((A && b && c) || (a && B && c) || (a && b && C)) {
			score.score += nearScore;
			score.cubieNear++;
		}
	}
	else if (cubie.type == 'edge') {
		if ((A && B && c) || (A && b && C) || (a && B && C)) {
			score.score += nearScore;
			score.cubieNear++;
		}
	}
		
	// if spots are in the right location and orientation
	if (A && B && C && cubie.normal.x && !cubie.normal.y && !cubie.normal.z) {
		score.score += orientationScore;
		score.correctOrientation++;
	}
	
	// am i next to the correct neighbor?
	
	// get the neighbors
	let neighbors = Cubie.getNeighbors(current.cube, i, j, k);
	
	// for each neighbor, check the manhatten distance
	let distances = neighbors.map(n => 
		Math.abs(cubie.index.x - n.index.x) +
		Math.abs(cubie.index.y - n.index.y) +
		Math.abs(cubie.index.z - n.index.z)
	);
	
	let correctDistances = distances.filter(d => d == 1);
	let correctNeighbors = correctDistances.length;
	score.cubiesWithCorrectNeighbors += correctNeighbors;
	let neighborScore = correctNeighbors * correctNeighborScore;
	score.score += neighborScore;
	
	// penalize for lone cubies
	if (correctNeighbors == 0) {
		// debugger;
		score.score += loneCubiePenalty;
		score.loneCubies++;
	}
	
	// add points if the lone cubie is one move away from its correct neighbor
	if (correctNeighbors == 0) {
		let oneMoveAway = distances.filter(d => d == 3);
		score.score += loneCubieCloseScore * oneMoveAway.length;
		score.loneCubieClose += oneMoveAway.length;
	}
	
	// check for lone pairs
	// if i have only one neighbor, and that neighbor has only one neighbor
	if (correctNeighbors == 1) {
		// find that correct neighbor
		let onlyNeighborIndex = distances.indexOf(1);
		let onlyNeighbor = neighbors[onlyNeighborIndex];
		
		// get that neighbor's neighbors
		let otherNeighbors = Cubie.getNeighbors(current.cube, onlyNeighbor.i, onlyNeighbor.j, onlyNeighbor.k);
		
		// for each neighbor, check the manhatten distance
		let otherDistances = otherNeighbors.map(n => 
			Math.abs(onlyNeighbor.index.x - n.index.x) +
			Math.abs(onlyNeighbor.index.y - n.index.y) +
			Math.abs(onlyNeighbor.index.z - n.index.z)
		);
		
		// count the number of times the distance is one
		correctDistances = otherDistances.filter(d => d == 1);
		let correctDistanceCount = correctDistances.length;
		

		// if my only neighbor has exactly 1 correct neighbor
		if (correctDistanceCount == 1) {
			score.lonePairs++;
			score.score += lonePairPenalty;
		}
	}
	
	// see if i'm in the same orientation as my neighbor
	neighbors.forEach(neighbor => {
		if (
			Math.abs(cubie.index.x - neighbor.index.x) +
				Math.abs(cubie.index.y - neighbor.index.y) +
				Math.abs(cubie.index.z - neighbor.index.z) == 1 &&
			cubie.normal.x == neighbor.normal.x &&
			cubie.normal.y == neighbor.normal.y &&
			cubie.normal.z == neighbor.normal.z
		) {
			score.score += relativeOrientationScore;
			score.relativeOrientation++;
		}
	});
	
	return score;
}

function checkLocalMax(current, score={localMax: false, score: 0}) {
	// debugger;
	// localMaximumPenalty -> if all of my neighbors have a worse score than me, penalize me and them
	
	// if the neighbor array is empty, get out of here
	if (!current.neighbors.length)
		return;
	
	let localMax = true;
	current.neighbors.forEach(neighbor => {
		if (neighbor.score > current.score)
			localMax = false;
	});

	if (localMax) {
		score.localMax = true;
		score.score += localMaximumPenalty;
		current.localMax = true;
		// it's too late to punish me
		// punish the neighbors instead
		current.neighbors.forEach(neighbor => neighbor.f += localMaximumPenalty);
	}
	
	// can return null
	return score;
}

function showThePath(r, current) {
	let path = current.getPath();
	console.log('/----- Best Path -----/');
	path.forEach(cube => {
		if (cube.algorithm)
			console.log(cube.algorithm);
		if (cube.score) 
			console.log(`direction= ${cube.previousTurn?.direction} score= ${cube.score} f= ${cube.f}`);
	});
	
	
	// execute the moves
	r.executeMoves(path);
}



export {solve, getScore, checkLocalMax, showThePath};