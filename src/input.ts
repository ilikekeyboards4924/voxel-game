import { canvas, camera } from "./global";

interface Keyboard {
    [key: string]: boolean;
}

let keys: Keyboard = {};


// key and mouse handlers
function keyHandler(event: KeyboardEvent) {
    const isCtrl = event.ctrlKey || event.metaKey;

    if (isCtrl && (event.key.toLowerCase() === 'w' || event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 's' || event.key.toLowerCase() === 'd')) {
        event.preventDefault(); // stop the browser from being annoying
    }

    if (event.type == 'keyup') keys[event.key] = false;

    if (keys[event.key]) return;
    if (event.type == 'keydown') keys[event.key] = true;
}

canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) { // if the pointer is locked
        console.log('Pointer locked! Mouse is hidden.');
    } else {
        console.log('Pointer unlocked.');
    }
});

document.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === canvas) {
        const movementX = event.movementX;
        const movementY = event.movementY;

        camera.yaw   += movementX * 0.004;  // sensitivity
        camera.pitch -= movementY * 0.004;
    }
});

document.addEventListener('keydown', keyHandler);
document.addEventListener('keyup', keyHandler);

export { keys };