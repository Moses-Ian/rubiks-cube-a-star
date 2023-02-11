// https://www.youtube.com/watch?v=6JxvKfSV9Ns
// the rootList and children should be a linked list, but i can't be assed to learn how to implent those too

class PriorityQueue {
	constructor() {
		this.smallest = null;
		this.smallestIndex = null;
		this.rootList = [];
	}
	
	pop() {
		// prepare smallest value for returning
		let result = this.smallest;
		
		// remove the smallest from the root list
		this.rootList.splice(this.smallestIndex, 1);
		
		// add the children to the root list
		this.rootList.concat(this.smallest.children);
		
		// find the new smallest
		let smallestValue = this.rootList[0].value;
		let smallestIndex = 0;
		this.rootList.forEach((item, index) => {
			if (item.value < smallestValue) {
				smallestValue = item.value;
				smallestIndex = index;
			}
		});
		
		// set the new smallest
		this.smallest = this.rootList[smallestIndex];
		this.smallestIndex = smallestIndex;
		
		// return the smallest
		return result;
	}
	
	peek() {
		return this.smallest;
	}
	
	push(item) {
		// add it to the root list
		this.rootList.push(item);
		
		// update the pointer if this element is smaller
		if (item.value < this.smallest.value) {
			this.smallest = item.value;
			this.smallestIndex = this.rootList.length-1;
		}
	}
	
	toString() {
		return "this is a priority queue";
	}
}

class Node {
	constructor() {
		this.value = 9999;
		this.parent = null;
		this.children = [];
		
	}
	
	toString() {
		return `(${this.value})`;
	}
}

export { PriorityQueue };