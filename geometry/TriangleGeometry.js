class TriangleGeometry extends Geometry {

	constructor(args){
		super(TriangleGeometry,{...args,"hasNormals":true});
		if(this.alreadyInitialized !== undefined){
			//this geometry data is already in memory, so use that geometry object
			return this.alreadyInitialized;
		}

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TriangleGeometry.vertices), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = 3;

		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TriangleGeometry.normals), gl.STATIC_DRAW);
        this.normalBuffer.itemSize = 3;

	}





}




TriangleGeometry.vertices = [
			 0.0,  1.0,  0.0,
			-1.0, -1.0,  0.0,
			 1.0, -1.0,  0.0
		];

TriangleGeometry.normals = [
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
	]
