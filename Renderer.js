let showDebug = false;

function debugInfo(tag,info){


	if(showDebug){
		console.log(tag, info);
	}

}

class Renderer{

	constructor(){

		//used for drawing each object in the scene
		// this.mvOMatrix = mat4.create();

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		///gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


		gl.enable(gl.DEPTH_TEST);
		// gl.depthMask(false);

		// this.scene = new FlightScene();
		// this.scene = new PlaneScene();
		// this.scene = new TestScene();
		this.scene = new CritterScene();
		// this.scene = new Scene();
		// this.scene.addObject(new Cube({
		// 	"scale":vec3.fromValues(1,1,1),
		// 	"shader":ShaderManager.getShader("simpleColor"),
		// 	"shaderOptions":{
		// 		"color":vec4.fromValues(.5,.5,.5,1.)
		// 	}
		// }))
		//this.setupTestScene();
		this.lastDT = 0;

		this.tick = (dt)=> {
			showDebug = (dt - this.lastDT > 2000);
			if(showDebug){
				this.lastDT = dt;
			}

			requestAnimationFrame(this.tick);

			this.scene.animate(dt);
			this.drawScene(dt);

		}
		this.tick(0);

	}



	drawScene(dt) {


		// if(dt > 1000){
		// 	return;
		// }
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



		let object,objectShader,geometry,objectMaterial;
		// console.log(this.scene.objects[0])

		let blending = false;
		gl.disable(gl.BLEND);
		gl.depthMask(true);

		let camera = this.scene.camera;
		let viewMatrix = camera.getViewMatrix();
		const inverts = camera.getCameraInverts();

		// let cameraRotInverse = quat.fromEuler(quat.create(),-camera.rot[0],-camera.rot[1],-camera.rot[2]);
		// let rotAroundCamera = mat4.fromQuat(mat4.create(),cameraRotInverse);
		//
		//
		// let cameraPosInverse = vec3.scale(vec3.create(),camera.pos,1);
		// this.debugInfo("cameraposInverse: ",cameraPosInverse,false);
		// let viewSpace = mat4.fromTranslation(mat4.create(),cameraPosInverse);
		//
		// let cameraTransformation = mat4.mul(mat4.create(),rotAroundCamera,viewSpace)//mat4.fromTranslationRotation(mat4.create(),cameraRotInverse,cameraPosInverse);
		for(let o = 0; o < this.scene.objects.length; o++){
			object = this.scene.objects[o];
			objectMaterial = object.material;
			objectShader = objectMaterial.shader;
			geometry = object.geometry;
			//let mvMatrix = mat4.create();

			



			//use the correct shader for this object

			
			// gl.useProgram(objectShader.program);

			// let perGeometryMaterials = false;
			for(let g = 0; g< geometry.length; g++){
				
				let material = objectMaterial
				if(geometry[g].material) {
					
					material = geometry[g].material;
					// shader = geometry[g].material.shader
					// perGeometryMaterials = true;
				}
				let shader = material.shader;
				if(!blending && object.transparent){
					blending = true;
					gl.enable(gl.BLEND);
					gl.depthMask(false);
				}
				gl.useProgram(shader.program);
				
				// gl.useProgram(shader.program);

				//get the model -> world transformation matrix
				let mvGMatrix = mat4.fromRotationTranslationScale(mat4.create(),object.geometryDeltas[g].rot,object.geometryDeltas[g].pos,object.geometryDeltas[g].scale)
				//mat4.mul(mvGMatrix,mvGMatrix,mvMatrix);

				let worldMatrix = mat4.fromRotationTranslationScale(mat4.create(),object.rot,object.pos,object.scale)
				if(object === this.scene.coords && g===0){
					let o = vec4.fromValues(0,0,0,1);
					//debugInfo("transformedOrigin",vec4.transformMat4(vec4.create(),o,mvMatrix))
				}

				mat4.mul(worldMatrix,worldMatrix,mvGMatrix);
				let mvMatrix = worldMatrix;
				if(!object.absolutePosition){
					mvMatrix = mat4.mul(mat4.create(),viewMatrix,mvMatrix);
				}





				//pass the vertex shader the camera and vertex data
				shader.updateMatrixUniforms(camera.pMatrix,mvMatrix,this.scene.lightingDirection,this.scene.ambientLighting,this.scene.lightPosition,worldMatrix, inverts, camera.pos);
				//give the shader any custom uniforms that it might need
				shader.updateCustomUniforms(dt,material,object,camera.pMatrix,mvMatrix,camera)
				shader.updatePerGeometryUniforms(g);


				gl.bindBuffer(gl.ARRAY_BUFFER, geometry[g].vertexPositionBuffer);
				gl.vertexAttribPointer(shader.attributes.vertexPositionAttribute, geometry[g].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(shader.attributes.vertexPositionAttribute)
				if(geometry[g].hasNormals && shader.usesNormals){
					gl.bindBuffer(gl.ARRAY_BUFFER, geometry[g].normalBuffer);
					gl.vertexAttribPointer(shader.attributes.normalAttribute, geometry[g].normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
					gl.enableVertexAttribArray(shader.attributes.normalAttribute);

				}
				if(shader.extraStuff) {
					shader.extraStuff(gl, geometry);
				}

				//draw to the screen
				gl.drawArrays(geometry[g].renderMethod, 0, geometry[g].vertexPositionBuffer.numItems);
			}
		}


	}

}
