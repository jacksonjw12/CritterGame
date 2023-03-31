class PlayerInput{


    constructor(canvas){
        if(PlayerInput.registered){
            return;
        }
        PlayerInput.registered = this;

        this.keysDown = [];
        this.cursorPos = undefined;

        document.addEventListener('keydown', (event)=>{

            let keyChar = String.fromCharCode(event.keyCode);
            if(this.keysDown.indexOf(keyChar) === -1){

                this.keysDown.push(keyChar);
            }


        });

        document.addEventListener('keyup', (event)=>{

            let keyChar = String.fromCharCode(event.keyCode);

            if(this.keysDown.indexOf(keyChar) > -1){

                this.keysDown.splice(this.keysDown.indexOf(keyChar),1);
            }


        })

        canvas.addEventListener('mousemove', (event) => {
            this.cursorPos = vec2.fromValues(event.offsetX, event.offsetY);
        })

    }
}


