import * as THREE from "three";
import GUI from "lil-gui";

import vertexShader from "../shaders/blinnPhong/vertex.glsl";
import fragmentShader from "../shaders/blinnPhong/fragment.glsl";

export class BlinnPhong {
  private camera: THREE.PerspectiveCamera;
  private defaultUniforms: any;
  geometry: THREE.BoxGeometry;
  material: THREE.RawShaderMaterial;
  mesh: THREE.Mesh;
  gui: GUI;

  constructor(camera: THREE.PerspectiveCamera, gui: GUI) {
    this.camera = camera;

    // Default uniforms for shaders
    this.defaultUniforms = {
      lightPos: new THREE.Vector3(2.0, 0.0, -2.0),
      lightColor: { r: 1.0, g: 1.0, b: 1.0 },
      lightPower: 3.0,
      ambientColor: { r: 0.2, g: 0.0, b: 0.0 },
      diffuseColor: { r: 1.0, g: 0.0, b: 0.0 },
      specColor: { r: 0.8, g: 0.8, b: 0.8 },
      shininess: 25.0,
      screenGamma: 2.2,
    };
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
    this.geometry.computeVertexNormals();
    this.material = this.createMaterial(this.defaultUniforms);
    this.gui = gui;
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.addUIControls();
  }

  private createMaterial(uniforms: any): THREE.RawShaderMaterial {
    let material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        lightPos: { value: uniforms.lightPos },
        lightColor: {
          value: new THREE.Vector3(
            uniforms.lightColor.r,
            uniforms.lightColor.g,
            uniforms.lightColor.b,
          ),
        },
        lightPower: { value: uniforms.lightPower },
        ambientColor: {
          value: new THREE.Vector3(
            uniforms.ambientColor.r,
            uniforms.ambientColor.g,
            uniforms.ambientColor.b,
          ),
        },
        diffuseColor: {
          value: new THREE.Vector3(
            uniforms.diffuseColor.r,
            uniforms.diffuseColor.g,
            uniforms.diffuseColor.b,
          ),
        },
        specColor: {
          value: new THREE.Vector3(
            uniforms.specColor.r,
            uniforms.specColor.g,
            uniforms.specColor.b,
          ),
        },
        shininess: { value: uniforms.shininess },
        screenGamma: { value: uniforms.screenGamma },
        projectionMatrix: { value: this.camera.projectionMatrix },
        viewMatrix: { value: this.camera.matrixWorldInverse },
        modelMatrix: { value: new THREE.Matrix4() },
      },
      glslVersion: THREE.GLSL3,
    });
    return material;
  }

  private addUIControls() {
    const specular = this.gui.addFolder("Specular");
    const lightFolder = specular.addFolder("Light");
    const uniforms = this.defaultUniforms;
    lightFolder
      .addColor(uniforms, "lightColor")
      .name("Light Color")
      .onChange(
        () => (this.material.uniforms.lightColor.value = uniforms.lightColor),
      );
    lightFolder
      .add(uniforms.lightPos, "x", -10, 10)
      .name("Light Position X")
      .onChange(
        () => (this.material.uniforms.lightPos.value = uniforms.lightPos),
      );
    lightFolder
      .add(uniforms.lightPos, "y", -10, 10)
      .name("Light Position Y")
      .onChange(
        () => (this.material.uniforms.lightPos.value = uniforms.lightPos),
      );
    lightFolder
      .add(uniforms.lightPos, "z", -10, 10)
      .name("Light Position Z")
      .onChange(
        () => (this.material.uniforms.lightPos.value = uniforms.lightPos),
      );
    lightFolder
      .add(uniforms, "lightPower", 0, 100)
      .name("Light Power")
      .onChange(
        () => (this.material.uniforms.lightPower.value = uniforms.lightPower),
      );
    const generalFolder = specular.addFolder("General");
    generalFolder
      .addColor(uniforms, "ambientColor")
      .name("Ambient Color")
      .onChange(
        () =>
          (this.material.uniforms.ambientColor.value = uniforms.ambientColor),
      );
    generalFolder
      .addColor(uniforms, "diffuseColor")
      .name("Diffuse Color")
      .onChange(
        () =>
          (this.material.uniforms.diffuseColor.value = uniforms.diffuseColor),
      );
    generalFolder
      .addColor(uniforms, "specColor")
      .name("Specular Color")
      .onChange(
        () => (this.material.uniforms.specColor.value = uniforms.specColor),
      );
    generalFolder
      .add(uniforms, "shininess", 0, 100)
      .name("Shininess")
      .onChange(
        () => (this.material.uniforms.shininess.value = uniforms.shininess),
      );
    generalFolder
      .add(uniforms, "screenGamma", 0, 3)
      .name("Screen Gamma")
      .onChange(
        () => (this.material.uniforms.screenGamma.value = uniforms.screenGamma),
      );
  }

  updateTime(elapsedTime: number) {}
}
