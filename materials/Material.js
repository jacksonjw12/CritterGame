class Material {


    constructor( shader, materialOptions){
        this.materialOptions = (materialOptions !== undefined)?materialOptions:{};

        this.color = (this.materialOptions.color !== undefined)?materialOptions.color:vec4.fromValues(.5,.5,.5,1);

        this.shader = (shader !== undefined)?shader:ShaderManager.getDefaultShader();
        // console.log("Material using shader: ",shader)
    }


}
