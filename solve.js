import { Rubik } from './rubik.js';
import { IdealizedRubik } from './idealizedRubik.js';

function solve(r) {
	console.log('solve');
	let rubik = new IdealizedRubik(r);
}

export {solve};