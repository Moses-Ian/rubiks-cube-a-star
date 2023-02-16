class Score {
	constructor() {
		this.score = 0;
		this.cubiesInCorrectPosition = 0;
		this.cubiesWithCorrectNeighbors = 0;
		this.cubieClose = 0;
		this.cubieNear = 0;
		this.loneCubies = 0;
		this.loneCubieClose = 0;
		this.lonePairs = 0;
		this.localMax = false;
	}
	
	merge(score) {
		this.score += score.score;
		this.cubiesInCorrectPosition += score.cubiesInCorrectPosition;
		this.cubiesWithCorrectNeighbors += score.cubiesWithCorrectNeighbors;
		this.cubieClose += score.cubieClose;
		this.cubieNear += score.cubieNear;
		this.loneCubies += score.loneCubies;
		this.loneCubieClose += score.loneCubieClose;
		this.lonePairs += score.lonePairs;
		this.localMax = this.localMax || score.localMax;
	}
}

export { Score };