import * as THREE from "three";
import GUI from "lil-gui";

import vertexShader from "../shaders/crt/vertex.glsl";
import fragmentShader from "../shaders/crt/fragment.glsl";

export class CRT {
  private camera: THREE.PerspectiveCamera;
  private defaultUniforms: any;
  geometry: THREE.BoxGeometry;
  material: THREE.RawShaderMaterial;
  mesh: THREE.Mesh;
  gui: GUI;

  constructor(camera: THREE.PerspectiveCamera, gui: GUI) {
    this.camera = camera;

    // Default uniforms for shaders
    this.defaultUniforms = {};
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.geometry.computeVertexNormals();
    this.material = this.createMaterial(this.defaultUniforms);
    this.gui = gui;
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // this.addUIControls();
  }

  private createMaterial(uniforms: any): THREE.RawShaderMaterial {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath("src/textures/");

    let material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        projectionMatrix: { value: this.camera.projectionMatrix },
        viewMatrix: { value: this.camera.matrixWorldInverse },
        modelMatrix: { value: new THREE.Matrix4() },
        uFrequency : { value: 600.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTexture: { value: textureLoader.load("smb.png") },
      },
      glslVersion: THREE.GLSL3,
    });
    return material;
  }

  // private addUIControls() {
  //   const specular = this.gui.addFolder("Specular");
  //   const lightFolder = specular.addFolder("Light");
  //   const uniforms = this.defaultUniforms;
  //   lightFolder
  //     .addColor(uniforms, "lightColor")
  //     .name("Light Color")
  //     .onChange(
  //       () => (this.material.uniforms.lightColor.value = uniforms.lightColor),
  //     );
  //   lightFolder
  //     .add(uniforms.lightPos, "x", -10, 10)
  //     .name("Light Position X")
  //     .onChange(
  //       () => (this.material.uniforms.lightPos.value = uniforms.lightPos),
  //     );
  //   lightFolder
  //     .add(uniforms.lightPos, "y", -10, 10)
  //     .name("Light Position Y")
  //     .onChange(
  //       () => (this.material.uniforms.lightPos.value = uniforms.lightPos),
  //     );
  //   lightFolder
  //     .add(uniforms.lightPos, "z", -10, 10)
  //     .name("Light Position Z")
  //     .onChange(
  //       () => (this.material.uniforms.lightPos.value = uniforms.lightPos),
  //     );
  //   lightFolder
  //     .add(uniforms, "lightPower", 0, 100)
  //     .name("Light Power")
  //     .onChange(
  //       () => (this.material.uniforms.lightPower.value = uniforms.lightPower),
  //     );
  //   const generalFolder = specular.addFolder("General");
  //   generalFolder
  //     .addColor(uniforms, "ambientColor")
  //     .name("Ambient Color")
  //     .onChange(
  //       () =>
  //         (this.material.uniforms.ambientColor.value = uniforms.ambientColor),
  //     );
  //   generalFolder
  //     .addColor(uniforms, "diffuseColor")
  //     .name("Diffuse Color")
  //     .onChange(
  //       () =>
  //         (this.material.uniforms.diffuseColor.value = uniforms.diffuseColor),
  //     );
  //   generalFolder
  //     .addColor(uniforms, "specColor")
  //     .name("Specular Color")
  //     .onChange(
  //       () => (this.material.uniforms.specColor.value = uniforms.specColor),
  //     );
  //   generalFolder
  //     .add(uniforms, "shininess", 0, 100)
  //     .name("Shininess")
  //     .onChange(
  //       () => (this.material.uniforms.shininess.value = uniforms.shininess),
  //     );
  //   generalFolder
  //     .add(uniforms, "screenGamma", 0, 3)
  //     .name("Screen Gamma")
  //     .onChange(
  //       () => (this.material.uniforms.screenGamma.value = uniforms.screenGamma),
  //     );
  // }
}
