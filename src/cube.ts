import { mat4 } from "gl-matrix";
import { gl, attributes } from "./global";

class Cube {
    vao: WebGLVertexArrayObject;
    positionBuffer: WebGLBuffer;
    // colorBuffer: WebGLBuffer;
    textureCoordinatesBuffer: WebGLBuffer;
    
    modelMatrix: mat4;
    
    vertices: Array<number>;

    faceColors: Array<Array<number>>;
    texture: WebGLTexture;
    constructor() {
        this.vao = gl.createVertexArray();

        this.positionBuffer = gl.createBuffer();
        // this.colorBuffer = gl.createBuffer();
        this.textureCoordinatesBuffer = gl.createBuffer();

        this.modelMatrix = mat4.create();

        this.vertices = [
            // Front face (z = 0.5)
            -0.5, -0.5, 0.5,  // bottom-left
            0.5, -0.5, 0.5,  // bottom-right
            0.5, 0.5, 0.5,  // top-right
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,

            // Back face (z = -0.5)
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,

            // Left face (x = -0.5)
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,

            // Right face (x = 0.5)
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,

            // Top face (y = 0.5)
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,

            // Bottom face (y = -0.5)
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
        ];

        this.faceColors = [
            [Math.random(), Math.random(), Math.random(), 1],
            [Math.random(), Math.random(), Math.random(), 1],
            [Math.random(), Math.random(), Math.random(), 1],
            [Math.random(), Math.random(), Math.random(), 1],
            [Math.random(), Math.random(), Math.random(), 1],
            [Math.random(), Math.random(), Math.random(), 1],
        ];
    }

    init(texture: WebGLTexture) {
        this.texture = texture;



    }

    draw() {
        // let colors: Array<number> = [];

        // this.faceColors.forEach((color) => {
        //     for (let i = 0; i < this.faceColors.length; i++) {
        //         colors = colors.concat(color);
        //     }
        // });


        gl.bindVertexArray(this.vao); // start writing to the VAO

        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        // positionAttributeLocation
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(attributes.positionAttributeLocation);
        gl.vertexAttribPointer(attributes.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


        // texture
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            // left face
            0, 1,
            1, 1, 
            1, 0,
            1, 0,
            0, 0,
            0, 1,

            // right face
            1, 1,
            1, 0, 
            0, 0,
            0, 0,
            0, 1, 
            1, 1,

            // front face
            0, 1,
            1, 1, 
            1, 0,
            1, 0,
            0, 0,
            0, 1,

            // back face
            1, 1,
            1, 0, 
            0, 0,
            0, 0,
            0, 1, 
            1, 1,

            // top face
            0, 1,
            1, 1, 
            1, 0,
            1, 0,
            0, 0,
            0, 1,

            // bottom face
            1, 1,
            1, 0, 
            0, 0,
            0, 0,
            0, 1, 
            1, 1,
        ]), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(attributes.textureCoordinatesAttributeLocation);
        gl.vertexAttribPointer(attributes.textureCoordinatesAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // color
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        // colorAttributeLocation
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        // gl.enableVertexAttribArray(attributes.colorAttributeLocation);
        // gl.vertexAttribPointer(attributes.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

        // send uniform to the shader
        gl.uniformMatrix4fv(attributes.modelMatrixUniformLocation, false, this.modelMatrix as Float32List);
        gl.uniform1i(attributes.textureUniformLocation, 0);


        // bind goes here?
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);
        gl.bindVertexArray(null); // stop writing to the VAO


        // there is probably a better way to do this than binding and unbinding a vertex array for every single cube
    }
}

export { Cube };