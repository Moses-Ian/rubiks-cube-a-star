// https://www.youtube.com/watch?v=6JxvKfSV9Ns
// the rootList and children should be a linked list, but i can't be assed to learn how to implent those too

class PriorityQueue {
	constructor(getValue) {
		this.smallest = null;
		this.smallestIndex = null;
		this.rootList = [];
		this.getValue = getValue;	// a function
	}
	
	pop() {
		// prepare smallest value for returning
		let result = this.smallest.item;
		
		// remove the smallest from the root list
		this.rootList.splice(this.smallestIndex, 1);
		
		// add the children to the root list
		this.rootList.concat(this.smallest.children);
		
		// find the new smallest
		if (!this.rootList.length) {
			this.smallest = null;
			this.smallestIndex = null;
			return result;
		}
		
		let smallestValue = this.rootList[0].value;
		let smallestIndex = 0;
		this.rootList.forEach((node, index) => {
			if (node.value < smallestValue) {
				smallestValue = node.value;
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
		return this.smallest.item;
	}
	
	push(item) {
		let newNode = new Node(item, this.getValue(item));
		
		// add it to the root list
		this.rootList.push(newNode);
		
		// update the pointer if this element is smaller
		if (this.smallest == null || newNode.value < this.smallest.value) {
			this.smallest = newNode;
			this.smallestIndex = this.rootList.length-1;
		}
		
		console.log('push: ' + this.smallest.toString(true));
	}
	
	toString() {
		if (!this.rootList.length)
			return 'empty';
		let result = "";
		for(let i=0; i<this.rootList.length; i++) {
			result += this.rootList[i].toString(i == this.smallestIndex);
			if (i < this.rootList.length-1)
				result += " - ";
		}

		return result;
	}
}

class Node {
	constructor(item, value, parent=null) {
		this.item = item;
		this.value = value;
		this.parent = null;
		this.children = [];
	}
	
	toString(smallest=false) {
		if (smallest)		
			return `{${this.value}}`;
		return `(${this.value})`;
	}
}

export { PriorityQueue };