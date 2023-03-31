class Critter extends Object {

	constructor(args){
		super({...args,
			"geometry":Critter.createCritterGeometry(),
			"geometryDeltas":Critter.critterGeometryDeltas(args.scale)
		});

		console.log(this.material)
		this.vel = vec2.fromValues(0,0);
		this.animationDim = 0;
	}

	updateGeometryDeltas(dtDelta, guidePoint) {
		// console.log(this.animationDim);
		let animationSpeed = 1.0
		const farRad = 4.0;
		const closeRad = 2.0;
		const moveForce = 0.1;
		const maxSpeed = 10.0;
		let isClose = false;
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
				isClose = true;
			}

			
			if(dist > closeRad) {
				const moveVec = vec2.fromValues(xDelta, yDelta);
				const normMove = vec2.normalize(vec2.create(), moveVec);

				const scaledNormMove = vec2.scale(vec2.create(), normMove, moveForce);

				vec2.add(this.vel, this.vel, scaledNormMove);

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
		

		const friction = isClose ? 0.95 : 0.985;
		vec2.scale(this.vel, this.vel, friction);
		const scaledVel = friction * maxSpeed / vec2.length(this.vel);
		if(scaledVel < 1) {
			vec2.scale(this.vel, this.vel, scaledVel);
		}

		vec3.scaleAndAdd(this.pos, this.pos, vec3.fromValues(-this.vel[0], 0, -this.vel[1]), dtDelta / 1000);

		this.animationDim += dtDelta* animationSpeed;

	}

	static createCritterGeometry() {
		const geometry = [];
		// Head
		geometry.push(new CubeGeometry({"material":new ShaderMaterial("simpleColor", {color: vec4.fromValues(1.0,1.0,1.0,0.2)})}));
		// Torso
		geometry.push(new CubeGeometry({"material":new ShaderMaterial("debug")}));
		// Legs
		geometry.push(new CubeGeometry({"material":new ShaderMaterial("simpleColor", {color: vec4.fromValues(1.0,1.0,1.0,1)})}));
		geometry.push(new CubeGeometry({"material":new ShaderMaterial("simpleColor", {color: vec4.fromValues(1.0,1.0,1.0,1)})}));

		// Arms
		geometry.push(new CubeGeometry({"material":new ShaderMaterial("simpleColor", {color: vec4.fromValues(1.0,1.0,1.0,0.2)})}));
		geometry.push(new CubeGeometry({"material":new ShaderMaterial("simpleColor", {color: vec4.fromValues(1.0,1.0,1.0,0.2)})}));

		return geometry;
	}
	static critterGeometryDeltas(scale) {
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
		//Head
		geometryDeltas.push({"pos":vec3.fromValues(0,torsoSize,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(headSize,headSize,headSize)})
		// Torso
		geometryDeltas.push({"pos":vec3.fromValues(0,0,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(torsoSize,torsoSize,torsoSize)})

		// Legs
		geometryDeltas.push({"pos":vec3.fromValues(legOffset,-torsoSize,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(legWidth,legHeight,legWidth)})
		geometryDeltas.push({"pos":vec3.fromValues(-legOffset,-torsoSize,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(legWidth,legHeight,legWidth)})

		// Arms
		geometryDeltas.push({"pos":vec3.fromValues(torsoSize,shoulderOffset,0),"rot":quat.fromEuler(quat.create(),0,0,armTilt),"scale":vec3.fromValues(armWidth,armLength,armWidth)})
		geometryDeltas.push({"pos":vec3.fromValues(-torsoSize,shoulderOffset,0),"rot":quat.fromEuler(quat.create(),0,0,-armTilt),"scale":vec3.fromValues(armWidth,armLength,armWidth)})

		return geometryDeltas;

	}

}
