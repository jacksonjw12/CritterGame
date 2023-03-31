class Coords extends Object {

	constructor(args){//pos,rot,scale,shaderProgram,renderMethod){
		super({...args,
			"geometry":[new ArrowGeometry(),new ArrowGeometry(),new ArrowGeometry()],
			"geometryDeltas":[
				{"pos":vec3.fromValues(0,0,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(0.25,0.25,1.0)},
				{"pos":vec3.fromValues(0,0,0),"rot":quat.fromEuler(quat.create(),0,90,0),"scale":vec3.fromValues(0.25,0.25,1.0)},
				{"pos":vec3.fromValues(0,0,0),"rot":quat.fromEuler(quat.create(),90,0,0),"scale":vec3.fromValues(0.25,0.25,1.0)}
				]
		});

	}





}
