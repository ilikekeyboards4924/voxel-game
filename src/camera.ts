import { mat4, vec3 } from "gl-matrix";

class Camera {
    position: vec3;
    pitch: number;
    yaw: number;

    front: vec3;
    frontXZ: vec3;
    right: vec3;
    up: vec3;
    constructor() {
        this.position = vec3.fromValues(0, 0, 0);
        this.pitch = 0;
        this.yaw = Math.PI;

        this.front = vec3.fromValues(0, 0, -1);
        this.frontXZ = vec3.fromValues(0, 0, -1);
        this.right = vec3.create();
        this.up = vec3.fromValues(0, 1, 0);
    }

    normalizeCameraVectors() {
        vec3.normalize(this.front, this.front);
        vec3.normalize(this.frontXZ, this.frontXZ);
        vec3.normalize(this.right, this.right);
        vec3.normalize(this.up, this.up); // is this redundant?
    }

    calculateCameraVectors() {
        this.front = vec3.fromValues(Math.cos(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), Math.sin(this.yaw) * Math.cos(this.pitch)); // calculate front vector
        this.frontXZ = vec3.fromValues(Math.cos(this.yaw), 0, Math.sin(this.yaw)); // same as this.front but without y coordinate
        vec3.cross(this.right, this.front, this.up); // calculate right vector with cross product between front and up vector

        this.normalizeCameraVectors();
    }

    updateCamera() {
        this.pitch = Math.max(-90 * (Math.PI/180) + 0.001, Math.min(this.pitch, 90 * (Math.PI/180) - 0.001)); // + and - small value to stop camera from glitching out at +90 and -90 degrees
        this.calculateCameraVectors();
    }
}

export { Camera };