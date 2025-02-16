import * as THREE from "three";
import GUI from "lil-gui";

import vertexShader from "../shaders/simpleWave/vertex.glsl";
import fragmentShader from "../shaders/simpleWave/fragment.glsl";

export class SimpleWave {
  private camera: THREE.PerspectiveCamera;
  private defaultUniforms: any;
  private clock : THREE.Clock;
//  geometry: THREE.PlaneGeometry;
  geometry: THREE.BoxGeometry;
  material: THREE.RawShaderMaterial;
  mesh: THREE.Mesh;
  gui: GUI;

  constructor(camera: THREE.PerspectiveCamera, gui: GUI) {
    this.camera = camera;

    // Default uniforms for shaders
    this.defaultUniforms = {
      waveFrequency: 10.0,
      waveSpeed: 1.0,
      waveAmplitude: 0.1,
      u_time: 0.0,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    };
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
    this.geometry.computeVertexNormals();
    this.material = this.createMaterial(this.defaultUniforms);
    this.gui = gui;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.clock = new THREE.Clock()

    this.addUIControls();
  }

  private createMaterial(uniforms: any): THREE.RawShaderMaterial {
    let material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        waveFrequency: { value: uniforms.waveFrequency },
        waveSpeed: { value: uniforms.waveSpeed },
        waveAmplitude: { value: uniforms.waveAmplitude },
        uTime: { value: uniforms.u_time },
        uResolution: { value: uniforms.resolution},
        projectionMatrix: { value: this.camera.projectionMatrix },
        viewMatrix: { value: this.camera.matrixWorldInverse },
        modelMatrix: { value: new THREE.Matrix4() },
      },
      glslVersion: THREE.GLSL3,
    });
    return material;
  }

  private addUIControls() {
    const generalFolder = this.gui.addFolder("Simple Wave Shader");
    const uniforms = this.defaultUniforms;

    generalFolder
      .add(uniforms, "waveFrequency", 0.0, 100.0)
      .name("Frequency")
      .onChange(
        () => (this.material.uniforms.waveFrequency.value = uniforms.waveFrequency),
      );
    generalFolder
      .add(uniforms, "waveSpeed", 0.0, 100.0)
      .name("Speed")
      .onChange(() => (this.material.uniforms.waveSpeed.value = uniforms.waveSpeed)
      );
    generalFolder
      .add(uniforms, "waveAmplitude", 0.0, 1.0)
      .name("Amplitude")
      .onChange(() => (this.material.uniforms.waveAmplitude.value = uniforms.waveAmplitude),
      );
  }

  updateTime(elapsedTime: number) {
    this.material.uniforms.uTime.value = elapsedTime;
  }
}
