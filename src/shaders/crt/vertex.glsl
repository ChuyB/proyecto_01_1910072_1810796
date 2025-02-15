precision mediump float;

in vec3 position;
in vec3 normal;

uniform vec2 u_resolution;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 normalMatrix;

out vec2 vUv;

void main() {
  vec4 pos = modelMatrix * vec4(position, 1.0);
  vUv = (pos.xy / pos.w) / 2.0 + 0.5; // Position with perspective
  gl_Position = projectionMatrix * viewMatrix * pos;
}

