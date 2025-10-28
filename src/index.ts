import { mat4 } from "gl-matrix";
import { canvas, gl, shaderProgram } from "./global";

const vao = gl.createVertexArray();
const positionBuffer = gl.createBuffer();
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'position');

const positionArray = new Float32Array([
    // -1, -1,
    // -1, 1,
    // 1, 1,

    1, 1,
    1, -1,
    -1, -1,

    -1, -1,
    1, -1,
    0, 1
]);


gl.bindVertexArray(vao);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


gl.drawArrays(gl.TRIANGLES, 0, 12);

gl.bindVertexArray(null);