let cubeSize = 3;	// must be odd
let cube = new Array(cubeSize);
let len = 50;
let offset = (cubeSize - 1) / 2;

// up, down, right, left, front, back
let colors;

function setup() {
	let canvas = createCanvas(400, 400, WEBGL);
	canvas.parent('sketch-container');
	
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
	// turnX(1, -.05);
	// turnY(1, -.05);
	turnZ(1, -.05);

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
}

function turnX(index, angle) {
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].turnX(index, angle);
			}
		}
	}
}

function turnY(index, angle) {
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].turnY(index, angle);
			}
		}
	}
}

function turnZ(index, angle) {
	for(let i=0; i<cubeSize; i++) {
		for(let j=0; j<cubeSize; j++) {
			for(let k=0; k<cubeSize; k++) {
				cube[i][j][k].turnZ(index, angle);
			}
		}
	}
}