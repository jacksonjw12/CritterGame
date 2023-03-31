class defaultMaterial extends Material{


    constructor(materialOptions,geometry){
        super(ShaderManager.getShader((geometry.hasNormals)?"phong":"default"),materialOptions);


    }


}
