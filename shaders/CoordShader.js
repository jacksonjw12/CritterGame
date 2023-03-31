class CoordShader extends ShaderProgram {


	constructor(){
		super("coords",false);

		super.loadShaderSource(CoordShader.vertexShaderSource,CoordShader.fragmentShaderSource);


	}
	initCustomUniforms(){
		//this.timeUniform = gl.getUniformLocation(this.program, "u_time");
        this.colorUniform = gl.getUniformLocation(this.program, "u_color");

	}


	updateCustomUniforms(dt){

	}

	updatePerGeometryUniforms(g){
	    let color;
	    if(g === 0){
	         color = vec4.fromValues(1.0,0.0,0.0,1.0);
        }
	    else if(g === 1){
	        color = vec4.fromValues(0.0,1.0,0.0,1.0);
        }
	    else{
	        color = vec4.fromValues(0.0,0.0,1.0,1.0);
        }
	    gl.uniform4fv(this.colorUniform, color);


	}


}

CoordShader.vertexShaderSource = `
	attribute vec3 aVertexPosition;
	
	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	varying vec3 locGradient;
	
	void main(void) {
	    locGradient = .5 + aVertexPosition.xyz/2.;
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
		
	}
`;

CoordShader.fragmentShaderSource = `
	precision mediump float;
	uniform mediump vec4 u_color;
    varying vec3 locGradient;
	void main() {

		gl_FragColor = vec4(u_color.xyz * locGradient,1.0);
	}
`;

ShaderManager.shaderPrograms.push(new CoordShader());
