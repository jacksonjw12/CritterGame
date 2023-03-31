class DepthShader extends ShaderProgram {


	constructor(){
		super("depth",false);

		super.loadShaderSource(DepthShader.vertexShaderSource,DepthShader.fragmentShaderSource);



	}
	initCustomUniforms(){
		this.timeUniform = gl.getUniformLocation(this.program, "u_time");
	}

	updateCustomUniforms(dt,shaderOptions){
		gl.uniform1f(this.timeUniform, dt/1000.0);

	}






}

DepthShader.vertexShaderSource = `
	attribute vec3 aVertexPosition;
	//attribute vec4 aVertexNormal;
	uniform highp float u_time;

	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	
	varying mediump float origZ;
	varying mediump float newZ;
	void main(void) {
		//gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
		//gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x,aVertexPosition.y,aVertexPosition.z+sin(u_time/(aVertexPosition.y-.5)), 1.0);
		float zPos = aVertexPosition.z+2.0*sin(u_time)*(1.-sqrt(aVertexPosition.x*aVertexPosition.x+aVertexPosition.y*aVertexPosition.y));
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x,aVertexPosition.y,zPos, 1.0);
		// float zPos = aVertexPosition.z;
		// gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x,aVertexPosition.y,aVertexPosition.z, 1.0);

		origZ = aVertexPosition.z;
		newZ = zPos;
	}
`;

DepthShader.fragmentShaderSource = `
	precision mediump float;
	uniform highp float u_time;
	varying mediump float origZ;
	varying mediump float newZ;

	void main() {
		
		float depthColor = sqrt(abs(newZ-origZ) / 3.0);//1.-(gl_FragCoord.z);
		
		gl_FragColor = vec4(depthColor,depthColor,depthColor,1.0);
	}
`;

ShaderManager.shaderPrograms.push(new DepthShader());
