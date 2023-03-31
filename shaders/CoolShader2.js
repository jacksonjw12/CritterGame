class CoolShader2 extends ShaderProgram {


	constructor(){
		super("cool2",false);


		this.noise = new SimplexNoise();
		super.loadShaderSource(CoolShader2.vertexShaderSource,CoolShader2.fragmentShaderSource);

		this.constants = this.getNoiseVector(Math.random()*10000,Math.random()*10000,4,[0,1]);

		console.log(this.constants);

	}
	initCustomUniforms(){
		this.timeUniform = gl.getUniformLocation(this.program, "u_time");
		this.randUniform = gl.getUniformLocation(this.program, "u_random");
		this.costantUniform = gl.getUniformLocation(this.program, "u_constants");
		this.colorUniform = gl.getUniformLocation(this.program, "u_color");
		this.resolutionUniform = gl.getUniformLocation(this.program, "u_resolution");
		this.objectScreenLocationUniform = gl.getUniformLocation(this.program,"u_objectScreenLocation");

		this.inverseUniform = gl.getUniformLocation(this.program,"u_inverse");

	}
	getNoiseVector(dt,y,size,bounds){
		size = (size !== undefined)?size:3;
		bounds = (bounds !== undefined)?bounds:[0,1];
		let range = bounds[1]-bounds[0];
		if(isNaN(range) || range === 0){
			return [];
		}
		let noiseSpeed = 2;
		let noiseYStep = 100;
		let x = dt/1000. * noiseSpeed;

		let ret = [];
		for(let i = 0; i < size; i++){
			let val = this.noise.noise2D(x,y+noiseYStep*i)/2. + .5
			val *= range;
			val += bounds[0];
			ret.push(val);
		}
		return new Float32Array(ret);
	}
	updateCustomUniforms(dt,material,object,pMatrix,mvOMatrix){
		gl.uniform4fv(this.colorUniform, material.color);
		gl.uniform1f(this.timeUniform, dt/1000.0);

		gl.uniform1i( this.inverseUniform,(material.materialOptions.inverse !== undefined)?material.materialOptions.inverse:false);




		gl.uniform3fv(this.randUniform, this.getNoiseVector(dt,0));
		gl.uniform4fv(this.costantUniform, this.constants);

		gl.uniform2fv(this.resolutionUniform,resolution);

		let oMatrix = mat4.create();
		//mat4.mul(oMatrix,oMatrix,mvOMatrix);
		mat4.mul(oMatrix,mvOMatrix,pMatrix);

		gl.uniform3fv(this.objectScreenLocationUniform,mat4.getTranslation(vec3.create(),oMatrix));



	}


}

CoolShader2.vertexShaderSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexNormal;
	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	
	
	
	varying vec3 FragPos;
	varying vec3 ObjectPos;
	//varying vec3 objectLocation;
	void main(void) {
		//FragPos = vec3(uMVMatrix * aVertexPosition);
		
		//mat4 objectMV = uPMatrix * uMVMatrix;
		gl_Position = uPMatrix * uMVMatrix * aVertexPosition;
		
		
		vec4 oPos = uPMatrix * uMVMatrix * vec4(0.,0.,0.,1.0); 
		
		ObjectPos = oPos.xyz / oPos.w;
		//FragPos = gl_Position.xyz / gl_Position.w;
//		FragPos += vec3(1.,1.,1.);
//		FragPos /= 2.;
		
//		objectLocation = vec3(objectMV[3]);
		
	}
