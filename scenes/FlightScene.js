class FlightScene extends Scene {

    constructor(name, objects){
	    super(name,objects);

		this.coords = new Coords({
			"material":new ShaderMaterial("coords"),
			"materialOptions":{"color":vec4.fromValues(1.0,0.0,0.0,1.0)},
			"scale":vec3.fromValues(1.0,1.0,1.0)
	    })
	    this.addObject(this.coords)
		//this.addObject(new Cube({"material":new ShaderMaterial("cool"),"scale":vec3.fromValues(1.0,1.0,1.0)}))
		//this.addObject(new Cube({"material":new ShaderMaterial("default"),"pos":vec3.fromValues(0,0,-.5),"scale":vec3.fromValues(.6,.6,.6)}))

		//this.addObject(new Cube({"material":new ShaderMaterial("cool"),"pos":vec3.fromValues(0,0,-.7),"scale":vec3.fromValues(.5,.5,.5)}))

        // this.addObject(new Cube({"material":new ShaderMaterial("simpleColor"),"scale":vec3.fromValues(1.0,1.0,1.0)}))

		this.pointer = new Arrow({"material":new ShaderMaterial("coords"),"scale":vec3.fromValues(0.25,0.25,1.0)})
		this.pointer.absolutePosition = true;
		//this.addObject(this.pointer)

		this.critter = new Critter({
			"scale":vec3.fromValues(1,1,1),
			"material":new ShaderMaterial("critter"),
			"materialOptions":{
				"color":vec4.fromValues(.5,1,1,1.)
			},
		})

	    super.addObject(this.critter);
        //this.camera.pos = vec3.fromValues(0,0,0);

		// this.plane = new Plane({
		// 	"material":new ShaderMaterial("raymarch"),
		// 	materialOptions:{"color":vec4.fromValues(0.2,0.2,0.2,1.0)},
		// 	"scale":vec3.fromValues(10.0,10.0,10.0),
		// 	"pos":vec3.fromValues(0,0,-5),
		// 	"rot":quat.fromEuler(quat.create(),0,0,0),

		// })
		// // this.plane.absolutePosition = true;
		// this.addObject(this.plane)

        this.camera.setPosition(vec3.fromValues(0,0,5));
		if(window.innerHeight > window.innerWidth){


			let newRot = vec3.add(vec3.create(),this.camera.getRotation(),vec3.fromValues(0,-.1,0));

			this.camera.setRotation(newRot);


		}
		this.pointer.pos = vec3.fromValues(0.1,0,-2);
		this.cameraVelocity = vec3.fromValues(0,0,0);
		this.lastDt = -1;
	}

	animate(dt){
		debugInfo("","");
		debugInfo("","");
    	const timeStep = dt-this.lastDt;
    	this.lastDt = dt;
		this.critter.updateGeometryDeltas(dt);




		let cameraRot = this.camera.getInverseViewMatrix();
		let forwardVector = vec3.normalize(vec3.create(),vec4.transformMat4(vec4.create(),vec4.fromValues(0,0,-1,0),cameraRot));
		let upVector  = vec3.normalize(vec3.create(),vec4.transformMat4(vec4.create(),vec4.fromValues(0,1,0,0),cameraRot));
		let leftVector = vec3.normalize(vec3.create(),vec4.transformMat4(vec4.create(),vec4.fromValues(-1,0,0,0),cameraRot));

		debugInfo("forwardVector",forwardVector)
		this.pointer.pointInDirection(vec3.normalize(vec3.create(),forwardVector))


		let force = .1 * 5;
    	let forwardStep = vec3.scale(vec3.create(),forwardVector,timeStep * force);
		let leftStep = vec3.scale(vec3.create(),leftVector,timeStep * force);
		let upStep = vec3.scale(vec3.create(),upVector,timeStep * force);

		// this.plane.rot = quat.invert(quat.create(), this.camera.getQRotation());
		// this.plane.pos = vec3.add(vec3.create(),this.camera.getPosition(),forwardVector);

		// quat.rotateX(this.plane.rot,this.plane.rot,0.01)
		// quat.rotateY(this.plane.rot,this.plane.rot,0.01)
		// this.plane.pos[2] = 10*Math.sin(dt/1000);

		let moveInput = vec3.fromValues(0,0,0);
		if(input.keysDown.indexOf('I') > -1){
    		vec3.add(moveInput,moveInput,vec3.fromValues(0,0,1));
		}
		if(input.keysDown.indexOf('K') > -1){
    		vec3.add(moveInput,moveInput,vec3.fromValues(0,0,-1));
		}
		if(input.keysDown.indexOf('J') > -1){
    		vec3.add(moveInput,moveInput,vec3.fromValues(-1,0,0));
		}
		if(input.keysDown.indexOf('L') > -1){
    		vec3.add(moveInput,moveInput,vec3.fromValues(1,0,0));
		}
    	if(input.keysDown.indexOf('W') > -1){
    		vec3.add(moveInput,moveInput,forwardStep);
		}
    	if(input.keysDown.indexOf('S') > -1){
			vec3.add(moveInput,moveInput,vec3.scale(vec3.create(),forwardStep,-1))
		}
    	if(input.keysDown.indexOf('A') > -1){
    		vec3.add(moveInput,moveInput,leftStep);
		}
    	if(input.keysDown.indexOf('D') > -1) {
			vec3.add(moveInput, moveInput, vec3.scale(vec3.create(), leftStep, -1))
		}
    	if(input.keysDown.indexOf('Q') > -1){
    		vec3.add(moveInput,moveInput,upStep);
		}
    	if(input.keysDown.indexOf('E') > -1){
			vec3.add(moveInput,moveInput,vec3.scale(vec3.create(),upStep,-1))
		}
    	// console.log(this.cameraVelocity)
		// if(window.innerHeight > window.innerWidth){
		// 	vec3.add(moveInput,moveInput,forwardStep);
		// }
    	let acceleration = timeStep / 100;
    	vec3.scale(moveInput,moveInput,acceleration);
    	// console.log(moveInput);
    	vec3.add(this.cameraVelocity,this.cameraVelocity,moveInput);


    	let maxSpeed = 10;
    	let speed = vec3.length(this.cameraVelocity);

    	if(speed > maxSpeed){
    		this.cameraVelocity = vec3.scale(vec3.create(), vec3.normalize(this.cameraVelocity,this.cameraVelocity), maxSpeed);
    		//vec3.scale(this.cameraVelocity,this.cameraVelocity,maxSpeed/speed)
		}
    	//console.log(this.cameraVelocity);
    	//let newPos = vec3.add(vec3.create(), movement, this.camera.getPosition())
		// console.log(movement);
		let timeScale = timeStep * .01;
    	// console.log(timeScale);

		let newPos = vec3.add(vec3.create(),vec3.scale(vec3.create(),this.cameraVelocity,timeScale),this.camera.getPosition());
    	// console.log(vec3.distance(newPowws,this.camera.getPosition()))
		this.camera.setPosition(newPos);

		vec3.scale(this.cameraVelocity,this.cameraVelocity,1/(timeStep-15.6))



		debugInfo("camerapos",this.camera.getPosition());


		//console.log(this.camera.pos)
		//this.camera.updatePosition(newPos);




    	let rotSpeed = 0.001;
    	let rotMov = vec3.fromValues(0,0,0);
    	if(input.keysDown.indexOf("&") > -1){
			rotMov[0]+=rotSpeed * timeStep;

		}
		if(input.keysDown.indexOf("(") > -1){
			rotMov[0]-=rotSpeed * timeStep;

		}
		if(input.keysDown.indexOf("%") > -1){
			rotMov[1]+=rotSpeed * timeStep;

		}
		if(input.keysDown.indexOf("'") > -1) {
			rotMov[1] -= rotSpeed * timeStep;
		}


		let newRot = vec3.add(vec3.create(),this.camera.getRotation(),rotMov);

		this.camera.setRotation(newRot);

		if(input.keysDown.indexOf("V")> -1){
			let newRot = vec3.fromValues(0,0,0)
			this.camera.setRotation(newRot);
		}
		if(input.keysDown.indexOf("B")> -1){
			let newRot = vec3.fromValues(0,Math.PI/2,0)
			this.camera.setRotation(newRot);
		}
		if(input.keysDown.indexOf("N")> -1){
			let newRot = vec3.fromValues(0,Math.PI,0)
			this.camera.setRotation(newRot);
		}
		if(input.keysDown.indexOf("M")> -1){
			let newRot = vec3.fromValues(0,3*Math.PI/2,0)
			this.camera.setRotation(newRot);
		}

		// console.log(this.camera.rot)
		// let newRot = quat.fromEuler(quat.create(),rotMov[0],rotMov[1],rotMov[2]);
		// //quat.mul(newRot,newRot,this.camera.rot);
		// //this.camera.updateRotation(newRot);
		//
		// // this.camera.pointAt(vec3.fromValues(0,0,0));
		//
		//
		// quat.rotateX(this.camera.rot,this.camera.rot,rotMov[0]);
		// quat.rotateY(this.camera.rot,this.camera.rot,rotMov[1]);
		//this.camera.rot.z = 0;
		// console.log(this.camera.rot);
		// quat.rotateZ(this.camera.rot,this.camera.rot,rotMov[2]);

		//let circlingRadius = 10;


		// let circlingSpeed = 2;
		// let cx = circlingRadius * Math.cos(dt/10000 * circlingSpeed)
		// let cy = 0//*Math.sin(dt/1000)-1;
		// let cz = circlingRadius * Math.sin(dt/10000 * circlingSpeed)
		// // console.log(this.camera.pos)
        //
		// this.camera.updatePosition(vec3.fromValues(cx,cy,cz));
		// this.camera.pointAt(vec3.fromValues(0,0,0))
		// this.lightPosition.x += 5*Math.sin(dt/10000 * circlingSpeed)
		//
	}


}
