const canvas = document.getElementsByTagName('canvas').item(0);
if (!canvas) throw new Error('canvas missing or something else wrong');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl2');
if (!gl) throw new Error('bruhhhhhh... webgl aint working');

const ext = gl!.getExtension('EXT_color_buffer_float');
console.log("EXT_color_buffer_float:", ext);
if (!gl!.getExtension('EXT_color_buffer_float')) { console.error("EXT_color_buffer_float not supported — floating point FBOs will not work."); }


function compileShader(type: GLenum, src: string){
    const s = gl!.createShader(type);
    if (s) {
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        if(!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
            const info = gl!.getShaderInfoLog(s);
            gl!.deleteShader(s);
            throw new Error("Shader compile error: " + info);
        }
        return s;
    } else {
        throw new Error('unable to create shader');
    }
}

function createProgram(vsSrc: string, fsSrc: string){
    const vs = compileShader(gl!.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl!.FRAGMENT_SHADER, fsSrc);
    if (vs && fs) {
        const p = gl!.createProgram();
        gl!.attachShader(p, vs);
        gl!.attachShader(p, fs);
        gl!.linkProgram(p);
        if(!gl!.getProgramParameter(p, gl!.LINK_STATUS)){
            const info = gl!.getProgramInfoLog(p);
            gl!.deleteProgram(p);
            throw new Error("Program link error: " + info);
        }
        return p;
    } else {
        throw new Error('vertex or fragment shader was unable to compile');
    }
}


const vertexShader = `#version 300 es
    in vec2 position;

    void main(){
        gl_Position = vec4(position, 1.0, 1.0);
    }
`;

const fragmentShader = `#version 300 es
    precision mediump float;
    out vec4 outColor;

    void main(){
        outColor = vec4(0.392, 0.584, 0.929, 1.0); // cornflower blue
    }
`;

const shaderProgram = createProgram(vertexShader, fragmentShader);
gl.useProgram(shaderProgram);



export { canvas, gl, shaderProgram };