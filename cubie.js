

class Cubie {
	constructor(indexX, indexY, indexZ, rotX, rotY, rotZ) {
		this.indexX = indexX;
		this.indexY = indexY;
		this.indexZ = indexZ;
		this.rotX = rotX;
		this.rotY = rotY;
		this.rotZ = rotZ;
	}
	
	equals(other) {
		if (this.indexX != other.indexX) return false;
		if (this.indexY != other.indexY) return false;
		if (this.indexZ != other.indexZ) return false;
		if (this.rotX != other.rotX) return false;
		if (this.rotY != other.rotY) return false;
		if (this.rotZ != other.rotZ) return false;
		return true;
	}
}

export {Cubie};