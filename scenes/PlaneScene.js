class PlaneScene extends Scene{

	constructor(name, objects){
	    super(name,objects);



        let aspect = window.innerWidth/window.innerHeight;
		//square
		super.addObject(new Plane({
            "pos":vec3.fromValues(0,0,0),
            "scale":vec3.fromValues(aspect,1.0,1.0),

			"material":new ShaderMaterial("raymarch"),
		}));

        //this.camera.pos = vec3.fromValues(0,0,0);


        this.camera.setPosition(vec3.fromValues(0,0,5));


	}

	animate(dt){
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
