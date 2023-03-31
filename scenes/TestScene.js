class TestScene extends Scene{

	constructor(name, objects){
	    super(name,objects);


	    // //triangle
		// super.addObject(new Triangle({
		// 	"pos":vec3.fromValues(3,0,0),
		// 	"rot":quat.fromEuler(quat.create(),10,0,0)
		// }));

		//square
		this.plane = new Plane({"pos":vec3.fromValues(0,0,0),
			"scale":vec3.fromValues(4,2,1),
			"material":new ShaderMaterial("raymarch"),
			"transparent":false
		})
		super.addObject(this.plane);

		//depth circle
		super.addObject(new Circle({
			"pos":vec3.fromValues(0, 3, 0),
			"material":new ShaderMaterial("depth"),
			"materialOptions":{
				"color":vec4.fromValues(.5,1,1,1.)
			}
		}));

		//skybox thing


		// super.addObject(new Cube({
		// 	"scale":vec3.fromValues(20,20,20),
		// 	"material":new ShaderMaterial("cool2"),
		// 	"materialOptions":{
		// 		"color":vec4.fromValues(.5,1,1,1.)
		// 	}
		// }))

		let possibleShaders = ["phong","depth","cool","cool2"];
		let usedShaders = [];
		let getRandomShader = ()=>{
			console.log(possibleShaders);
			if(possibleShaders.length === 0){
				possibleShaders = usedShaders;
				usedShaders = [];
			}

			let i = Math.floor(Math.random()*possibleShaders.length);
			let s = possibleShaders[i];
			usedShaders.push(s);
			possibleShaders.splice(i,1)
			return s;
		}

		for(let r = 0; r< 1; r++){
			for(let c = 0; c<4; c++){
				super.addObject(new Cube({
					"pos":vec3.fromValues(r*5, -2.5, -5 + c*3),
					"rot":quat.fromEuler(quat.create(), 90+r*c+c, 0, 0),
					"scale":vec3.fromValues(3, 1, .2),
					"material":new ShaderMaterial(getRandomShader(),{
						"color":vec4.fromValues(.5, .5, .5, 1.),
						"inverse":true
					}),


				}));
			}
		}
		//
		// super.addObject(new Cube({
		// 	"scale":vec3.fromValues(.1,.1,.1),
		// 	"pos":super.lightPosition,
		// 	"shader":ShaderManager.getShader("simpleColor"),
		// 	"materialOptions":{
		// 		"color":vec4.fromValues(0.7078, 0.6644, 0.2398,1.0)
		// 	}
		// }))



	}

	animate(dt){
		let rotQuat = quat.create();
		quat.fromEuler(rotQuat,0,.5,0);
		for(let o = 0; o < this.objects.length; o++){

			//quat.multiply(this.scene.geometry[o].rot,this.scene.geometry[o].rot,rotQuat)

		}
		let circlingRadius = 10;


		let circlingSpeed = 2;
		let cx = circlingRadius * Math.cos(dt/10000 * circlingSpeed)
		let cy = 0//*Math.sin(dt/1000)-1;
		let cz = circlingRadius * Math.sin(dt/10000 * circlingSpeed)
		// console.log(this.camera.pos)

		this.camera.setPosition(vec3.fromValues(cx,cy,cz));
		this.camera.pointAt(vec3.fromValues(0,0,0))
		this.lightPosition.x += 5*Math.sin(dt/10000 * circlingSpeed)
		//super.lightPosition= vec3.fromValues(circlingRadius * Math.cos(dt/10000 * circlingSpeed),super.lightPosition.y,circlingRadius * Math.sin(dt/10000 * circlingSpeed));
		// console.log(this.camera.rot)
		//quat.fromEuler(this.camera.rot,0,360*Math.cos(dt/1000),0)
		//console.log(this.camera.getRotation())
		this.plane.pos = vec3.fromValues(cx/2,cy/2,cz/2)
		this.plane.rot = quat.invert(quat.create(), this.camera.getQRotation());
		// console.log(this.plane.rot)

	}


}
