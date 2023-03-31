class Plane extends Object {

	constructor(args){
		super({...args,"geometry":new PlaneGeometry()});

	}

}
