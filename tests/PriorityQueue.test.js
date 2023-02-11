//------Time Trials--------//
// operations - priority queue - basic array - ratio
//          1 - 0.224999994039 - 0.006400004 - 35.156226935
//         10 - 0.361299991607 - 0.111999988 - 3.2258931118
//        100 - 1.324299991130 - 6.732899993 - 0.1966908750
//       1000 - 6.958099991083 - 386.4852000 - 0.0180035354
//      10000 - 54.58910000324 - 39973.01529 - 0.0013656487

import { PriorityQueue } from '../PriorityQueue.js';

class Item {
	constructor(score) {
		this.score = score;
	}
}

let valueFunc = item => item.score;

let pq = new PriorityQueue(valueFunc)

const operations = 10000;

let start = performance.now();

// priority queue
for(let j=0; j<operations; j++) {
	for(let i=0; i<12; i++) {
		pq.push(new Item(Math.random() * 10000));
	}
	pq.pop();
}

let end = performance.now();
let pqTime = end-start;

console.log(`pq runtime=  ${pqTime}`);


let arr = [];
start = performance.now();

// basic array
for(let j=0; j<operations; j++) {
	for(let i=0; i<12; i++) {
		arr.push(new Item(Math.random() * 10000));
	}

	let smallestIndex = 0;
	for(let index=0; index<arr.length-1; index++) {
		if (arr[index] < arr[smallestIndex])
			smallestIndex = index;
	}
	arr.splice(smallestIndex, 1);
}

end = performance.now();
let arrTime = end-start;

console.log(`arr runtime= ${arrTime}`);

console.log(`ratio= ${pqTime/arrTime}`);
