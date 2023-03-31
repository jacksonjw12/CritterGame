
class ShaderManager {


	constructor(){

		//ShaderManager.shaderPrograms = [new DefaultShader(),new SimpleColorShader(),new DepthShader(),new PhongShader(),new ComprehensiveLightingShader()];
		for(let s = 0; s < ShaderManager.shaderPrograms.length; s++){
			ShaderManager.shaderPrograms[s].init();
		}
		ShaderManager.defaultShader = ShaderManager.getShader("default");
		console.log(ShaderManager.defaultShader);
		gl.useProgram(ShaderManager.defaultShader.program);

	}


	static getShader(shaderName){
		for(let s = 0; s< ShaderManager.shaderPrograms.length; s++){
			if(ShaderManager.shaderPrograms[s].name === shaderName){
				return ShaderManager.shaderPrograms[s];
			}
		}
		return ShaderManager.defaultShader;
	}

	static getDefaultShader(){
		return ShaderManager.defaultShader;
	}



}
ShaderManager.shaderPrograms = [];
