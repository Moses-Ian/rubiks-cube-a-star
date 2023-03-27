//------Time Trials--------//
// operations - priority queue - basic array - ratio
//          1 - 0.224999994039 - 0.006400004 - 35.156226935
//         10 - 0.361299991607 - 0.111999988 - 3.2258931118
//        100 - 1.324299991130 - 6.732899993 - 0.1966908750
//       1000 - 6.958099991083 - 386.4852000 - 0.0180035354
//      10000 - 54.58910000324 - 39973.01529 - 0.0013656487

import { PriorityQueue } from './PriorityQueue.js';

const valueRange = 100;
const operations = 10000;

class Item {
	constructor(score) {
		this.score = score;
	}
	
	equals(item) {
		return this.score == item.score;
	}
}

let test = () => {
	let valueFunc = item => item.score;
	// let hashFunc = item => Math.floor(item.score);
	let hashFunc = item => Math.floor(item.score * 31.62);

	let pq = new PriorityQueue({ 
		getValueOf: valueFunc,
		// hash: hashFunc
	})

	let start = performance.now();

	// priority queue
	for(let j=0; j<operations; j++) {
		for(let i=0; i<10000; i++) {
			pq.push(new Item(Math.random() * valueRange));
		}
	}
	
	let item = new Item(Math.random() * valueRange);
	pq.push(item);
	
	let count;
	count = 0;
	for(let j=0; j<operations; j++) {
		let result = pq.find(item);
		if (result != null)
			count++;
	}
	
	let end = performance.now();
	let pqTime = end-start;

	console.log(`pq runtime=  ${pqTime}`);
	console.log(`count = ${count}`);

	let pqHash = new PriorityQueue({ 
		getValueOf: valueFunc,
		hash: hashFunc
	})

	start = performance.now();

	// priority queue with hash
	for(let j=0; j<operations; j++) {
		for(let i=0; i<10000; i++) {
			pqHash.push(new Item(Math.random() * valueRange));
		}
	}
	
	item = new Item(Math.random() * valueRange);
	pqHash.push(item);
	
	count = 0;
	for(let j=0; j<operations; j++) {
		let result = pqHash.find(item);
		if (result != null)
			count++;
	}

	end = performance.now();
	let pqHashTime = end-start;

	console.log(`pqHash runtime=  ${pqHashTime}`);
	console.log(`count = ${count}`);
	console.log(`queueSize= ${pqHash.size} hashSize= ${pqHash._hashTable.size}`);

	console.log(`ratio= ${pqHashTime/pqTime}`);
};

document.getElementById("start-test").addEventListener("click", test);