class Score {
	constructor() {
		this.score = 0;
		this.cubiesInCorrectPosition = 0;
		this.cubiesWithCorrectNeighbors = 0;
		this.cubieClose = 0;
		this.cubieNear = 0;
		this.correctOrientation = 0;
		this.relativeOrientation = 0;
		this.loneCubies = 0;
		this.loneCubieClose = 0;
		this.lonePairs = 0;
		this.localMax = false;
		this.correctFaces = 0;
	}
	
	merge(score) {
		this.score += score.score;
		this.cubiesInCorrectPosition += score.cubiesInCorrectPosition;
		this.cubiesWithCorrectNeighbors += score.cubiesWithCorrectNeighbors;
		this.cubieClose += score.cubieClose;
		this.cubieNear += score.cubieNear;
		this.correctOrientation += score.correctOrientation;
		this.relativeOrientation += score.relativeOrientation;
		this.loneCubies += score.loneCubies;
		this.loneCubieClose += score.loneCubieClose;
		this.lonePairs += score.lonePairs;
		this.localMax = this.localMax || score.localMax;
		this.correctFaces += score.correctFaces;
	}
}

export { Score };