import * as THREE from "three";
import GUI from "lil-gui";

import vertexShader from "../shaders/crt/vertex.glsl";
import fragmentShader from "../shaders/crt/fragment.glsl";

export class CRT {
  private camera: THREE.PerspectiveCamera;
  private defaultUniforms: any;
  geometry: THREE.PlaneGeometry;
  material: THREE.RawShaderMaterial;
  mesh: THREE.Mesh;
  gui: GUI;

  constructor(camera: THREE.PerspectiveCamera, gui: GUI) {
    this.camera = camera;

    // Default uniforms for shaders
    this.defaultUniforms = {
      uFrequency: 400.0,
      uTime: 0.0,
    };

    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.geometry.computeVertexNormals();
    this.material = this.createMaterial();
    this.gui = gui;
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.addUIControls();
  }

  private createMaterial(): THREE.RawShaderMaterial {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath("src/textures/");

    let material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        projectionMatrix: { value: this.camera.projectionMatrix },
        viewMatrix: { value: this.camera.matrixWorldInverse },
        modelMatrix: { value: new THREE.Matrix4() },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uTexture: { value: textureLoader.load("smb.png") },
        uFrequency: { value: this.defaultUniforms.uFrequency },
        uTime: { value: this.defaultUniforms.uTime },
      },
      glslVersion: THREE.GLSL3,
    });
    return material;
  }

  private addUIControls() {
    const uniforms = this.defaultUniforms;
    this.gui
      .add(uniforms, "uFrequency", 0.0, 1000.0)
      .name("Frequency")
      .onChange(
        () => (this.material.uniforms.uFrequency.value = uniforms.uFrequency),
      );
  }
}
