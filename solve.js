import { Rubik } from './rubik.js';
import { IdealizedRubik } from './idealizedRubik.js';
import { PriorityQueue } from './PriorityQueue.js';
import { ClosedSet } from './ClosedSet.js';
import { Cubie } from './cubie.js';
import { Score } from './score.js';

// optional parameters
const BREAK_POINT = 1000;
const ATTACH_TO_WINDOW = false;
const cubeSize = 3;
const turnScore = 1;
const locationScore = 1;
const closeScore = 0.8;
const nearScore = 0.15;
const correctNeighborScore = .6;
const loneCubiePenalty = -6;
const lonePairPenalty = 0;	// remember that this gets doubled
const scoreWeight = 1;	// bigger is less impactful
const maxMoves = 5;

// important values
const endRubik = IdealizedRubik.solution(cubeSize);
let perfectScore = getScore(endRubik).score;

function solve(r) {
	console.log('/----- solve -----/');
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
	let openSet = new PriorityQueue(rubik => rubik.f);	// 'proper' heuristic
	// let openSet = new PriorityQueue(rubik => -rubik.score); // intuition
	let closedSet = new ClosedSet();
	if (ATTACH_TO_WINDOW) {
		window.openSet = openSet;
		window.closedSet = closedSet;
	}
	
	// get started
	let startRubik = new IdealizedRubik(r);
	openSet.push(startRubik);
	
	// set a starting score -> you get no points for your starting position
	const startScore = getScore(startRubik).score;
	startRubik.score = 0;
	perfectScore = getScore(endRubik).score - startScore;
	console.log(`perfect score = ${perfectScore}`);
	
	// while open set is not empty
	while(openSet.size()) {
		// console.log('// ---- new cube ---- //');
		
		//find the lowest f aka highest score
		let current = openSet.pop();
		// console.log(current);
		// let nearBy = openSet.getClose();
		// console.log(nearBy);
		
		// if (closedSet.size % 10 == 0) {
		// console.log(`score = ${current.score} g = ${current.g} h = ${current.h} f = ${current.f}`);
			// console.log(openSet.size(), closedSet.size);
		// }
		
		if (current.g > gWatermark)
			gWatermark = current.g;
		
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
		current.addNeighbors();
		current.neighbors.forEach(neighbor => {
			// set score
			neighbor.score = getScore(neighbor).score - startScore;
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
			let addIt = true;
			let other = null;
			openSet.forEach(rubik => {
				result = rubik.equals(neighbor);
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

			// set g
			neighbor.g = g;
			
			// set h
			neighbor.h = perfectScore - neighbor.score;

			// set f
			neighbor.f = neighbor.g + neighbor.h * scoreWeight;
			
			// set cameFrom
			neighbor.previousRubik = current;
			
			// add it to the open set
			openSet.push(neighbor);
		});
		
		// escape if it's taking too long
		if (closedSet.size == BREAK_POINT)
			break;
	}
	
	// print performance results
	if (!solveEnd) {
		solveEnd = performance.now();
		console.log(`Could not find solution`);
	}
	console.log(openSet.size(), closedSet.size);
	console.log(`most moves tried= ${gWatermark}`);
	console.log(`solve run time = ${solveEnd-solveStart}`);
	// console.log(`equals run time = ${equalTime}`);
	// console.log(`open operations run time = ${openOperationsTime}`);
	// console.log(`closed operations run time = ${closedOperationsTime}`);
	// console.log(`adds = ${adds} removes = ${removes} accesses = ${access}`);
	
	//html nonsense
	document.getElementById("done").style.display = "block";
	document.getElementById("solving").style.display = "none";
	
	// attempt to force garbage collection
	let hello = "hello";
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
	// if (A && B && C && cubie.normal.x && !cubie.index.y && !cubie.index.z)
		// score++;
	
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
	// if (correctDistances == undefined) {
		// debugger;
	// }
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



export {solve, getScore};