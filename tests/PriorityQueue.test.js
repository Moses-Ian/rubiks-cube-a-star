import { PriorityQueue } from '../PriorityQueue.js';

class Item {
	constructor(score) {
		this.score = score;
	}
}

let valueFunc = item => item.score;

let pq = new PriorityQueue(valueFunc)

// test 1
let correctResults = [
	'(15) - (35) - {13} - (21) - (18)',
	'{15} - (35) - (21) - (18)',
	'(35) - (21) - {18}',
	'(35) - {21}',
	'{35}',
	'empty'
];

let actualResults = [];

console.log(pq.toString());

let A = new Item(15);
let B = new Item(35);
let C = new Item(13);
let D = new Item(21);
let E = new Item(18);

pq.push(A);
pq.push(B);
pq.push(C);
pq.push(D);
pq.push(E);

console.log(pq.toString());

pq.pop();
pq.pop();

console.log(pq);

pq.forEach(item => console.log(item));