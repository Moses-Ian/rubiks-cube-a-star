// https://www.youtube.com/watch?v=6JxvKfSV9Ns
// the rootList and children should be a linked list, but i can't be assed to learn how to implent those too

class PriorityQueue {
	constructor(getValueOf) {
		this._smallest = null;
		this._smallestIndex = null;
		this._rootList = [];
		this._hashTable = new Map();
		this.getValueOf = getValueOf;	// a function
	}
	
	pop() {
		// debugger;
		this._smallest.operations.push('pop');
		if (this._smallest.hasMultiplePops()) 
			throw new hasMultiplePopsException(this._smallest);
		
		// get the orphaned child nodes
		let children = this._smallest.children;
		
		// one by one, but them in the root list
		children.forEach(child => this._moveToRoot(child));
		
		// get the item from the smallest node
		let item = this._smallest.item;
		
		// remove the node from the root list
		this._rootList.splice(this._smallestIndex, 1);
		
		// remove the node from the heap
		this._hashTable.delete(item);
		
		// clean up
		this._cleanUp();
		
		// find the new minimum
		this._updateSmallest();

		// debugger;
	}
	
	peek() {
		return this._smallest.item;
	}
	
	push(item) {
		// create the node
		let newNode = new Node(item, this.getValueOf(item));
		newNode.operations.push('push');
		
		// add the new node to the root list
		this._rootList.push(newNode);
		
		// add it to the hash table
		this._hashTable.set(item, newNode);
		
		// check whether this element is smaller than the current element
		if (this._smallest == null || newNode.value < this._smallest.value) {
			this._smallest = newNode;
			this._smallestIndex = this._rootList.length-1;
		}
	}
	
	remove(item) {
		// debugger;
		let node = this._hashTable.get(item);
		node.operations.push('remove');
		
		// add the children to the root list one by one
		let children = node.children;
		children.forEach(child => this._moveToRoot(child));
		
		// maintain a reference to the parent
		let parent = node.parent;
		
		// if parent is null, the node was in the root list
		// remove it from there
		if (parent == null) 
			this._rootList.splice(this._rootList.indexOf(node), 1);
		else {
			// remove the parent's reference to it
			parent.children.splice(parent.children.indexOf(node), 1);
		
			// mark the parent, or cut it out if necessary
			if (!parent.marked)
				parent.marked = true;
			else
				this._cutOut(parent);
		}
		
		// delete its own reference to its parent
		node.parent = null;
		
		// remove it from the hash table
		this._hashTable.delete(item);
		
		this._updateSmallest();
		
		// debugger;
	}
	
	toString() {
		throw new Error('Not implemented');
	}

	forEach(f) {
		// runs the given function on each of the keys of the hash table
		// which is each of the items in the priority queue
		return this._hashTable.forEach((value, key) => f.call(this, key));
	}
	
	size() {
		return this._hashTable.size;
	}

	_cleanUp() {
		let degreeArray = [];
		
		// add the trees to an intermediate array based on degree
		this._rootList.forEach(tree => this._addTree(tree, degreeArray));

		// condense the sparse array
		this._rootList = Object.values(degreeArray);
	}
	
	_addTree(tree, degreeArray) {
		tree.operations.push('addTree');
		
		let degree = tree.degree();
		
		// if the spot is empty, add the tree to array in that spot
		if (degreeArray[degree] == null) {
			degreeArray[degree] = tree;
			return;
		}
		
		// if the spot is not empty
		// get the other
		let other = degreeArray[degree];
		
		// delete that key from degreeArray
		delete degreeArray[degree];
		
		// merge the trees
		let newTree = this._mergeTrees(tree, other);
		
		// add the new tree to degreeArray
		this._addTree(newTree, degreeArray);
	}
	
	_mergeTrees(a, b) {
		// make sure a is the smaller one
		if (a.value > b.value)
			return this._mergeTrees(b, a);
		
		a.operations.push('mergeTrees A');
		b.operations.push('mergeTrees B');
		
		// set b's parent to a
		b.parent = a;
		
		// add b to a's children
		a.children.push(b);
		
		// return the root node
		return a;
	}
	
	_cutOut(node) {
		node.operations.push('cutOut');
		node.marked = false;
	
		// if we try to cut out a root node, bail
		if (node.parent == null) {
			console.log('tried to cut out a root node');
			return;
		}
		
		// maintain a reference to the parent
		let parent = node.parent;
		
		// move the node to the root list
		this._moveToRoot(node);
		
		// mark the parent, or cut it out if necessary
		if (!parent.marked)
			parent.marked = true;
		else
			this._cutOut(parent);
	}

	_moveToRoot(node) {
		node.operations.push('moveToRoot');
		
		let siblings = node.parent.children;

		// remove the node from the parent's list of children
		siblings.splice(siblings.indexOf(node), 1);
		
		// remove the parent from the node
		node.parent = null;
		
		// attach the node to the root list
		this._rootList.push(node);
	}

	_updateSmallest() {
		let smallestIndex = 0;
		for (let i=0; i<this._rootList.length; i++)
			if (this._rootList[i].value < this._rootList[smallestIndex].value)
				smallestIndex = i;
		this._smallestIndex = smallestIndex;
		this._smallest = this._rootList[smallestIndex];
	}
	
	// just for testing
	// removes a random element from the heap
	removeRandom() {
		let index = Math.floor(Math.random() * this._hashTable.size);
		let key = Array.from(this._hashTable.keys())[index];
		this.remove(key);
	}
}

class Node {
	constructor(item, value) {
		this.item = item;
		this.value = value;
		this.marked = false;
		this.parent = null;
		this.children = [];
		this.operations = []
	}
	
	degree() {
		return this.children.length;
	}
	
	toString(_smallest=false) {
		throw new Error('Not implemented');
	}
	
	hasMultiplePops() {
		let popCount = 0;
		this.operations.forEach(op => popCount += op == 'pop' ? 1 : 0);
		return popCount > 1;
	}
	
}

function hasMultiplePopsException(node) {
	this.message = 'Popped object has been popped multiple times';
	this.node = node;
}

export { PriorityQueue };