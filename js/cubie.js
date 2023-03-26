import * as THREE from 'three';

const HALF_PI = Math.PI/2;
const ZERO2D = new THREE.Vector2(0, 0);
const NORMAL = new THREE.Vector3(1, 0, 0);


class Cubie {
	constructor(i, j, k, indexX, indexY, indexZ, normalX, normalY, normalZ) {
		// this works only for size 3 cube
		this.i = i;
		this.j = j;
		this.k = k;
		
		// actual values
		this.index = new THREE.Vector3(indexX, indexY, indexZ);
		this.normal = new THREE.Vector3(normalX, normalY, normalZ);
		// this is only true for size 3 cubes
		this.type;
		if (!indexX && !indexY || !indexX && !indexZ || !indexY && !indexZ)
			this.type = 'center';
		else if ((indexX + indexY + indexZ ) % 2)
			this.type = 'corner';
		else
			this.type = 'edge';
	}
	
	equals(other, log = false) {
		if (log) {
			console.log('----------')
			console.log(this.index, other.index);
			console.log(this.normal, other.normal);
		}
		if (this.index.x != other.index.x) return false;
		if (this.index.y != other.index.y) return false;
		if (this.index.z != other.index.z) return false;
		if (this.normal.x != other.normal.x) return false;
		if (this.normal.y != other.normal.y) return false;
		if (this.normal.z != other.normal.z) return false;
		return true;
	}

	static turn_x() {
		if (this.index.x == -1) {
			let temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			temp = this.normal.y;
			this.normal.x = this.normal.x;
			this.normal.y = -this.normal.z;
			this.normal.z = temp;
			
			Cubie.update.call(this);
		}	
	}
	
	static turn_y() {
		if (this.index.y == 1) {
			let temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			temp = this.normal.x;
			this.normal.x = -this.normal.z;
			this.normal.y = this.normal.y;
			this.normal.z = temp;
			
			Cubie.update.call(this);
		}
	}
	
	static turn_c() {
		if (this.index.z == -1) {
			let temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			temp = this.normal.x;
			this.normal.x = -this.normal.y;
			this.normal.y = temp;
			this.normal.z = this.normal.z;
			
			Cubie.update.call(this);
		}
	}
	
	static turn_X() {
		if (this.index.x == -1) {
			let temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			temp = this.normal.y;
			this.normal.x = this.normal.x;
			this.normal.y = this.normal.z;
			this.normal.z = -temp;
			
			Cubie.update.call(this);
		}	
			
	}
	
	static turn_Y() {
		if (this.index.y == 1) {
			let temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			temp = this.normal.x;
			this.normal.x = this.normal.z;
			this.normal.y = this.normal.y;
			this.normal.z = -temp;
			
			Cubie.update.call(this);
		}
	}
	
	static turn_C() {
		if (this.index.z == -1) {
			let temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			temp = this.normal.x;
			this.normal.x = this.normal.y;
			this.normal.y = -temp;
			this.normal.z = this.normal.z;
			
			Cubie.update.call(this);
		}
	}
	
	static turn_a() {
		if (this.index.x == 1) {
			let temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			temp = this.normal.y;
			this.normal.x = this.normal.x;
			this.normal.y = -this.normal.z;
			this.normal.z = temp;
			
			Cubie.update.call(this);
		}	
	}
	
	static turn_b() {
		if (this.index.y == -1) {
			let temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			temp = this.normal.x;
			this.normal.x = -this.normal.z;
			this.normal.y = this.normal.y;
			this.normal.z = temp;
			
			Cubie.update.call(this);
		}
	}
	
	static turn_z() {
		if (this.index.z == 1) {
			let temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			temp = this.normal.x;
			this.normal.x = -this.normal.y;
			this.normal.y = temp;
			this.normal.z = this.normal.z;
			
			Cubie.update.call(this);
		}
	}
	
	static turn_A() {
		if (this.index.x == 1) {
			let temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			temp = this.normal.y;
			this.normal.x = this.normal.x;
			this.normal.y = this.normal.z;
			this.normal.z = -temp;
			
			Cubie.update.call(this);
		}	
			
	}
	
	static turn_B() {
		if (this.index.y == -1) {
			let temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			temp = this.normal.x;
			this.normal.x = this.normal.z;
			this.normal.y = this.normal.y;
			this.normal.z = -temp;
			
			Cubie.update.call(this);
		}
	}
	
	static turn_Z() {
		if (this.index.z == 1) {
			let temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			temp = this.normal.x;
			this.normal.x = this.normal.y;
			this.normal.y = -temp;
			this.normal.z = this.normal.z;
			
			Cubie.update.call(this);
		}
	}
	
	static update() {
		this.index.round();
		this.normal.round();
	}
	
	static getNeighbors(cube, x, y, z) {
		let arr = [];
		
		if (x != 0) arr.push(cube[x-1][y][z]);
		if (x != 2) arr.push(cube[x+1][y][z]);
		if (y != 0) arr.push(cube[x][y-1][z]);
		if (y != 2) arr.push(cube[x][y+1][z]);
		if (z != 0) arr.push(cube[x][y][z-1]);
		if (z != 2) arr.push(cube[x][y][z+1]);
		
		// remove the center squares
		if (cube[x][y][z].type == 'edge') {
			let center1 = cube[1][y][z];
			let index1 = arr.indexOf(center1);
			if (index1 != -1) arr.splice(index1, 1);
			
			let center2 = cube[x][1][z];
			let index2 = arr.indexOf(center2);
			if (index2 != -1) arr.splice(index2, 1);
			
			let center3 = cube[x][y][1];
			let index3 = arr.indexOf(center3);
			if (index3 != -1) arr.splice(index3, 1);
		}

		return arr;
	}
}

export {Cubie};