class Object {

	constructor(args){//pos,rot,scale,shaderProgram,renderMethod){
		this.id = Object.makeId();
		this.pos = (args.pos !== undefined)?args.pos:vec3.fromValues(0,0,0);
		this.rot = (args.rot !== undefined)?args.rot:quat.fromEuler(quat.create(),0,0,0);
		this.scale = (args.scale !== undefined)?args.scale:vec3.fromValues(1,1,1);
		this.absolutePosition = false;

		this.geometry = (args.geometry !== undefined)?args.geometry:new Cube();


		this.constructiveGeometry = Array.isArray(this.geometry);


		if(!this.constructiveGeometry){
			this.geometry = [this.geometry];

		}

		this.geometryDeltas = (args.geometryDeltas !== undefined)?args.geometryDeltas:this.geometry.map(g=>Object.gd());




		this.material = (args.material !== undefined)?args.material:new defaultMaterial(args.materialOptions,this.geometry);

		this.pointLight = (args.pointLight !== undefined)?args.pointLight:false;

		this.action = (args.action !== undefined)?args.action:undefined;

		this.transparent = (args.transparent !== undefined)?args.transparent:false;
	}
	pointInDirection(location){
		let mvMatrix = mat4.fromRotationTranslationScale(mat4.create(),this.rot,this.pos,this.scale)

		mat4.lookAt(mvMatrix,this.pos,location,vec3.fromValues(0,1,0))
		this.rot = mat4.getRotation(quat.create(),mvMatrix);
		// console.log(this.rot);
		//mat4.getRotation(this.#rot,this.#viewMatrix);
	}

	//currently unused, might be useful in future
	static registerObject(o){
		Object.objects.push(o)
	}

	static deleteObject(o){
		for(let i = 0; i < Object.objects.length; i++){
			if(Object.objects[i].id === o.id){
				return Object.objects.splice(i,1);
			}
		}
	}

	static makeId(){
		return Object.objects.length;
	}




}
Object.objects = [];
Object.gd = ()=>{return {"pos":vec3.fromValues(0,0,0),"rot":quat.fromEuler(quat.create(),0,0,0),"scale":vec3.fromValues(1,1,1)}}
