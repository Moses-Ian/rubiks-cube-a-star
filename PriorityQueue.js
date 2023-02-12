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
		let halt = false;
		// console.log('pop');
		if (this._smallest.parent != null)
			console.log(this._smallest);
		
		this._smallest.operations.push('pop');
		
		// prepare _smallest value for returning
		let result = this._smallest.item;
		let saved = this._smallest;
		
		// remove the _smallest from the root list
		let thisIndex = this._rootList.indexOf(this._smallest);
		if (thisIndex != this._smallestIndex)
			console.log('index mismatch');
		let size = this._rootList.length;
		this._rootList.splice(this._smallestIndex, 1);
		if (this._rootList.includes(this._smallest))
			console.log(`smallest not deleted ${size} -> ${this._rootList.length}`);
			
		
		// remove the _smallest from the hash table
		if (!this._hashTable.has(result)) {
			console.log('item not in hash table');
			console.log(this._smallest);
			this._find(this._smallest);
			return true;
		}
		
		let count = this._hashTable.size;
		this._hashTable.delete(result);
		let count2 = this._hashTable.size;
		// if (count == count2)
			// console.log('not deleting from hash table');
		
		// add the children to the root list
		try {
			// if(this._smallest.children.length > 100) {
				// console.log(this._smallest);
				// console.trace();
				// return;
			// }
			this._smallest.children.forEach(child => this._moveToRoot(child));
			this._rootList.forEach(node => {
				if (node.parent != null) {
					console.log('root node still has a parent');
					halt =true;
				}
			});
			if (halt)
				return true;
		} catch (err) {
			console.log('root list:');
			console.log(this._rootList);
			console.log('smallest:');
			console.log(this._smallest);
			throw (err);
		}
		
		// start the clean up phase
		halt = this._cleanUp();
		if (halt)
			return {halt: true};
		
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
		
		if (this._find(saved)) {
			console.log(saved);
		}
		
		// return the _smallest
		return result;
	}
	
	peek() {
		return this._smallest.item;
	}
	
	push(item) {
		
		// console.log('push');
		let newNode = new Node(item, this.getValue(item));
		
		newNode.operations.push('push');
		
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
		// console.log('remove');
		let node = this._hashTable.get(item);
		
		node.operations.push('remove');
		
		// if we're removing the _smallest, we need to pop it instead
		if (node == this._smallest)
			return this.pop();
		
		// remove it from the hash table
		this._hashTable.delete(item);
		
		// add the children to the root list
		node.children.forEach(child => this._moveToRoot(child));
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
	
	size() {
		return this._hashTable.size;
	}

	_cleanUp() {
		let halt = false;
		this._rootList.forEach(tree => {
			tree.operations.push('cleanUp');
			if (tree.parent == tree) {
				console.log('it is its own parent');
				console.log(tree);
			}
			if (tree.children.length > 100) {
				console.log('too many children');
				console.log(tree);
				halt = true;
			}
		});
		if (halt)
			return true;
		
		// sparse array
		let degreeArray = [];
		
		// add each tree to the degreeArray
		this._rootList.forEach(tree => this._addTree(tree, degreeArray));
		
		// condense the sparse array
		this._rootList = Object.values(degreeArray);
		
		// clear out all the parents of the nodes in the root list
		this._rootList.forEach(node => node.parent = null);
	}
	
	_addTree(tree, degreeArray) {
		tree.operations.push('addTree');
	
		// if there's no tree in this slot, we can simply insert it here
		if (degreeArray[tree.degree()] == null || degreeArray[tree.degree()] == undefined) {
			degreeArray[tree.degree()] = tree;
			return;
		}
		
		// if there is a tree in this slot...
		// ...pull the other one out of the array...
		let other = degreeArray[tree.degree()];
		
		if (tree == other) {
			return;
			console.log('BAD THINGS ARE HAPPENING');
			// console.log(tree);
			// console.trace();
		}
		
		// ...be sure to delete the key from the object, or else things go haywire...
		let result = delete degreeArray[tree.degree()];
		if (!result)
			console.log('did not delete');

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
		
		a.operations.push('mergeTrees (A)');
		b.operations.push('mergeTrees (B)');
		
		// attach b to a
		b.parent = a;
		a.children.push(b);
		
		// return the top node
		return a;
	}
	
	_cutOut(node) {
		node.operations.push('cutOut');
		
		// since it was cut out, we can reset the mark
		node.marked = false;
		
		this._moveToRoot(node);
	}

	_moveToRoot(node) {
		// attach it to the root
		this._rootList.push(node);
		
		// unmark it
		node.marked = false;
		
		// get the parent reference
		let parent = node.parent;

		// if it has no parent, return
		if (parent == null)
			return;

		// remove it's reference to it's parent
		node.parent = null;
		
		// remove the parent's reference to it
		let index = parent.children.indexOf(node);
		parent.children.splice(index, 1);
		
		// mark the parent
		if (!parent.marked)
			parent.marked = true;
		else
			// if the parent was already marked, we have to cut it out
			this._cutOut(parent);		
	}

	_find(node) {
		console.log('trying to find it');
		for(let i=0; i<this._rootList.length; i++) {
			if (this._rootList[i] == node) {
				console.log(`it is _rootList[${i}]`);
				console.log(this._rootList[i]);
				return true;
			}
			let result = this._rootList[i].find(node);
			if (result) {
				return true;
			}
		}
	}
}

class Node {
	constructor(item, value, parent=null) {
		this.item = item;
		this.value = value;
		this.parent = null;
		this.children = [];
		this.operations = []
	}
	
	degree() {
		return this.children.length;
	}
	
	toString(_smallest=false) {
		if (_smallest)		
			return `{${this.value}}`;
		return `(${this.value})`;
	}
	
	find(node) {
		for(let i=0; i<this.children.length; i++) {
			if (this.children[i] == node) {
				return true;
			}
			let result = this.children[i].find(node);
			if (result)
				return true;
		}
	}
}

export { PriorityQueue };