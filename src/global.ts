import { Camera } from "./camera";
import { mat4 } from "gl-matrix";

const canvas = <HTMLCanvasElement> document.getElementsByTagName('canvas').item(0);
if (!canvas) throw new Error('canvas missing or something else wrong');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
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
    in vec3 position;
    in vec4 color;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec4 colorFrag;
    
    void main(){
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

        colorFrag = color;
    }
`;

const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 colorFrag;

    out vec4 outColor;

    void main(){
        // outColor = vec4(0.392, 0.584, 0.929, 1.0); // cornflower blue

        outColor = colorFrag;
    }
`;

const shaderProgram = createProgram(vertexShader, fragmentShader);
gl.useProgram(shaderProgram);


const attributes = {
    positionAttributeLocation: gl.getAttribLocation(shaderProgram, 'position'),
    colorAttributeLocation: gl.getAttribLocation(shaderProgram, 'color'),

    modelMatrixUniformLocation: gl.getUniformLocation(shaderProgram, 'modelMatrix'),
    viewMatrixUniformLocation: gl.getUniformLocation(shaderProgram, 'viewMatrix'),
    projectionMatrixUniformLocation: gl.getUniformLocation(shaderProgram, 'projectionMatrix'),
};

const camera = new Camera();

const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, (90/360) * (2 * Math.PI), canvas.width/canvas.height, 0.1, 300);



export { canvas, gl, shaderProgram, attributes, 
         camera, viewMatrix, projectionMatrix };