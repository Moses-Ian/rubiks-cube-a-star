let cubeSize = 3;	// must be odd
let cube = new Array(cubeSize);
let len = 50;
let offset = (cubeSize - 1) / 2;
let turnFrames = 30;
let turnSpeed;

// up, down, right, left, front, back
let colors;
let turn = new Turn();

let axisX;
let axisY;
let axisZ;

function setup() {
	let canvas = createCanvas(400, 400, WEBGL);
	canvas.parent('sketch-container');
	
	// define axes
	axisX = createVector(1, 0, 0);
	axisY = createVector(0, 1, 0);
	axisZ = createVector(0, 0, 1);
	

	// define turnSpeed
	turnSpeed = HALF_PI/turnFrames;
	
	// create the colors
	colors = [
		color('white'), color('yellow'),
		color('orange'), color('red'),
		color('green'), color('blue')
	];
	
	// create the cube
	for(let i=0; i<cubeSize; i++) {
		cube[i] = new Array(cubeSize);
		for(let j=0; j<cubeSize; j++) {
			cube[i][j] = new Array(cubeSize);
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k] = new Box(
					(i-offset)*len, (j-offset)*len, (k-offset)*len, 
					i-offset, j-offset, k-offset, 
					len
				);
			}
		}
	}
	
}

function draw() {
	background(175);
	
	// do things
	if (turn.framesLeft > 0) {
		switch (turn.direction) {
			case 'x':
				turnX(turn.index);
				break;
			case 'y':
				turnY(turn.index);
				break;
			case 'z':
				turnZ(turn.index);
				break;
		}
		turn.framesLeft--;
		if (turn.framesLeft == 0)
			updateCube();
	}

	// camera
	let cameraX = map(mouseX, 0, width, 200, -200);
	let cameraY = map(mouseY, 0, height, 200, -200);
	let cameraPos = createVector(cameraX, cameraY, (height/2) / tan(PI/6));
	cameraPos.setMag((height/2) / tan(PI/6));

	camera(cameraPos.x, cameraPos.y, cameraPos.z, 0, 0, 0, 0, 1, 0);

	// light
	ambientLight(255);
	// directionalLight(255, 255, 255, 0, 1, 0);
	
	// material
	// normalMaterial();
	
	// beginShape();
	
	// vertex(0,0);
	// vertex(100, 0);
	// vertex(100, 100);
	// vertex(0, 100);
	
	// endShape(CLOSE);
	
	// show the cube
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].show();
			}
		}
	}
	
	cube[0][0][2].highlight();
}

function keyPressed() {
	if (turn.framesLeft > 0)
		return;
	if (key == ',') {
		turn = new Turn('y', -1);
		return;
	}
	if (key == 'o') {
		turn = new Turn('y', 1);
		return;
	}
	if (key == 'a') {
		turn = new Turn('x', -1);
		return;
	}
	if (key == 'e') {
		turn = new Turn('x', 1);
		return;
	}
	if (key == 'p') {
		turn = new Turn('z', -1);
		return;
	}
	if (key == 'u') {
		turn = new Turn('z', 1);
		return;
	}
		
}

function turnX(index, angle) {
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].turnX(index);
			}
		}
	}
}

function turnY(index, angle) {
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].turnY(index);
			}
		}
	}
}

function turnZ(index, angle) {
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].turnZ(index);
			}
		}
	}
}

function updateCube() {
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].update();
			}
		}
	}
}