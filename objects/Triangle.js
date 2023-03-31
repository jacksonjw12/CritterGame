class Triangle extends Object {

	constructor(args){
		super({...args,"geometry":new TriangleGeometry()});

	}

}
