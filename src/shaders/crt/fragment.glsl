precision mediump float;

const float amplitude = 1.0;
const float fase = 0.0;

uniform float uFrequency;
uniform sampler2D uTexture;

out vec4 fragColor;

in vec2 vUv;

void main() {
  vec2 uv = vUv;
  float colorValue = abs(sin(uFrequency * uv.y + fase) * amplitude);
  vec4 textureColor = texture(uTexture, uv);
  fragColor = vec4(textureColor.rgb * colorValue, 1.0);
}

