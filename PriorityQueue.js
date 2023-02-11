// https://www.youtube.com/watch?v=6JxvKfSV9Ns
// the rootList and children should be a linked list, but i can't be assed to learn how to implent those too

class PriorityQueue {
	constructor(getValue) {
		this._smallest = null;
		this._smallestIndex = null;
		this._rootList = [];
		this._hashTable = new Map();
		this.getValue = getValue;	// a function
	}
	
	pop() {
		// prepare _smallest value for returning
		let result = this._smallest.item;
		
		// remove the _smallest from the root list
		this._rootList.splice(this._smallestIndex, 1);
		
		// remove the _smallest from the hash table
		this._hashTable.delete(result);
		
		// add the children to the root list
		this._rootList = this._rootList.concat(this._smallest.children);
		this._smallest.children.forEach(child => child.parent = null);
		
		// start the clean up phase
		this._cleanUp();
		
		// find the new _smallest
		if (!this._rootList.length) {
			this._smallest = null;
			this._smallestIndex = null;
			return result;
		}
		
		let _smallestValue = this._rootList[0].value;
		let _smallestIndex = 0;
		this._rootList.forEach((node, index) => {
			if (node.value < _smallestValue) {
				_smallestValue = node.value;
				_smallestIndex = index;
			}
		});
		
		// set the new _smallest
		this._smallest = this._rootList[_smallestIndex];
		this._smallestIndex = _smallestIndex;
		
		// return the _smallest
		return result;
	}
	
	peek() {
		return this._smallest.item;
	}
	
	push(item) {
		let newNode = new Node(item, this.getValue(item));
		
		// add it to the root list
		this._rootList.push(newNode);
		
		// add it to the hash table
		this._hashTable.set(item, newNode);
		
		// update the pointer if this element is smaller
		if (this._smallest == null || newNode.value < this._smallest.value) {
			this._smallest = newNode;
			this._smallestIndex = this._rootList.length-1;
		}
		
	}
	
	remove(item) {
		let node = this._hashTable.get(item);
		
		// if we're removing the _smallest, we need to pop it instead
		if (node == this._smallest)
			return this.pop();
		
		// remove it from the hash table
		this._hashTable.delete(item);
		
		// add the children to the root list
		this._rootList = this._rootList.concat(node.children);
		node.children.forEach(child => child.parent = null);
		
		// remove this node from the parent's list of children
		let parent = node.parent;
		let index = parent.children.indexOf(node);
		parent.children.splice(index, 1);
		
		// and mark the parent...
		if (!parent.marked)
			parent.marked = true;
		else
			// if the parent was already marked, we have to cut it out
			this._cutOut(parent);		
	}
	
	toString() {
		if (!this._rootList.length)
			return 'empty';
		let result = "";
		for(let i=0; i<this._rootList.length; i++) {
			result += this._rootList[i].toString(i == this._smallestIndex);
			if (i < this._rootList.length-1)
				result += " - ";
		}

		return result;
	}

	forEach(f) {
		// runs the given function on each of the keys of the hash table
		// which is each of the items in the priority queue
		return this._hashTable.forEach((value, key) => f.call(this, key));
	}

	_cleanUp() {
		// sparse array
		let degreeArray = [];
		
		// add each tree to the degreeArray
		this._rootList.forEach(tree => this._addTree(tree, degreeArray));
		
		// condense the sparse array
		this._rootList = Object.values(degreeArray);
	}
	
	_addTree(tree, degreeArray) {
			// if there's no tree in this slot, we can simply insert it here
			if (degreeArray[tree.degree()] == null) {
				degreeArray[tree.degree()] = tree;
				return;
			}
			
			// if there is a tree in this slot...
			// ...pull the other one out of the array...
			let other = degreeArray[tree.degree()];
			
			// ...be sure to delete the key from the object, or else things go haywire...
			delete degreeArray[tree.degree()];

			// ...and merge them
			tree = this._mergeTrees(tree, other);
			
			// recursively add it
			this._addTree(tree, degreeArray);
	}
	
	_mergeTrees(a, b) {
		// make sure a < b
		if (a.value > b.value) {
			let temp = a;
			a = b;
			b = temp;
		}
		
		// attach b to a
		b.parent = a;
		a.children.push(b);
		
		// return the top node
		return a;
	}
	
	_cutOut(node) {
		// since it was cut out, we can reset the mark
		node.marked = false;
		
		// add it to the root list
		this._rootList.push(node);
		
		// remove this node from the parent's list of children
		let parent = node.parent;
		let index = parent.children.indexOf(node);
		parent.children.splice(index, 1);
		
		// and mark the parent...
		if (!parent.marked)
			parent.marked = true;
		else
			// if the parent was already marked, we have to cut it out
			this._cutOut(parent);		
	}
}

class Node {
	constructor(item, value, parent=null) {
		this.item = item;
		this.value = value;
		this.parent = null;
		this.children = [];
	}
	
	degree() {
		return this.children.length;
	}
	
	toString(_smallest=false) {
		if (_smallest)		
			return `{${this.value}}`;
		return `(${this.value})`;
	}
}

export { PriorityQueue };