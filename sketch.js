let cubeSize = 3;
let cube = new Array(cubeSize);
let len = 50;

function setup() {
	let canvas = createCanvas(400, 400, WEBGL);
	canvas.parent('sketch-container');
	
	// create the cube
	for(let i=0; i<cubeSize; i++) {
		cube[i] = new Array(cubeSize);
		for(let j=0; j<cubeSize; j++) {
			cube[i][j] = new Array(cubeSize);
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k] = new Box((i-1)*len, (j-1)*len, (k-1)*len, len);
			}
		}
	}
}

function draw() {
	background(175);

	// camera
	let cameraX = map(mouseX, 0, width, 200, -200);
	let cameraY = map(mouseY, 0, height, 200, -200);
	let cameraPos = createVector(cameraX, cameraY, (height/2) / tan(PI/6));
	cameraPos.setMag((height/2) / tan(PI/6));

	camera(cameraPos.x, cameraPos.y, cameraPos.z, 0, 0, 0, 0, 1, 0);

	// light
	ambientLight(100);
	directionalLight(255, 255, 255, 0, 1, 0);
	
	// show the cube
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].show();
			}
		}
	}
}