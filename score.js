class Score {
	constructor() {
		this.score = 0;
		this.cubiesInCorrectPosition = 0;
		this.cubiesWithCorrectNeighbors = 0;
		this.cubieClose = 0;
		this.cubieNear = 0;
	}
	
	merge(score) {
		this.score += score.score;
		this.cubiesInCorrectPosition += score.cubiesInCorrectPosition;
		this.cubiesWithCorrectNeighbors += score.cubiesWithCorrectNeighbors;
		this.cubieClose += score.cubieClose;
		this.cubieNear += score.cubieNear;
	}
}

export { Score };