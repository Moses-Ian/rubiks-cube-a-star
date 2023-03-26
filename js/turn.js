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
		console.log(this.direction);
		this.framesLeft = turnFrames;
		return this;
	}
}

class TurnList {
	constructor(algo=null) {
		this.algo = algo;
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
	
	getPath() {
		let list = this.list.map(turn => {
			return { previousTurn: turn }
		});
		list[0].algorithm = this.algo;
		return list;
	}
}

/*class Algorithm {
	constructor(algo) {
		// a string such as RLrl
		this.algo = algo;
	}
	
	// shit everything is flipped capitalization
	toTurnList(R, U) {
		let {r, u, L, l, D, d, F, f, K, k} = Algorithm.getFaces(R, U);
		
		// could probably be optimized with some regex bs
		let algo = this.algo
		algo = algo
			.replaceAll('R', R)
			.replaceAll('r', r)
			.replaceAll('L', L)
			.replaceAll('l', l)
			.replaceAll('U', U)
			.replaceAll('u', u)
			.replaceAll('D', D)
			.replaceAll('d', d)
			.replaceAll('F', F)
			.replaceAll('f', f)
			.replaceAll('K', K)
			.replaceAll('k', k);

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
*/


export { Turn, TurnList, turnSpeed, turnFrames, frontFace };//, algorithm1, Algorithm };