precision mediump float;

const float amplitude = 1.0;
const float fase = 0.0;

uniform float uFrequency;
uniform float uTime;
uniform float uSpeed;
uniform sampler2D uTexture;
uniform float uCurvature;
uniform float uBrightness;
uniform float uVignette;

out vec4 fragColor;

in vec2 vUv;
in float vHeight;

vec4 applyVignette(vec4 color, vec2 uv) {
  float radius = 1.0 -  uVignette;
  float softness = uVignette * 0.3;
  float vignette = 1.0 - smoothstep(radius, radius - softness, length(uv-0.5));
  return vec4(color.rgb - vignette, color.a);
}

void main() {
  vec2 uv = vUv;
  float colorValue = abs(sin(uFrequency * uv.y + fase + (uTime * uSpeed)) * amplitude);
  vec4 textureColor = texture(uTexture, uv);

  // Adds scan lines
  fragColor = vec4(textureColor.rgb * colorValue, 1.0);

  // Adds vignette effect based on vHeight;
  fragColor = applyVignette(fragColor, vUv);

  // Adds brightness
  fragColor.rgb *= uBrightness;
}

