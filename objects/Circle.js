class Circle extends Object {

	constructor(args){//pos,rot,scale,shaderProgram,renderMethod){
		super({...args,"geometry":new CircleGeometry()});

	}





}
