class Cube extends Object {

	constructor(args){
		super({...args,"geometry":new CubeGeometry({material:args.material})});

		// console.log(this.material)
	}

}
