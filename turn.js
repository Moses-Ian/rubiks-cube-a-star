const turnFrames = 10;
const turnSpeed = Math.PI/2 / turnFrames;
const MILLIS_PER_FRAME = 25;

const directions = [
	'x', 
	'X', 
	'y', 
	'Y', 
	'z', 
	'Z', 
	'a', 
	'A', 
	'b', 
	'B', 
	'c', 
	'C'
];

const oppositeFace = {
	'x': 'a',
	'y': 'b',
	'z': 'c',
	'a': 'x',
	'b': 'y',
	'c': 'z'
}

const frontFace = {
	'xy': 'z',
	'xc': 'y',
	'xb': 'c',
	'xz': 'b',
	'yx': 'c',
	'yz': 'x',
	'ya': 'z',
	'yc': 'a',
	'zx': 'y',
	'zb': 'x',
	'za': 'b',
	'zy': 'a',
	'ab': 'z',
	'ac': 'b',
	'ay': 'c',
	'az': 'y',
	'bx': 'z',
	'bc': 'x',
	'ba': 'c',
	'bz': 'a',
	'cx': 'b', 
	'cy': 'x',
	'ca': 'y',
	'cb': 'a'
}

class Turn {
	constructor(direction = null) {
		this.direction = direction;
		this.framesLeft = 0;
	}
	
	start() {
		this.framesLeft = turnFrames;
		return this;
	}
}

class TurnList {
	constructor(algo=null) {
		if (algo == null) {
			this.list = [];
			return;
		}
		
		this.list = algo.split('').map(item => new Turn(item));
	}
	
	start(rubik) {
		this.list.forEach((turn, index) =>
			setTimeout(
				() => rubik.runTurn(turn),
				index * turnFrames * MILLIS_PER_FRAME
			)
		)	
	}
	
	push(direction) {
		this.list.push(new Turn(direction));
	}
	
	// static shuffle(numberOfTurns) {
		// let tl = new TurnList();
		// tl.list = new Array(numberOfTurns);
		// tl.list.forEach(item => {
			// let index = Math.floor(Math.random() * directions.length);
			// item = new Turn(directions[index]);
		// });
		
	// }
}

class Algorithm {
	constructor(algo) {
		// a string such as RLrl
		// 'back' needs to be K or k (for negative)
		this.algo = algo;
	}
	
	// shit everything is flipped capitalization
	toTurnList(R, U) {
		let {r, u, L, l, D, d, F, f, K, k} = Algorithm.getFaces(R, U);
		console.log(R, r, U, u, L, l, D, d, F, f, K, k);
		
		
		console.log(this.algo);
		let algo = this.algo
		algo = algo.replaceAll('R', R);
		algo = algo.replaceAll('r', r);
		algo = algo.replaceAll('L', L);
		algo = algo.replaceAll('l', l);
		algo = algo.replaceAll('U', U);
		algo = algo.replaceAll('u', u);
		algo = algo.replaceAll('D', D);
		algo = algo.replaceAll('d', d);
		algo = algo.replaceAll('F', F);
		algo = algo.replaceAll('f', f);
		algo = algo.replaceAll('K', K);
		algo = algo.replaceAll('k', k);
		console.log(algo);

		let tl = new TurnList(algo);
		
		return tl;
		
		
		
	}
	
	static getFaces(R, U) {
		// R and U are strings such as 'x' and 'a'
		let r = R.toUpperCase();
		let u = U.toUpperCase();
		let L = oppositeFace[R];
		let l = L.toUpperCase();
		let D = oppositeFace[U];
		let d = D.toUpperCase();
		
		let RU = R + U;
		let F = frontFace[RU];
		let f = F.toUpperCase();
		let K = oppositeFace[F];
		let k = K.toUpperCase();
		
		return {r, u, L, l, D, d, F, f, K, k};
	}
}

const algorithm1 = new TurnList();
algorithm1.push('x');
algorithm1.push('y');
algorithm1.push('z');



export { Turn, turnSpeed, turnFrames, algorithm1, Algorithm };