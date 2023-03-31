
const config = {
			top: true,
			bottom: true,
			left: true,
			right: true,
			main: true
		}
class CubeGrid extends Object {
	constructor(args){
		super({...args,
			"geometry":CubeGrid.createGeometry(args.gridParams),
			"geometryDeltas":CubeGrid.geometryDeltas(args.scale, args.gridParams)
		});

		// console.log(this.material)
		this.vel = vec2.fromValues(0,0);
		this.animationDim = 0;
	}

	updateGeometryDeltas(dtDelta, guidePoint) {
		// console.log(this.animationDim);
		let animationSpeed = 1.0
		const farRad = 4.0;
		const closeRad = 2.0;
		const moveForce = 0.1;
		const maxSpeed = 2.0;

		if(guidePoint !== undefined) {

			const xDelta = this.pos[0] - guidePoint[0];
			const yDelta = this.pos[2] - guidePoint[2];
			const dist = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

			const lookAtPoint = vec3.clone(guidePoint);

			// if(dist > farRad) {
				

			// }

			if(dist < farRad) {
				const clippedDistPct = (clip(dist, closeRad, farRad) - closeRad) / (farRad - closeRad);
				lookAtPoint[1] += (1.0 - clippedDistPct) * (this.pos[1] - lookAtPoint[1]);
				animationSpeed = clippedDistPct;
			}

			
			if(dist > closeRad) {
				const moveVec = vec3.fromValues(xDelta, yDelta);
				const normMove = vec3.normalize(vec3.create(), moveVec);

				vec3.add(this.vel, this.vel, normMove);

				const lookAt = mat4.targetTo(mat4.create(), this.pos, lookAtPoint, vec3.fromValues(0,1,0))
				mat4.getRotation(this.rot, lookAt);
			}
			

			const armTilt = 40;

			const sweepAmp = 45 * animationSpeed;
			const sweepSpeed = 0.02;
			const sweepOffset = Math.PI;
			const sweep1 = Math.sin(this.animationDim * sweepSpeed) * sweepAmp;
			const sweep2 = Math.sin(this.animationDim * sweepSpeed + sweepOffset) * sweepAmp;

			this.geometryDeltas[2].rot = quat.fromEuler(quat.create(),sweep1,0,0)
			this.geometryDeltas[3].rot = quat.fromEuler(quat.create(),sweep2,0,0)

			this.geometryDeltas[4].rot = quat.fromEuler(quat.create(),sweep2/4,0,armTilt)
			this.geometryDeltas[5].rot = quat.fromEuler(quat.create(),sweep1/4,0,-armTilt)

		}
		

		const friction = 0.9;
		vec3.scale(this.vel, this.vel, friction);
		const scaledVel = friction * maxSpeed / vec3.length(this.vel);
		if(scaledVel < 1) {
			vec3.scale(this.vel, this.vel, scaledVel);
		}

		vec3.scaleAndAdd(this.pos, this.pos, vec3.fromValues(-this.vel[0], 0, -this.vel[1]), dtDelta / 1000);

		this.animationDim += dtDelta* animationSpeed;

	}

