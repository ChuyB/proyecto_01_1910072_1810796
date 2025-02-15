import * as THREE from "three";
import GUI from "lil-gui";

import vertexShader from "../shaders/simpleWave/vertex.glsl";
import fragmentShader from "../shaders/simpleWave/fragment.glsl";

export class SimpleWave {
  private camera: THREE.PerspectiveCamera;
  private defaultUniforms: any;
  private clock : THREE.Clock;
  geometry: THREE.PlaneGeometry
  material: THREE.RawShaderMaterial;
  mesh: THREE.Mesh;
  gui: GUI;

  constructor(camera: THREE.PerspectiveCamera, gui: GUI) {
    this.camera = camera;

    // Default uniforms for shaders
    this.defaultUniforms = {
      waveAmplitude: 10.0,
      u_time: 0.0,
    };
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
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
        waveAmplitude: { value: uniforms.waveAmplitude },
        u_time: { value: uniforms.u_time },
        projectionMatrix: { value: this.camera.projectionMatrix },
        viewMatrix: { value: this.camera.matrixWorldInverse },
        modelMatrix: { value: new THREE.Matrix4() },
      },
      glslVersion: THREE.GLSL3,
    });
    return material;
  }

  private addUIControls() {
    const generalFolder = this.gui.addFolder("General");
    const uniforms = this.defaultUniforms;

    generalFolder
      .add(uniforms, "waveAmplitude", 0.0, 100.0)
      .name("Wave Amplitude")
      .onChange(
        () => (this.material.uniforms.waveAmplitude.value = uniforms.waveAmplitude),
      );
  }

  updateTime() {
    this.material.uniforms.u_time.value = this.clock.getElapsedTime();
  }
}
