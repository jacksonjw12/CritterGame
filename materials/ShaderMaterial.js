class ShaderMaterial extends Material{


    constructor(shaderName, materialOptions){
        super(ShaderManager.getShader(shaderName),materialOptions);


    }


}
