class CoolShader extends ShaderProgram {


	constructor(){
		super("cool",false);
		this.i = 0;

		this.noise = new SimplexNoise(Math.random);
		super.loadShaderSource(CoolShader.vertexShaderSource,CoolShader.fragmentShaderSource);



	}
	initCustomUniforms(){
		this.timeUniform = gl.getUniformLocation(this.program, "u_time");
		this.randUniform = gl.getUniformLocation(this.program, "u_random");
		this.colorUniform = gl.getUniformLocation(this.program, "u_color");
		this.resolutionUniform = gl.getUniformLocation(this.program, "u_resolution");
		//this.objectScreenLocationUniform = gl.getUniformLocation(this.program,"u_objectScreenLocation")
	}

	updateCustomUniforms(dt,material,object,pMatrix,mvOMatrix){
		gl.uniform4fv(this.colorUniform, material.color);
		gl.uniform1f(this.timeUniform, dt/1000.0);

		let noiseSpeed = 2;
		gl.uniform1f(this.randUniform, this.noise.noise2D(dt/1000 * noiseSpeed, 0));

		gl.uniform2fv(this.resolutionUniform,resolution);

		//let oMatrix = mat4.create();
		//mat4.mul(oMatrix,this.scene.camera.mvMatrix,this.mvOMatrix);

		// mat4.translate(oMatrix,oMatrix,vec3.fromValues(0.5,0.5,0.5));
		// mat4.mul(oMatrix,pMatrix,mvOMatrix);
		// mat4.mul(oMatrix,mvOMatrix,pMatrix);
		// let objectPos = vec4.fromValues(object.pos[0],object.pos[1],object.pos[2],0.0);
		// let screenPos = vec4.transformMat4(vec4.create(),objectPos,oMatrix);
		// //let screenPos = mat4.getTranslation(vec3.create(),mvOMatrix)
		// // console.log(screenPos);
		// // let screenPos = vec3.fromValues(oMatrix[8],oMatrix[15],oMatrix[15]);
		// console.log(screenPos);
		// gl.uniform3fv(this.objectScreenLocationUniform,vec3.fromValues(screenPos.x,screenPos.y,screenPos.z));



	}


}

CoolShader.vertexShaderSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexNormal;
	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	
	
	varying vec3 ObjectPos;
//	varying vec3 FragPos;
	
	//varying vec3 objectLocation;
	void main(void) {
		//FragPos = vec3(uMVMatrix * aVertexPosition);
		
		//mat4 objectMV = uPMatrix * uMVMatrix;
		gl_Position = uPMatrix * uMVMatrix * aVertexPosition;
		
		
		vec4 oPos = uPMatrix * uMVMatrix * vec4(0.0,0.0,0.0,1.0); 
		
		ObjectPos = oPos.xyz / oPos.w;
		ObjectPos = (ObjectPos+1.)/2.;
		//vec4 objectPos = vec4(0,0,0,1.0);
		//objectPos = objectMV;//uPMatrix * objectPos;
//		objectLocation = vec3(objectMV[3]);
		
	}
`;

CoolShader.fragmentShaderSource = `
	precision mediump float;
	uniform mediump vec4 u_color;
	uniform vec2 u_resolution;
	uniform float u_time;
	uniform float u_random;
	
	varying vec3 ObjectPos;
//	varying vec3 FragPos;
	//uniform vec3 u_objectScreenLocation;

	void main() {
		vec2 FragPos = gl_FragCoord.xy/u_resolution;

		vec3 bgColor = vec3(.70,0.6,.25);
		
		vec2 oPos = vec2(ObjectPos.x,ObjectPos.y);
		//vec2 fPos = vec2(gl_FragCoord.x,gl_FragCoord.y);
		float diff = abs(sin( (distance(ObjectPos.xy,FragPos) * 30.) + u_time/1.0));//(objectPos.x/objectPos.w-gl_FragCoord.x);//gl_FragCoord.x/u_resolution.x- 
		
		gl_FragColor  = vec4(diff,diff,diff,1.0);
		
	}
`;

ShaderManager.shaderPrograms.push(new CoolShader());
