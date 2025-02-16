precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;

in float v_height;

vec3 white = vec3(0.9, 0.9, 0.9); //(turns white at the right timing)
vec3 red = vec3(0.811, 0.078, 0.168);
vec3 yellow = vec3(0.968, 0.819, 0.090);
vec3 blue = vec3(0, 0.2, 0.670);

const float PROPORTION = 0.1;
const float SIZE_PROPORTION = 3.0;
const float INTENSITY = 0.6;
const float STAR_RADIUS = 0.025;

float sdfBox(vec2 offset, vec2 p, vec2 b) {
  vec2 d = abs(p - offset) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); 
}

float sdStar5(vec2 offset, vec2 p, float r, float rf) {
    p -= offset; // Apply the offset to move the shape

    const vec2 k1 = vec2(0.809016994375, -0.587785252292);
    const vec2 k2 = vec2(-k1.x, k1.y);
    p.x = abs(p.x);
    p -= 2.0 * max(dot(k1, p), 0.0) * k1;
    p -= 2.0 * max(dot(k2, p), 0.0) * k2;
    p.x = abs(p.x);
    p.y -= r;
    vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0, 1);
    float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
    
    return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // step 0 - show colors

  // step 1 - show swizzling
  // swizzling:
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  // conversion to [-1, 1] interval
  uv = uv * 2.0f - 1.0f;
  
  vec2 size = vec2(1.1f, 0.3f);  

  float waveDirection = sign(uv.y);

  // flag colors (red is base)

  vec2 blueOffset = vec2(0.0f, v_height * PROPORTION * waveDirection);
  float distanceToBlue = sdfBox(blueOffset, uv, size / SIZE_PROPORTION);
  
  vec2 yellowOffset = vec2(0.0f, 3.0f * PROPORTION);
  float distanceToYellow = sdfBox(yellowOffset, uv, size);
  
  vec3 color = red;
  if (distanceToBlue < 0.0f) color = blue;
  else if (distanceToYellow < 0.0f) color = yellow;

  // stars

  float baseStarRadius = STAR_RADIUS;
  float starOuterProportion = 8.0;
  const int numStars = 8;
  vec2 starOffsets[numStars];
  float starDistances[numStars];

  // Calculate distances to stars
  // Lots of magic numbers as function parameters
  for (int i = 0; i < numStars; i++) {
    // star size slightly changes for depth illusion
    float starRadius = baseStarRadius * (1.0 + 0.8 * v_height);
    
    // star locations relative to center (parabolic function in y)
    float xOffset =  - 0.16 + float(i) * 0.045; // X offset
    float yOffset = 0.035 - pow(float(i) - 3.5,2.0) * 0.005 + v_height * 0.3; 
    starOffsets[i] = vec2(xOffset, yOffset);
    
    // calculate sdf and set color
    float starDistance = sdStar5(starOffsets[i], uv, starRadius, starRadius * starOuterProportion);
    starDistances[i] = starDistance;
    if (starDistance < 0.0) {
      color = white;
    }
  }

  // Convert color to HSV
  vec3 hsv = rgb2hsv(color);

  // Adjust intensity
  hsv.y -= v_height * INTENSITY;

  // Convert back to RGB
  color = hsv2rgb(hsv);

  fragColor = vec4(color, 1.0);
}
