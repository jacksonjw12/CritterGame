class PlaneGeometry extends Geometry {

	constructor(args){
		super(PlaneGeometry,{...args,"hasNormals":true});
		if(this.alreadyInitialized !== undefined){
			//this geometry data is already in memory, so use that geometry object
			return this.alreadyInitialized;
		}

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(PlaneGeometry.vertices), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = 4;


		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(PlaneGeometry.normals), gl.STATIC_DRAW);
        this.normalBuffer.itemSize = 3;


	}




}

PlaneGeometry.vertices = [
					 1.0,  1.0,  0.0,
					-1.0,  1.0,  0.0,
					 1.0, -1.0,  0.0,
					-1.0, -1.0,  0.0
				];

PlaneGeometry.normals = [
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
	]
