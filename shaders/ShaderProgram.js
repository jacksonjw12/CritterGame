
class ShaderProgram {

	constructor(name,usesNormals){

		this.name = name;
		this.usesNormals = (usesNormals !== undefined)?usesNormals:false;
		this.attributes = [];
		this.uniforms = [];
		this.shadersSourceReady = false;
	}
	loadShaderSource(vertexShaderSource,fragmentShaderSource){
		this.vertexShaderSource = vertexShaderSource;
		this.fragmentShaderSource = fragmentShaderSource;
		this.shadersSourceReady = true;
	}
	init(){
		if(!this.shadersSourceReady){
			console.info("Shader: "+this.name + " has no shader sources loaded");
			return;
		}

		//compile vertex shader
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(this.vertexShader, this.vertexShaderSource);
		gl.compileShader(this.vertexShader);
		if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
			console.log(this.name)
			console.log(gl.getShaderInfoLog(this.vertexShader));

			return null;
		}

		//compile fragment shader
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(this.fragmentShader, this.fragmentShaderSource);
		gl.compileShader(this.fragmentShader);
		if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
			console.log(this.name)
			console.log(gl.getShaderInfoLog(this.fragmentShader));
			return null;
		}

		//link shaders and create program
		this.program = gl.createProgram();
		gl.attachShader(this.program, this.vertexShader);
		gl.attachShader(this.program, this.fragmentShader);
		gl.linkProgram(this.program);
		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.log("Could not initialise shader: ",this.name);
			return null;
		}

		this.initCommonUniformsAndAttributes();
		this.initCustomUniforms();
		// console.log(this.program)
	}
	initCustomUniforms(){
		//to be overloaded by subclass
		console.log("not overloaded by subclass");
	}

	// updateCustomUniforms(dt,material){
	// 	//to be overloaded by subclass
	// }

	updatePerGeometryUniforms(){

	}

	initCommonUniformsAndAttributes(){
		this.attributes.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
		// gl.enableVertexAttribArray(this.attributes.vertexPositionAttribute);

		this.uniforms.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
		this.uniforms.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");
		this.uniforms.uWorldMatrix = gl.getUniformLocation(this.program, "uWorldMatrix");

		if(this.usesNormals){
			console.log("using normals")
			this.attributes.normalAttribute = gl.getAttribLocation(this.program, "aVertexNormal");
			// gl.enableVertexAttribArray(this.attributes.normalAttribute);

			this.uniforms.normalMatrix = gl.getUniformLocation(this.program, "uNormalMatrix");

			//for lighting
			this.uniforms.lightingDirection = gl.getUniformLocation(this.program,"lightingDirection");
			this.uniforms.ambientLight = gl.getUniformLocation(this.program,"ambientLight");
			this.uniforms.lightPosition = gl.getUniformLocation(this.program,"lightPosition");


		}
		if(this.usesInverts) {
			this.uniforms.invuPMatrixUniform = gl.getUniformLocation(this.program, "invuPMatrix");
			this.uniforms.invuMVMatrixUniform = gl.getUniformLocation(this.program, "invuMVMatrix");
			this.uniforms.cameraPosUniform = gl.getUniformLocation(this.program, "cameraPos");
		}

	}
	updateMatrixUniforms(pMatrix, mvMatrix,lightingDirection,ambientLighting,lightPosition,worldMatrix, inverts, cameraPos){
		gl.uniformMatrix4fv(this.uniforms.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.uniforms.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.uniforms.uWorldMatrix,false,worldMatrix);

		if(this.usesNormals){


			gl.uniform3fv(this.uniforms.ambientLight,ambientLighting);
			gl.uniform3fv(this.uniforms.lightingDirection,lightingDirection)
			gl.uniform3fv(this.uniforms.lightPosition,lightPosition)



			let normalMatrix = mat4.create();
			mat4.invert(normalMatrix, mvMatrix);
			mat4.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix4fv(this.uniforms.normalMatrix, false, normalMatrix);
		}
		if(this.usesInverts) {
			gl.uniformMatrix4fv(this.uniforms.invuPMatrixUniform, false, inverts.invuPMatrix);
			gl.uniformMatrix4fv(this.uniforms.invuMVMatrixUniform, false, inverts.invuMVMatrix);
			gl.uniformMatrix4fv(this.uniforms.cameraPosUniform,false,vec4.fromValues(cameraPos[0],cameraPos[1],cameraPos[2]));
		}

	}
}
