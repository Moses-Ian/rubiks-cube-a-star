class Fun {
	constructor() {
		this.map = new Map();
	}
	
	forEach(f) {
		return this.map.forEach((value, key) => f.call(this, key));
	}
}


let fun = new Fun();

fun.map.set(1, 'a');
fun.map.set(2, 'b');
fun.map.set(3, 'c');

let f = item => console.log(item);

fun.forEach(f);