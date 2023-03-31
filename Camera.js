class Camera{


	constructor(){

		this.viewMatrix = mat4.create();

		this.needsUpdate = true;
		this.pos = vec3.fromValues(0, 0.0, -7.0);
		this.rot = vec3.fromValues(0,0,0);


		this.pMatrix = mat4.create();
		const depthCull = 100.0
		mat4.perspective(this.pMatrix,45, gl.viewportWidth / gl.viewportHeight, 0.1, depthCull);



		// mat4.fromRotationTranslation(this.mvMatrix,this.rot,this.pos)

		//this.rot = quat.create();
		//quat.fromEuler(this.rot,0,0,0)

		//this.mvMatrix =

	}
	getViewMatrix(){
		if(this.hasLam) {
			return this.lam;
		}
		if(this.needsUpdate){
			mat4.identity(this.viewMatrix);
			mat4.rotateX(this.viewMatrix,this.viewMatrix,-this.rot[0]); // ?
			mat4.rotateY(this.viewMatrix,this.viewMatrix,-this.rot[1]);
			mat4.rotateZ(this.viewMatrix,this.viewMatrix,-this.rot[2]);
			mat4.translate(this.viewMatrix,this.viewMatrix,vec3.scale(vec3.create(),this.pos,-1))
			this.needsUpdate = false;
			//mat4.fromRotationTranslation(this.#viewMatrix,this.rot,)
			// console.log("CAM", this.viewMatrix);
		}
		return this.viewMatrix;
	}
	getInverseViewMatrix(){
		this.getViewMatrix();
		let inverseView = mat4.identity(mat4.create())
		mat4.rotateX(inverseView,inverseView,-this.rot[0]); // ?
		mat4.rotateY(inverseView,inverseView,-this.rot[1]);
		mat4.invert(inverseView,inverseView);

		//mat4.rotateZ(inverseView,inverseView,this.#rot[2]);
		// mat4.translate(inverseView,inverseView,vec3.scale(vec3.create(),this.#pos,1))
		return inverseView
	}
	getInverseViewMatrix2() {
		let matrix = this.getViewMatrix();
		let inverseView = mat4.create();
		// mat4.

		mat4.invert(inverseView,matrix);
		// mat4.rotateX(inverseView,inverseView,this.rot[0]); // ?
		// mat4.rotateY(inverseView,inverseView,-this.rot[1]);
		// mat4.rotateZ(inverseView,inverseView,this.rot[2]);
		// mat4.translate(inverseView,inverseView,vec3.scale(vec3.create(),this.#pos,1))
		return inverseView
	}
	getAdjustedInverseViewMatrix() {
		this.getViewMatrix();
		let inverseView = mat4.identity(mat4.create())
		// mat4.rotateX(inverseView,inverseView,-this.rot[0]); // ?
		// mat4.rotateY(inverseView,inverseView,-this.rot[1]);
		// mat4.invert(inverseView,inverseView);

		//mat4.rotateZ(inverseView,inverseView,this.#rot[2]);
		// mat4.translate(inverseView,inverseView,vec3.scale(vec3.create(),this.#pos,1))
		return inverseView
	}
	getCameraInverts() {

		const invuMVMatrix = mat4.invert(mat4.create(),this.getViewMatrix());
		const invuPMatrix = mat4.invert(mat4.create(), this.pMatrix);
		return {
			invuPMatrix,
			invuMVMatrix
		}

	}

	setPosition(newPos){
		this.pos = newPos;
		this.needsUpdate = true;
		this.hasLam = false;

	}
	getPosition(){
		return this.pos;
	}

	setRotation(newRot){
		this.rot = newRot;
		this.needsUpdate = true;
		this.hasLam = false;
	}
	getQRotation(){
		return mat4.getRotation(quat.create(),this.getViewMatrix());
	}

	getRotation(){
		return this.rot;
	}

	projectCursorToWorldSpace(tickNum, floorYVal = 0) {
		if(input.cursorPos === undefined) {
			return;
		}
		// # 2d Viewport coords
		// # 3d normalized device coords
		const clipX = 2 * (input.cursorPos[0] / resolution[0] - 0.5);
		const clipY = -2 * (input.cursorPos[1] / resolution[1] - 0.5)
		const clipZ = 1;
		
		
		// 4d Ray
		const rayClip = vec4.fromValues(clipX,clipY, -1, 1);

		// 4d Camera coords
		const invPMat = mat4.invert(mat4.create(), this.pMatrix);

		const rayEye = vec4.transformMat4(vec4.create(), rayClip, invPMat);
		rayEye[2] = -1.0;
		rayEye[3] = 0.0;

		// World coords

		const invMat = this.getInverseViewMatrix2();
		const rayWorld = vec4.transformMat4(vec4.create(), rayEye, invMat);

		

		const searchScale = 100;
		const startPos = vec3.scaleAndAdd(vec3.create(), this.pos, rayWorld, 0);
		const endPos = vec3.scaleAndAdd(vec3.create(), this.pos, rayWorld, searchScale);



		let found = Math.sign(startPos[1] !== Math.sign(endPos[1]));

		if(!found) {
			return undefined;
		}
		let start = startPos;
		let end = endPos;

		if(end[1] < start[1]) {
			start = end;
			end = startPos;
		}

		const yDist = end[1] - start[1];
		const lerpPct = (floorYVal - start[1]) / yDist;
		const lerp = vec3.create();
		vec3.lerp(lerp, start, end, lerpPct);



		return lerp;
		// return [worldSpaceStart, worldSpaceEnd];

		// return [endRay,endRay,endRay]

		// mat4.mul(invMat,invMat, this.pMatrix);
		// mat4.rotateX(invMat, invMat, -clipX/2)
		// mat4.rotateY(invMat, invMat, clipY)

		// // const transposed = mat4.transpose(mat4.create(), invMat);

		// let cameraSpaceStart = vec3.transformMat4(vec3.create(), startPos, invMat);
		// // vec3.scale(cameraSpaceRay, cameraSpaceRay, 5);
		// let cameraSpaceEnd = vec3.transformMat4(vec3.create(), endPos, invMat);
		


		
		// let startPos = vec3.fromValues(clipX, clipY, -startDist);
		// let endPos = vec3.fromValues(clipX, clipY, -endDist);
		// vec3.transformMat4(startPos, startPos, invPMat);
		// vec3.transformMat4(endPos, endPos, invPMat);
		// startPos[2] = -startDist;
		// endPos[2] = -endDist;

		// let worldSpaceStart = vec3.transformMat4(vec3.create(), startPos, invMat);
		// let worldSpaceEnd = worldSpaceStart//vec3.transformMat4(vec3.create(), endPos, invMat);

	}

	pointAt(location){
		//mat4.lookAt()
		const lam = mat4.create();
		mat4.lookAt(lam,this.pos,location,vec3.fromValues(0,1,0))
		this.lam = lam;
		this.hasLam = true;
		
		this.needsUpdate=false;
	}


}
