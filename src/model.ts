

// dont look too closely at this




import { gl, attributes } from "./global";
import { mat4, vec3 } from "gl-matrix";

class Model {
    position: vec3;
    texture1: WebGLTexture;
    scale: number;
    vertices: number[];
    normals: number[];
    textureCoordinates: number[];
    modelMatrix: mat4;

    vao: WebGLVertexArrayObject;
    positionBuffer: WebGLBuffer;
    textureCoordinatesBuffer: WebGLBuffer;
    normalsBuffer: WebGLBuffer;
    
    constructor(url: string, x: number, y: number, z: number, texture1: WebGLTexture, scale = 1) {
        this.position = vec3.fromValues(x, y, z);
        this.texture1 = texture1;
        this.scale = scale;
        this.vertices = [];
        this.normals = [];
        this.textureCoordinates = [];
        this.modelMatrix = mat4.create();

        this.vao = gl.createVertexArray();
        this.positionBuffer = gl.createBuffer();
        this.textureCoordinatesBuffer = gl.createBuffer();
        this.normalsBuffer = gl.createBuffer();

        this.loadOBJ(url).then(() => {
            // this.initShaders();
            this.initBuffers();
        });
    }

    async loadOBJ(url: string) {
        const text = await fetch(url).then(res => res.text());
        const lines = text.split('\n');

        let tempVertices = [], tempUVs = [], tempNormals = [];

        for (let line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts[0] === 'v') {
                tempVertices.push(parts.slice(1).map(Number));
            } else if (parts[0] === 'vt') {
                tempUVs.push(parts.slice(1).map(Number));
            } else if (parts[0] === 'vn') {
                tempNormals.push(parts.slice(1).map(Number));
            } else if (parts[0] === 'f') {
                for (let i = 1; i <= 3; i++) {
                    const indices = parts[i].split('/');
                    const vIdx = parseInt(indices[0]) - 1;
                    const vtIdx = indices[1] ? parseInt(indices[1]) - 1 : null;
                    const vnIdx = indices[2] ? parseInt(indices[2]) - 1 : null;

                    // push vertex position
                    this.vertices.push(...tempVertices[vIdx]);

                    // push uv
                    if (vtIdx !== null && tempUVs[vtIdx]) {
                        this.textureCoordinates.push(...tempUVs[vtIdx]);
                    } else {
                        this.textureCoordinates.push(0, 0);
                    }

                    // push normal
                    if (vnIdx !== null && tempNormals[vnIdx]) {
                        this.normals.push(...tempNormals[vnIdx]);
                    } else {
                        // fallback (we'll compute later if missing)
                        this.normals.push(0, 0, 0);
                    }
                }
            }
        }
    }

    initBuffers() {
        this.vertices = [...this.vertices];
        this.textureCoordinates = [...this.textureCoordinates];

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);


        gl.enableVertexAttribArray(attributes.positionAttributeLocation);
        gl.vertexAttribPointer(attributes.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        this.textureCoordinatesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);


        // gl.enableVertexAttribArray(attributes.textureCoordinateAttributeLocation);
        // gl.vertexAttribPointer(attributes.textureCoordinateAttributeLocation, 2, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);


        // gl.enableVertexAttribArray(attributes.vertexNormalAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        // gl.vertexAttribPointer(attributes.vertexNormalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindVertexArray(null);
    }

    draw() {
        mat4.identity(this.modelMatrix); // line: 82

        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);

        mat4.scale(this.modelMatrix, this.modelMatrix, [this.scale, this.scale, this.scale]);

        // gl.useProgram(this.shaderProgram);
        gl.bindVertexArray(this.vao);


        
        gl.uniformMatrix4fv(attributes.modelMatrixUniformLocation, false, this.modelMatrix);

        

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}










// class ObjMesh {
//     vertices: number[][];   // x, y, z
//     textureCoordinates: number[][];  // u, v
//     normals: number[][];    // nx, ny, nz
//     faces: {
//         vertexIndices: number[];
//         textureCoordinateIndices: number[];
//         normalIndices: number[];
//     }[];
//     constructor() {

//     }

//     parseObjText(text: string) {
//         this.vertices = [];
//         this.textureCoordinates = [];
//         this.normals = [];
//         this.faces = [];


//         const lines = text.split("\n");

//         for (let line of lines) {
//             line = line.trim();

//             // Skip empty lines and comments
//             if (!line || line.startsWith("#")) continue;

//             const parts = line.split(/\s+/);
//             const type = parts[0];

//             switch (type) {
//                 case "v": // Vertex
//                     this.vertices.push(parts.slice(1).map(Number));
//                     break;

//                 case "vt": // Texture coordinate
//                     this.textureCoordinates.push(parts.slice(1).map(Number));
//                     break;

//                 case "vn": // Normal
//                     this.normals.push(parts.slice(1).map(Number));
//                     break;

//                 case "f": // Face
//                     const vertexIndices: number[] = [];
//                     const textureCoordinateIndices: number[] = [];
//                     const normalIndices: number[] = [];

//                     for (let i = 1; i < parts.length; i++) {
//                         const [v, vt, vn] = parts[i].split("/").map(x => x ? parseInt(x) : undefined);

//                         // OBJ indices are 1-based
//                         if (v !== undefined) vertexIndices.push(v - 1);
//                         if (vt !== undefined) textureCoordinateIndices.push(vt - 1);
//                         if (vn !== undefined) normalIndices.push(vn - 1);
//                     }

//                     this.faces.push({ vertexIndices, textureCoordinateIndices, normalIndices });
//                     break;

//             }
//         }
//     }

//     getFlattenedArrays() {
//         const positions = this.vertices.flat();
//         const textureCoordinates = this.textureCoordinates.flat();
//         const normals = this.normals.flat();

//         return { positions, textureCoordinates, normals };
//     }
// }



// class Model {

// }


// const mesh = new ObjMesh();


// function parseObj(objFilename: string) {
//     fetch(`/assets/models/${objFilename}.obj`).then((file) => {
//         file.text().then((text) => { mesh.parseObjText(text) });
//     });
// }




// export { mesh, parseObj };