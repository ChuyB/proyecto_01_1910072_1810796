// #version 300 es
precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
// - custom uniforms
uniform float uTime;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform float waveSpeed;

// - attributes
in vec3 position;
in vec3 normal;
in vec2 uv;
// - custom
in float a_random;

// - varying
out float v_random;
out float v_height;
out vec2 v_uv;

vec4 clipSpaceTransform(vec4 modelPosition) {
  // already modelMatrix multiplied
  return projectionMatrix * viewMatrix * modelPosition;
}

void main() {

  // attribute handling with custom uniform (time)
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  v_height = sin(modelPosition.x * waveFrequency + uTime * 1.0) * 0.1;
  modelPosition.z += v_height;
  vec4 viewPosition = clipSpaceTransform(modelPosition);

  v_uv = uv;

  gl_Position = viewPosition;
}

