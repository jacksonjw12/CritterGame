class DefaultShader extends ShaderProgram {


	constructor(){
		super("default",false);
		this.i = 0;

		super.loadShaderSource(DefaultShader.vertexShaderSource,DefaultShader.fragmentShaderSource);




	}
	initCustomUniforms(){
		// this.timeUniform = gl.getUniformLocation(this.program, "u_time");
		// this.randUniform = gl.getUniformLocation(this.program, "rand");
		this.colorUniform = gl.getUniformLocation(this.program, "u_color");
	}

	updateCustomUniforms(dt,material){
		gl.uniform4fv(this.colorUniform, material.color);


		// this.i++
		// gl.uniform1f(this.timeUniform, dt/1000.0);
		// if(this.i % 100 === 0 ){
		// 	gl.uniform1f(this.randUniform, Math.random());
		//
		// }

	}



	// vertexShaderSource = `
	// 	attribute vec3 aVertexPosition;
	// 	attribute vec4 aVertexNormal;
	//
	// 	uniform highp float u_time;
	// 	uniform lowp float rand;
	// 	uniform mat4 uMVMatrix;
	// 	uniform mat4 uPMatrix;
	// 	//varying lowp vec4 vColor;
	//
	// 	uniform highp vec3 lightingDirection;
	// 	uniform highp vec3 ambientLight;
	// 	uniform highp vec3 lightPosition;
	//
	// 	void main(void) {
	// 		//gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	// 		//gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x,aVertexPosition.y,aVertexPosition.z+sin(u_time/(aVertexPosition.y-.5)), 1.0);
	//
	// 		//float zPos = 2.0*sin(u_time)*(1.-sqrt(aVertexPosition.x*aVertexPosition.x+aVertexPosition.y*aVertexPosition.y));
	// 		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x,aVertexPosition.y,aVertexPosition.z, 1.0);
	//
	// 		//vColor = vec4(aVertexPosition.x,aVertexPosition.y,0,1.0);
	// 	}
	// `;
	//
	// fragmentShaderSource = `
	// 	precision mediump float;
	// 	//uniform vec2 resolution;
	// 	//uniform bool intMod;
	// 	uniform highp float u_time;
	// 	uniform lowp float rand;
	// 	//varying lowp vec4 vColor;
	//
	//
	// 	void main() {
	// 		//vec2 v_texCoord = gl_FragCoord.xy / resolution.xy;
	// 		//float depthColor = 1.-(gl_FragCoord.z-.99)*100.;
	// 		//gl_FragColor =  vec4(abs(gl_FragCoord.x + u_time*100.-(800.)) / 800.,((gl_FragCoord.y)-300.) / 300.,0,1.0);
	// 		gl_FragColor = vec4(0.5,0.5,0.5,1.0);//vec4(depthColor+vColor.x,depthColor+vColor.y,depthColor,1.0);
	// 	}
	// `;


}

DefaultShader.vertexShaderSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexNormal;
	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	
	void main(void) {
		
		gl_Position = uPMatrix * uMVMatrix * aVertexPosition;
		
	}
`;

DefaultShader.fragmentShaderSource = `
	precision mediump float;
	uniform mediump vec4 u_color;

	void main() {

		gl_FragColor = u_color;
		// gl_FragColor.rgb *= vLighting;
	}
`;

ShaderManager.shaderPrograms.push(new DefaultShader());
