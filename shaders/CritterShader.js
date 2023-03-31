class CritterShader extends ShaderProgram {


	constructor(){
		super("critter",true);

		super.loadShaderSource(PhongShader.vertexShaderSource,PhongShader.fragmentShaderSource);

		this.ambientLight = vec3.fromValues(0.2,0.2,0.2);


	}
	initCustomUniforms(){
		this.colorUniform = gl.getUniformLocation(this.program, "u_color");
		this.ambientLightUniform = gl.getUniformLocation(this.program,"ambientLight")
		// this.randUniform = gl.getUniformLocation(this.program, "rand");
	}

	updateCustomUniforms(dt,material){
		//this.colorUniform = shaderOptions.color;
		//console.log(shaderOptions)
		gl.uniform4fv(this.colorUniform, material.color);
		gl.uniform3fv(this.ambientLightUniform,this.ambientLight);

	}




}

PhongShader.vertexShaderSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexNormal;

	
	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	uniform mat4 uNormalMatrix;
	
	uniform mediump vec4 u_color;

	
	uniform highp vec3 lightingDirection;
	uniform highp vec3 ambientLight;
	uniform highp vec3 lightPosition;
	
	
	
	//uniform int mode;
	
	varying vec4 forFragColor;
	// const vec3 lightPos = vec3(1.0, 1.0, 1.0);
	//const vec3 diffuseColor = vec3(0.5, 0.0, 0.0);
	const vec3 specColor = vec3(1.0, 1.0, 1.0);
	
	void main(void) {
		int mode = 2;
		
		gl_Position = uPMatrix * uMVMatrix * aVertexPosition;
		
		highp vec3 directionalLightColor = vec3(1, 1, 1);
		
		highp vec3 transformedNormal = (uNormalMatrix * aVertexNormal).xyz;
		
		vec4 vertPos4 = uMVMatrix * aVertexPosition;
		vec3 vertPos = vec3(vertPos4) / vertPos4.w;
		vec3 lightDir = normalize(lightPosition - vertPos);
		vec3 reflectDir = reflect(-lightDir, transformedNormal);
		vec3 viewDir = normalize(-vertPos);
		
		float lambertian =  max(dot(lightDir,transformedNormal), 0.0);
		float specular = 0.0;
		
		
		if(lambertian > 0.0) {
			float specAngle = max(dot(reflectDir, viewDir), 0.0);
			specular = pow(specAngle, 4.0);
		
			// the exponent controls the shininess (try mode 2)
			if(mode == 2) {
				specular = pow(specAngle, 2.0);
			}
			
			// according to the rendering equation we would need to multiply
			// with the the "lambertian", but this has little visual effect
			if(mode == 3) {specular *= lambertian;}
			// switch to mode 4 to turn off the specular component
			if(mode == 4) {specular *= 0.0;}
		}
		forFragColor = vec4(ambientLight.x + lambertian*u_color.xyz + specular*specColor, 1.0);
	
		
		
		// highp float directional = max(dot(transformedNormal.xyz, lightingDirection), 0.0);
		// vLighting = ambientLight + (directionalLightColor * directional);
		
	}
	
	

	
	
`;

PhongShader.fragmentShaderSource = `
	precision mediump float;
	//uniform mediump vec4 u_color;
	
	//varying highp vec3 vLighting;
	varying vec4 forFragColor;

	void main() {
		gl_FragColor = forFragColor;
		//gl_FragColor = u_color;
		//gl_FragColor.rgb *= vLighting;
	}
`;

ShaderManager.shaderPrograms.push(new CritterShader());
