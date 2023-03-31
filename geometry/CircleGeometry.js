class CircleGeometry extends Geometry {

	constructor(args){
		super(CircleGeometry,{...args,"renderMethod":gl.TRIANGLE_FAN,"hasNormals":true});
		if(this.alreadyInitialized !== undefined){
			//this geometry data is already in memory, so use that geometry object
			return this.alreadyInitialized;
		}

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);


		if(!CircleGeometry.vertices){
			CircleGeometry.createVertexData(100,1);
		}

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CircleGeometry.vertices), gl.STATIC_DRAW);

		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = CircleGeometry.numItems;


		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CircleGeometry.normals), gl.STATIC_DRAW);
		this.vertexPositionBuffer.numItems = CircleGeometry.numItems;
        this.normalBuffer.itemSize = 3;



	}

	static createVertexData(res,radius){
		CircleGeometry.res = res;
		CircleGeometry.vertices = [0,0,0];

		for(let i =0; i < res+1; i++){
			CircleGeometry.vertices.push( radius* Math.cos( i*(Math.PI*2/res) ) );
			CircleGeometry.vertices.push( radius* Math.sin( i*(Math.PI*2/res) ) );
			CircleGeometry.vertices.push(0);
		}
		CircleGeometry.numItems = res+2;
		CircleGeometry.createNormalData();
	}

	static createNormalData(){

		CircleGeometry.normals = [];

		for(let i =0; i < CircleGeometry.res+2; i++){
			CircleGeometry.normals.push( 0 );
			CircleGeometry.normals.push( 0 );
			CircleGeometry.normals.push( 1 );
		}
		CircleGeometry.numItems = (CircleGeometry.res+1)+1;
	}


}
