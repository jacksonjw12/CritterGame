class Scene{

	constructor(name, objects){
		this.name = name;

		this.objects = (objects !== undefined)?objects:[];

		let ambient = .3
		this.ambientLighting = vec3.fromValues(ambient, ambient, ambient);
		this.lightingDirection = vec3.normalize(vec3.create(),vec3.fromValues(0, 1, 0))

		this.lightPosition = vec3.fromValues(0,0,0)
		let lightingVector = vec3.scale(vec3.create(),this.lightingDirection,100);
		vec3.sub(this.lightPosition,this.lightPosition,lightingVector);

		this.camera = new Camera();

		if (new.target === Scene) {
			this.addObject(new Cube({"material":new ShaderMaterial("cool"),"scale":vec3.fromValues(1.0,1.0,1.0)}))
			this.addObject(new Cube({"material":new ShaderMaterial("cool"),"pos":vec3.fromValues(0,0,-.5),"scale":vec3.fromValues(.6,.6,.6)}))

			this.addObject(new Cube({"material":new ShaderMaterial("cool"),"pos":vec3.fromValues(0,0,-.7),"scale":vec3.fromValues(.5,.5,.5)}))
		}
		this.pdt = -1;

	}
	sortObjects(){
		this.objects.sort((a,b)=>{
			return (a.transparent === b.transparent)?0 : (a.transparent?1 : -1);
		})
	}

	animate(dt){
		let circlingRadius = 5;
		let circlingSpeed = 2;
		let cx = circlingRadius * -Math.sin(dt/10000 * circlingSpeed)
		let cy =Math.sin(dt/1000);
		//let cz = circlingRadius * Math.sin(dt/10000 * circlingSpeed)
		// console.log(this.camera.pos)
		for(let o = 0; o< this.objects.length; o++){
			this.objects[o].pos = vec3.fromValues(cx,this.objects[o].pos[1],this.objects[o].pos[2])

		}
		//this.camera.updatePosition(vec3.fromValues(cx,cy,0));
		this.camera.pointAt(vec3.fromValues(0,0,0))

		if(this.pdt *dt < 0){
			console.log(this.camera.pos);
			console.log()
			this.pdt = 1;
		}


	}



	addObject(o){
		this.objects.push(o);
		this.sortObjects();

	}
	removeObject(o){
		for(let i = 0; i < this.objects.length; i++){
			if(this.objects[i].id === o.id){
				return this.objects.splice(i,1);
			}
		}
	}

}