`;

CoolShader2.fragmentShaderSource = `
	precision mediump float;
	uniform mediump vec4 u_color;
	uniform vec2 u_resolution;
	uniform float u_time;
	uniform vec3 u_random;
	uniform vec4 u_constants;
	uniform bool u_inverse;
	
	uniform vec3 u_objectScreenLocation;
	varying vec3 ObjectPos;
	
	//varying vec3 FragPos;

	void main() {
		vec2 FragPos = gl_FragCoord.xy/u_resolution;

		vec3 bgColor = vec3(0.1,0.0,0.2);
		//gl_FragColor = vec4(abs(mod(FragPos.x*10.0,1.0)),0.0,0.0,1.0);
//		gl_FragColor = vec4(0.0,0.0,0.0,1.0);
		//if(mod(gl_FragCoord.x,50.0) < 10. && mod(gl_FragCoord.y,50.0) < 10.) {
		//vec2 fragCoord = gl_FragCoord.xy - u_objectScreenLocation.xy - u_resolution/2.;
		
		float scale = 50.;
		
		float dist = 10.;//distance(abs(n2 - modPos),n1);
		gl_FragColor = vec4( ( bgColor - pow(dist/50.0,10.0) ) , 1.0);// + vec4(vec3(abs(sin(FragPos.x * FragPos.y))/4.0),1.0);
	
	
		//First point pos
		float stepSize = .4;
		
		vec2 step = vec2(stepSize * u_resolution.y/u_resolution.x,stepSize);
		
		
		
		float stepNum = floor(FragPos.x / step.x);
		
		//vec2 starObject = FragPos.xy;

		
		vec2 object = vec2(mod( FragPos.xy,step)) /step;
		//object.x += star.x/10.;
//		float objectX = mod(FragPos.x,step.x)/step.x ;
//		float objectY = mod(FragPos.y,step.y)/step.y;

		
		
		float color = 0.0;
		float c,d, uc;
		vec2 starStepX = vec2(1.0,0);
		vec2 starStepY = vec2(0,1.0);
		vec2 star, starSpeed;
		vec3 fColor;
		vec4 starRadiuses = .25 - u_constants/4.;
		float avgStarRadius = dot(starRadiuses,vec4(1.))/3.3;
		vec4 minDist = vec4(1.0,1.0,1.0,1.0);
		vec4 avgDist = vec4(0,0,0,0);
		for(int i = 0; i<4; i++ ){
			
			uc = 2.0*(u_constants[i] - .5);
			
			// = 0.25-u_constants[i]/4.;
			starSpeed = vec2(uc + sin(uc*u_time / 100.),uc + cos(1.5+ uc*u_time / 100.))/4.0;
			star = mod(vec2(u_time*starSpeed.x + u_constants[i] +ObjectPos.x,u_time*starSpeed.y + u_constants[i] +ObjectPos.y),vec2(1.0,1.0));
			

			//center column
			d = distance(object,star);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += min(d,1.);//c;
			
			d = distance(object,star-starStepY);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += min(d,1.);//color += d;color += c;
			
			d = distance(object,star+starStepY);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += min(d,1.);//color += c;
			
			//left column
			star -= starStepX;
			
			d = distance(object,star);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += min(d,1.);//color += c;
			
			d = distance(object,star-starStepY);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += min(d,1.);//color += c;
			
			d = distance(object,star+starStepY);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += min(d,1.);//color += c;
			
			//right column
			star +=2.* starStepX;
			
			d = distance(object,star);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += min(d,.3);//color += c;
			
			d = distance(object,star-starStepY);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += max(d,.3);//color += c;
			
			d = distance(object,star+starStepY);
			if(d < minDist[i]){
				minDist[i] = d;
			}
			avgDist[i] += d;
			//c = 1.-smoothstep(0.0,starRadius,d);
			color += min(d,1.);//color += c;
			
			
			
		};
		gl_FragColor = vec4(bgColor,1.0);
		
		//avgDist /= 800000.;
		
		vec4 iMin =minDist;
		float min = pow(length(iMin)/2.,2.);
		//float min2 = length(avgDist)/2.;
//		
		
		
		if(min < .17){
			gl_FragColor = vec4(gl_FragColor.xyz + vec3(smoothstep(0.0,0.5,min)),1.0);
		}
		
		if(u_inverse){
			gl_FragColor = vec4(vec3(1.0)-gl_FragColor.xyz,1.0);
		}
		
		
			
//		}
//		else{
//			//gl_FragColor =  vec4(gl_FragColor.xyz + vec3(smoothstep(0.0,0.5,min)),1.0);
//		}
		
		
		
		
		
		//color/=9.;
		
		
//		if(color < .3){
//			discard;
//		}
		
		
		
		//gl_FragColor =  vec4(bgColor +vec3(color),1.0);
//		if( d< .1 || d>1.  ){
//		//if(mod(FragPos2.x,.025) < .0125 && mod(FragPos2.y,.025) < .0125){
//			gl_FragColor = vec4(1.,1.,1.,1.);
//		}
//		else{
//			gl_FragColor = vec4(bgColor,1.0);
//		}
		
		//gl_FragColor = vec4(FragPos.x,0.,0.,1.);


		//}
		
		//gl_FragColor = bgColor;// + vec4(vec3(abs(sin(FragPos.x * FragPos.y))/4.0),1.0);
		// gl_FragColor.rgb *= vLighting;
	}
`;

ShaderManager.shaderPrograms.push(new CoolShader2());
