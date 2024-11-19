attribute vec2 uv;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

    newPosition.z += (sin(newPosition.x * 4.0 + uTime) * 1.5 + cos(newPosition.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);

    gl_Position = projectionMatrix * newPosition;
}