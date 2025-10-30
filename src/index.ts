import { mat4, vec3 } from "gl-matrix";
import { canvas, gl, shaderProgram, attributes, 
         camera, viewMatrix, projectionMatrix, publicPath } from "./global";
import { keys } from "./input";
import { Cube } from "./cube";


const cube = new Cube();

let texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
 
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));


let image = new Image();
image.src = `./assets/jabber.png`;
image.addEventListener('load', (event) => {

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    cube.init(texture);
});



function setViewMatrix() { // set the viewMatrix
    const viewMatrixTarget = vec3.create();
    vec3.add(viewMatrixTarget, camera.position, camera.front);
    mat4.lookAt(viewMatrix, camera.position, viewMatrixTarget, camera.up);
}

function sendUniformsToShader() { // send matrix uniforms to the shader
    gl.uniformMatrix4fv(attributes.viewMatrixUniformLocation, false, viewMatrix as Float32List);
    gl.uniformMatrix4fv(attributes.projectionMatrixUniformLocation, false, projectionMatrix as Float32List);
}

function update() {
    // game update stuff here
    const speed = 0.1;
    if (keys['d']) vec3.scaleAndAdd(camera.position, camera.position, camera.right, speed);
    if (keys['a']) vec3.scaleAndAdd(camera.position, camera.position, camera.right, -speed);

    if (keys['w']) vec3.scaleAndAdd(camera.position, camera.position, camera.frontXZ, speed);
    if (keys['s']) vec3.scaleAndAdd(camera.position, camera.position, camera.frontXZ, -speed);

    // keep these in case the other controls are too annoying
    if (keys['e']) vec3.scaleAndAdd(camera.position, camera.position, camera.up, speed);
    if (keys['q']) vec3.scaleAndAdd(camera.position, camera.position, camera.up, -speed);

    if (keys[' ']) vec3.scaleAndAdd(camera.position, camera.position, camera.up, speed);
    if (keys['Shift']) vec3.scaleAndAdd(camera.position, camera.position, camera.up, -speed); // used to be Control but Control + w closes tab :(

    if (keys['ArrowLeft']) camera.yaw -= 0.04;
    if (keys['ArrowRight']) camera.yaw += 0.04;

    if (keys['ArrowUp']) camera.pitch += 0.04;
    if (keys['ArrowDown']) camera.pitch -= 0.04;

    camera.updateCamera();

    setViewMatrix();
    sendUniformsToShader();
}

function render() { // do the actual drawing here
    // set up webgl stuff
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.useProgram(shaderProgram);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);    

    gl.enable(gl.DEPTH_TEST); // enable to sort properly
    // gl.disable(gl.DEPTH_TEST); // enable to sort properly


    // uncomment this to hide faces inside of cube/other thing
    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);

    // do drawing below here
    cube.draw();
}



let lastTime = 0;
const targetFps = 90;
function main(time=0) {
    if (time - lastTime >= 1000/targetFps) {
        update();
        render();
        lastTime = time;
    }

    requestAnimationFrame(main);
}

main();