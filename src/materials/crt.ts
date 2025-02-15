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
      uSize: 4.0,
      uFrequency: 400.0,
      uTime: 0.0,
      uSpeed: 2.5,
      uCurvature: 0.5,
      uRadius: 0.4,
      uBrightness: 1.2,
      uVignette: 0.34,
    };

    this.geometry = new THREE.PlaneGeometry(
      this.defaultUniforms.uSize,
      this.defaultUniforms.uSize,
      64,
      64,
    );
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

        uSize: { value: this.defaultUniforms.uSize },
        uTexture: { value: textureLoader.load("smb.png") },
        uFrequency: { value: this.defaultUniforms.uFrequency },
        uTime: { value: this.defaultUniforms.uTime },
        uSpeed: { value: this.defaultUniforms.uSpeed },
        uCurvature: { value: this.defaultUniforms.uCurvature },
        uRadius: { value: this.defaultUniforms.uRadius },
        uBrightness: { value: this.defaultUniforms.uBrightness },
        uVignette: { value: this.defaultUniforms.uVignette },
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
    this.gui
      .add(uniforms, "uSpeed", 0.0, 10.0)
      .name("Speed")
      .onChange(() => (this.material.uniforms.uSpeed.value = uniforms.uSpeed));
    this.gui
      .add(uniforms, "uCurvature", 0.0, 5.0)
      .name("Curvature")
      .onChange(
        () => (this.material.uniforms.uCurvature.value = uniforms.uCurvature),
      );
    this.gui
      .add(uniforms, "uRadius", 0, 1.0)
      .name("Radius")
      .onChange(
        () => (this.material.uniforms.uRadius.value = uniforms.uRadius),
      );
    this.gui
      .add(uniforms, "uBrightness", 0.0, 5.0)
      .name("Brightness")
      .onChange(
        () => (this.material.uniforms.uBrightness.value = uniforms.uBrightness),
      );
    this.gui
      .add(uniforms, "uVignette", 0.0, 1.0)
      .name("Vignette")
      .onChange(
        () => (this.material.uniforms.uVignette.value = uniforms.uVignette),
      );
  }

  updateTime(elapsedTime: number) {
    this.material.uniforms.uTime.value = elapsedTime;
  }
}
