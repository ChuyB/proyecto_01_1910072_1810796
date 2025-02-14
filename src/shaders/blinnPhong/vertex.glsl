// #version 300 es
precision mediump float;

in vec3 position;
in vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 normalMatrix;

out vec3 normalInterp;
out vec3 vertPos;

void main() {
    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);
    vec4 vertPos4 = modelMatrix * viewMatrix * vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(normalMatrix * vec4(normal, 0.0));
}
