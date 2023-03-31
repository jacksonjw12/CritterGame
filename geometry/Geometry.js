class Geometry {

	constructor(geometryType, args){//pos,rot,scale,shaderProgram,renderMethod){
		if (new.target === Geometry) {
			throw new TypeError("Cannot construct Geometry instances directly");
		}
		this.geometryName = geometryType.name;

		this.alreadyInitialized = Geometry.getRegisteredGeometry(geometryType,this);

		this.renderMethod = (args.renderMethod !== undefined)?args.renderMethod:gl.TRIANGLE_STRIP; // default render method is triangle_strip

		this.hasNormals = (args.hasNormals !== undefined)?args.hasNormals:false;

		this.material =(args.material !== undefined)?args.material:undefined;

	}

	static getRegisteredGeometry(geometryType,geometry){
		// for(let g = 0; g< Geometry.registered.length; g++){
		// 	if(Geometry.registered[g].geometryName === geometryType.name){
		// 		console.log("Found an already initialized geometry")
		// 		return Geometry.registered[g];
		// 	}
		// }
		//register this geometry
		// console.log("Creating a new Geometry for : ",geometryType.name)
		Geometry.registered.push(geometry);
		return undefined;

	}



	static modelFromObj(obj, sideWays, centerPoint){
		let points = []
		let faces = []
		let currentColor = "#000000";
		for(let l = 0; l<obj.length; l++){
			if(obj[l].charAt(0) === "v"){
				let coords = obj[l].split(" ");
				if(sideWays){
					let x = 1*(coords[1])
					let z = 1*(coords[2])
					let y = 1*(coords[3])
					points.push(new point3d(x,y,z))
				}
				else{
					let x = 1*(coords[1])
					let y = 1*(coords[2])
					let z = 1*(coords[3])
					points.push(new point3d(x,y,z))
				}

			}
			else if(obj[l].charAt(0) === "f"){
				let pointIndexes = obj[l].split(" ");
				let a = 1*(pointIndexes[1]);
				let b = 1*(pointIndexes[2]);
				let c = 1*(pointIndexes[3]);
				//console.log(pointIndexes[1])
				if(pointIndexes.length === 5){
					let d = 1*(pointIndexes[4]);
					let ps = [points[a-1],points[b-1],points[c-1],points[d-1]]
					faces.push(new Face(ps,a,b,c,currentColor,d))
				}
				else{
					var ps = [points[a-1],points[b-1],points[c-1]]
					faces.push(new Face(ps,a,b,c,currentColor))
				}

			}
			else if(obj[l].charAt(0) === "u"){
				let lineSplit = obj[l].split(" ");
				let color = "#" + lineSplit[1]
				currentColor = color;
			}
		}
		// console.log(points[0])

		if(centerPoint != undefined){
			return new Model(faces, points, centerPoint)
		}
		return new Model(faces,points)
	}



}
Geometry.registered = [];
