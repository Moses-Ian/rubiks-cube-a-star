// this ONLY works for closed sets filled with idealizedRubiks

class ClosedSet {
	constructor() {
		this._map = new Map();
		this.size = 0;
	}
	
	add(rubik) {
		// get the array associated with this cube's score
		let score = rubik.score;
		let arr = this._map.get(score);
		
		// if there is no array, create one
		if (arr == undefined) {
			arr = new Array(0);
			this._map.set(score, arr);
		}
		
		// if there is an array, add the rubik to it
		arr.push(rubik);		
		
		// increment the size
		this.size++;
	}
	
	has(rubik) {
		// get array associated with this cube's score
		let score = rubik.score;
		let arr = this._map.get(score);
		
		// if there is no array, then the closed set doesn't have the cube
		if (arr == undefined)
			return false;
		
		// check whether the array has this cube
		for(let i=0; i<arr.length; i++) {
			if (arr[i].equals(rubik))
				return true;
		}
		return false;
		
	}
}

export { ClosedSet };