	static createGeometry(gridParams) {
		const geometry = [];


		const newCube = (color) => {
			// color = vec4.fromValues(Math.random(),Math.random(),Math.random(),1.0);
			return new CubeGeometry({"material":new ShaderMaterial("simpleColor", {color})});
		}

		for(let r = 0; r < gridParams.gridRows; r++) {
			for(let c = 0; c < gridParams.gridCols; c++) {
				// Top
				if(config.top) {
					geometry.push(newCube(gridParams.edgeColor));
				}
				

				// Left
				if(config.left) {
					geometry.push(newCube(gridParams.edgeColor));

				}
				if (r === gridParams.gridRows-1 && config.bottom) {
					// Bottom
					geometry.push(newCube(gridParams.edgeColor));
				}

				// Main
				if(config.main) {
					geometry.push(newCube(gridParams.cellColor));
				}
				// 
				

			
			}
			// Right
			if(config.right) {
				geometry.push(newCube(gridParams.edgeColor));

			}
		}
		
		return geometry;
	}
	static geometryDeltas(scale, gridParams) {
		const geometryDeltas = [];
		const headSize = 0.65;
		const torsoSize = 1.0;
		const legHeight = 0.75;
		const legWidth = 0.3
		const legOffset = 0.5;
		const shoulderOffset = 0.35;
		const armLength = 0.5;
		const armWidth = 0.3

		const armTilt = 40;

		const ew = gridParams.edgeWidth;
		const cw = gridParams.cellWidth;
		const leftCellMid = ew + cw/2;
		const gridMid = ew/2;
		const width = ew + cw;
		const eWidth = ew + cw;

		// X is C
		// Z is R

		const cubePos = (r, c, i) => {
			const v = cubePosI(r,c,i);
			console.log({v});
			return v;
		}

		const cubePosI = (r, c, i) => {
			const yPos = -1.8;
			

			const basePos = vec3.fromValues(c * (eWidth + ew*6) * 1, 0, r * (width+ew*6));

			console.log(basePos, {c,r,cw,ew, i})

			if(i == 0) { // Top
				return vec3.add(vec3.create(), basePos, vec3.fromValues(-ew, yPos,-cw-ew))
			}
			else if (i == 1) { // Left
				return vec3.add(vec3.create(), basePos, vec3.fromValues(-cw-ew,yPos,0))

			}
			else if (i == 2) { // Bottom
				// return vec3.add(vec3.create(), basePos, vec3.fromValues(leftCellMid, yPos,width+gridMid))
				return vec3.add(vec3.create(), basePos, vec3.fromValues(-ew, yPos,-cw-ew + width + width+.00))

				// return vec3.add(vec3.create(), top, vec3.fromValues(0, 0, ew+cw))

			}
			else if (i == 3) { // Main
				return vec3.add(vec3.create(), basePos, vec3.fromValues(0, yPos,0))
			}
			else if (i == 4) { // Right
				return vec3.add(vec3.create(), basePos, vec3.fromValues(-cw-ew ,yPos,0))

				// return vec3.add(vec3.create(), basePos, vec3.fromValues(width-gridMid,yPos,leftCellMid))
			}


			
		}

		for(let r = 0; r < gridParams.gridRows; r++) {
			for(let c = 0; c < gridParams.gridCols; c++) {
				// Top
				// console.log(cubePos(r,c,0))
				if(config.top) {
					const tScale = vec3.fromValues(width,1,ew);
					console.log({tScale});
					geometryDeltas.push({
						"pos":cubePos(r,c,0),
						"rot":quat.fromEuler(quat.create(),0,0,0),
						"scale": tScale
					});
				}
				
				if(config.left) {
					// Left
					const lScale = vec3.fromValues(ew,1,cw)
					console.log({lScale});
					geometryDeltas.push({
						"pos":cubePos(r,c,1),
						"rot":quat.fromEuler(quat.create(),0,0,0),
						"scale": lScale
					});
				}
				
				if (r === gridParams.gridRows-1 && config.bottom) {
					// Bottom
					geometryDeltas.push({
						"pos":cubePos(r,c,2),
						"rot":quat.fromEuler(quat.create(),0,0,0),
						"scale":vec3.fromValues(width,1,ew)
					});
				}

				// Main
				if(config.main) {
					geometryDeltas.push({
						"pos":cubePos(r,c,3),
						"rot":quat.fromEuler(quat.create(),0,0,0),
						"scale":vec3.fromValues(cw,1,cw)
					});
				}
				
				

			
			}
			// Right
			if(config.right) {
				geometryDeltas.push({
					"pos":cubePos(r,gridParams.gridCols,4),
					"rot":quat.fromEuler(quat.create(),0,0,0),
					"scale":vec3.fromValues(ew,1,width+ew)
				});
			}
			
		}


		//Head
		// geometryDeltas.push({"pos":vec3.fromValues(0,torsoSize,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(headSize,headSize,headSize)})
		// // Torso
		// geometryDeltas.push({"pos":vec3.fromValues(0,0,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(torsoSize,torsoSize,torsoSize)})

		// // Legs
		// geometryDeltas.push({"pos":vec3.fromValues(legOffset,-torsoSize,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(legWidth,legHeight,legWidth)})
		// geometryDeltas.push({"pos":vec3.fromValues(-legOffset,-torsoSize,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(legWidth,legHeight,legWidth)})

		// // Arms
		// geometryDeltas.push({"pos":vec3.fromValues(torsoSize,shoulderOffset,0),"rot":quat.fromEuler(quat.create(),0,0,armTilt),"scale":vec3.fromValues(armWidth,armLength,armWidth)})
		// geometryDeltas.push({"pos":vec3.fromValues(-torsoSize,shoulderOffset,0),"rot":quat.fromEuler(quat.create(),0,0,-armTilt),"scale":vec3.fromValues(armWidth,armLength,armWidth)})




		return geometryDeltas;

	}

}
