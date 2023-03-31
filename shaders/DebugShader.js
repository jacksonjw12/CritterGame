class DebugShader extends ShaderProgram {


	constructor(){
		super("debug",false);
		this.i = 0;

		this.noise = new SimplexNoise(Math.random);
		super.loadShaderSource(DebugShader.vertexShaderSource,DebugShader.fragmentShaderSource);



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

DebugShader.vertexShaderSource = `
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
		
		
		//vec4 objectPos = vec4(0,0,0,1.0);
		//objectPos = objectMV;//uPMatrix * objectPos;
//		objectLocation = vec3(objectMV[3]);
		
	}
`;

DebugShader.fragmentShaderSource = `
	precision mediump float;
	uniform mediump vec4 u_color;
	uniform vec2 u_resolution;
	uniform float u_time;
	uniform float u_random;
	
	varying vec3 ObjectPos;
//	vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
//		vec2 xy = fragCoord - size/2.0;
//		float z = size.y / tan(radians(fieldOfView) / 2.0);
//		return normalize(vec3(xy, -z));
//	}

	void main() {
		vec2 FragCoord = gl_FragCoord.xy ;
		
//		vec2 xy = gl_FragCoord.xy - u_resolution/2.0;
//		float z = 1000. / tan(radians(45.) / 2.0);
//		
//		vec3 rD =  normalize(vec3(xy, -z));

		vec2 xy = FragCoord / u_resolution;
		xy = xy * 2.- vec2(1.);
		xy.x *= u_resolution.x/u_resolution.y;
		
		vec3 pixelPos = vec3(xy, 2.); // Image plane at (0,0,2)
		vec3 eyePos = vec3(0.,0.,5.); // Camera position at (0,0,5)
		vec3 rayDir = normalize(pixelPos - eyePos);
		
		gl_FragColor  = vec4(vec3(rayDir.x),1.0);
		
	}
`;
/*

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Scale and bias uv
    // [0.0, iResolution.x] -> [0.0, 1.0]
    // [0.0, 1.0] 			-> [-1.0, 1.0]
    vec2 xy = fragCoord / iResolution.xy;
	xy = xy * 2.- vec2(1.);
	xy.x *= iResolution.x/iResolution.y;

    // SphereSDF position at (0,0,0)

    vec3 pixelPos = vec3(xy, 2.); // Image plane at (0,0,2)
    vec3 eyePos = vec3(0.,0.,5.); // Camera position at (0,0,5)
    vec3 rayDir = normalize(pixelPos - eyePos);

    float dist = shortestDistanceToSurface(eyePos, rayDir, MIN_DIST, MAX_DIST);

    // Didn't hit anything
    if (dist > MAX_DIST - EPSILON) {
        fragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
    }

    // Hit on the surface
    fragColor = vec4(1.0);
}

 */
ShaderManager.shaderPrograms.push(new DebugShader());
