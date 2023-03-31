class ArrowGeometry extends Geometry {

	constructor(args){
		super(ArrowGeometry,{...args,"renderMethod":gl.TRIANGLES});
		if(this.alreadyInitialized !== undefined){
			//this geometry data is already in memory, so use that geometry object
			return this.alreadyInitialized;
		}

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ArrowGeometry.vertices), gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = 24;



	}






}

ArrowGeometry.vertices = [
    //in xz axis
    //base left tri
    -.25,0.0,0.0,
    -.25,0.0,0.8,
    .25,0.0,0.8,

    //base right tri
    -.25,0.0,0.0,
    .25,0.0,0.0,
    .25,0.0,0.8,

    //arrowhead
    -.5,0.0,0.8,
    .5,0.0,0.8,
    0.0,0.0,1.0,


    //in yz axis
    //base left tri
    0.0,-.25,0.0,
    0.0,-.25,0.8,
    0.0,.25,0.8,

    //base right tri
    0.0,-.25,0.0,
    0.0,.25,0.0,
    0.0,.25,0.8,

    //arrowhead
    0.0,-.5,0.8,
    0.0,.5,0.8,
    0.0,0,1.0,


    //square
    0.4,0.4,0.8,
    0.4,0.6,0.8,
    0.6,0.6,0.8,

    0.4,0.4,0.8,
    0.6,0.4,0.8,
    0.6,0.6,0.8,


    //debug



    ];
