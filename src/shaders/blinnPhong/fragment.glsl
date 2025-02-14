precision mediump float;

in vec3 normalInterp;
in vec3 vertPos;

uniform vec3 lightPos;
uniform vec3 lightColor;
uniform float lightPower;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specColor;
uniform float shininess;
uniform float screenGamma;

out vec4 fragColor;

void main() {

  vec3 normal = normalize(normalInterp);
  vec3 lightDir = lightPos - vertPos;
  float distance = dot(lightDir, lightDir);
  lightDir = normalize(lightDir);

  float lambertian = max(dot(lightDir, normal), 0.0);
  float specular = 0.0;

  if (lambertian > 0.0) {

    vec3 viewDir = normalize(-vertPos);

    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, shininess);
  }
  vec3 colorLinear = ambientColor +
                     diffuseColor * lambertian * lightColor * lightPower / distance +
                     specColor * specular * lightColor * lightPower / distance;
  // apply gamma correction (assume ambientColor, diffuseColor and specColor
  // have been linearized, i.e. have no gamma correction in them)
  vec3 colorGammaCorrected = pow(colorLinear, vec3(1.0 / screenGamma));
  // use the gamma corrected color in the fragment
  fragColor = vec4(colorGammaCorrected, 1.0);
}
