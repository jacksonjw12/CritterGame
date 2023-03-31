class GridShader extends ShaderProgram {


	constructor(){
		super("grid",false);

		super.loadShaderSource(CoordShader.vertexShaderSource,CoordShader.fragmentShaderSource);
		this.usesInverts = true;


	}
	initCustomUniforms(){
		//this.timeUniform = gl.getUniformLocation(this.program, "u_time");
        this.colorUniform = gl.getUniformLocation(this.program, "u_color");
        this.gridDimmsUniform = gl.getUniformLocation(this.program, "gridDimms");
        this.textCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord");

	}


	updateCustomUniforms(dt){

	}
	extraStuff(gl, geometry) {
		
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

	    const gridStats = vec3.fromValues(0.1,0.01,0.5);
	    gl.uniform3fv(this.gridDimmsUniform, gridStats);


	}


}

CoordShader.vertexShaderSource = `
	attribute vec3 aVertexPosition;
	
	uniform highp mat4 uMVMatrix;
	uniform highp mat4 uPMatrix;

	varying vec3 locGradient;

	varying vec2 pos;
	
	void main(void) {
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
		pos = gl_Position.xy;
	}
`;

CoordShader.fragmentShaderSource = `
	precision mediump float;
	uniform mediump vec4 u_color;
	uniform vec3 gridDimms; 
    varying vec3 locGradient;
    varying vec2 pos;

    float grid_intensity = 0.7;

    uniform highp mat4 invuMVMatrix;
	uniform highp mat4 invuPMatrix;
	uniform mediump vec4 cameraPos;
   


    float grid(vec2 fragCoordO, float space, float gridWidth) {
    	vec4 fragCoord = invuPMatrix * invuMVMatrix * vec4(fragCoordO.x,0, fragCoordO.y, 1.0);
	    vec2 p = fragCoord.xy - vec2(.5);
	    vec2 size = vec2(gridWidth, gridWidth);
	    
	    vec2 a1 = mod(p - size, space);
	    vec2 a2 = mod(p + size, space);
	    vec2 a = a2 - a1;
	       
	    float g = min(a.x, a.y);
	    return clamp(g, 0., 1.0);
	}


	void main() {
		// float gridDist = 0.1;
		// float gridBorder = 0.02;
		// float xDiff = sin(gl_FragCoord.x);
		// float yDiff = sin(gl_FragCoord.y);

		// float color = clamp(xDiff + yDiff,gridDist-gridBorder, gridDist);
		// color -= gridDist;
		vec3 col = vec3(.7,.7,.7);
    
	    // Gradient across screen
	    vec2 p = gl_FragCoord.xy;           // Point
		// vec2 c = iResolution.xy / 2.0;   // Center
	    // col *= (1.0 - length(c - p)/iResolution.x*0.7);
	    // vec3 col = vec3(0.7,0.7,0.7);
		
	    // 2-size grid
	    col *= clamp(grid(pos, 20., 0.5), grid_intensity, 1.0);
	    
	    // Output to screen
	    // gl_FragColor = vec4(col,1.0);

	    vec4 rayClip = vec4(pos, -1.0, 1.0);
	    vec4 rayEye = rayClip;//invuPMatrix * rayClip;
	    rayEye = vec4(rayEye.xy, -1.0, 0.0);	

	    vec4 rayWorld = rayEye;//invuMVMatrix * rayEye;

	    float searchScale = 100.0;

	    vec4 start = vec4(cameraPos.xyz,0.0) + rayWorld;
	    vec4 normRay = normalize(rayWorld);
	    float normY = sign(rayWorld.y) * normRay.y;

	    float diffUnits = abs(cameraPos.y) + 1.8;
	    float scale = abs(diffUnits / normRay.y);
	    vec4 scaleRay = scale * normRay + vec4(cameraPos.xyz,0.0);
	    vec4 modScale = mod(scaleRay, 10.0) / 10.0;
		gl_FragColor = vec4(normRay.x,normRay.x,normRay.x,1.0);
	    // gl_FragColor = vec4(vec3(scale / 20.0),1.0);

	    // gl_FragColor = vec4(vec3(modScale.x + modScale.y),1.0);
		// gl_FragColor = vec4(pos,0.0,1.0);
	}
`;

ShaderManager.shaderPrograms.push(new GridShader());
