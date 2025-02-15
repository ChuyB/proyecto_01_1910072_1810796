precision mediump float;

in vec3 position;
in vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 normalMatrix;

uniform float uSize;
uniform float uCurvature;
uniform float uRadius;

out vec2 vUv;
out float vHeight;

float getVertexCurvature(vec2 uv) {
  vec2 center = vec2(0.5, 0.5);
  float distFromEdges = length(uv - center);
  float depth = -uCurvature * smoothstep(uRadius, 1.0, distFromEdges);
  return depth;
}

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vUv = (modelPosition.xy / modelPosition.w) / uSize + 0.5; // Position with perspective
  vHeight = getVertexCurvature(vUv); // Curvature
  modelPosition.z = vHeight;
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}

