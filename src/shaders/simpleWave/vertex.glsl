// #version 300 es
precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
// - custom uniforms
uniform float uTime;
uniform float waveFrequency;
uniform float waveMaxAmplitude;
uniform float waveSpeed;
uniform float displacement;

uniform bool waveEnabled;
uniform float amplitudeDelta;
uniform float wavePropagationDelta;

uniform float toggleTime;
uniform float waveReach;

// - attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// - varying
out float v_random;
out float v_height;
out vec2 v_uv;

vec4 clipSpaceTransform(vec4 modelPosition) {
  // already modelMatrix multiplied
  return projectionMatrix * viewMatrix * modelPosition;
}

void main() {

  float waveAmplitude = 0.0; // Initialize waveAmplitude to 0.0
  float toggleElapsedTime = uTime - toggleTime;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  if (waveEnabled) { 
    waveAmplitude = min(toggleElapsedTime * (waveMaxAmplitude / amplitudeDelta), waveMaxAmplitude);
  } else {
    waveAmplitude = max(waveMaxAmplitude - (toggleElapsedTime * (waveMaxAmplitude / amplitudeDelta)), 0.0);
  }

  float wavePropagation;
  if (waveEnabled) { 
    wavePropagation = min(toggleElapsedTime * (waveReach / wavePropagationDelta), waveReach);
  } else {
    wavePropagation = max(waveReach - (toggleElapsedTime * (waveReach / wavePropagationDelta)), 0.0);
  }

  float distanceToDisplacement = abs(displacement - modelPosition.x);

  if (distanceToDisplacement <= wavePropagation || wavePropagationDelta == 0.0) {
    // wave symmetry operations (dont fix if its not broken)
  // this prevents from wave flattening in the transition for the symmetry point
  float transitionSmoothness = 0.0;
  float sign = smoothstep(-transitionSmoothness, transitionSmoothness, displacement - modelPosition.x ) * 2.0 - 1.0;
  
  // attribute handling with custom uniform (time)
  v_height = sign * sin((modelPosition.x - displacement) * waveFrequency + sign * uTime * waveSpeed) * waveAmplitude;
  } else {
    v_height = 0.0;
  }

  modelPosition.z += v_height;
  
  vec4 viewPosition = clipSpaceTransform(modelPosition);

  v_uv = uv;

  gl_Position = viewPosition;
}