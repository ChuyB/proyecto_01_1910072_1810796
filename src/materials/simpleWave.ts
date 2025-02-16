import * as THREE from "three";
import GUI from "lil-gui";

import vertexShader from "../shaders/simpleWave/vertex.glsl";
import fragmentShader from "../shaders/simpleWave/fragment.glsl";

export class SimpleWave {
  private camera: THREE.PerspectiveCamera;
  private defaultUniforms: any;
  clock: THREE.Clock;
//  geometry: THREE.PlaneGeometry;
  geometry: THREE.BoxGeometry;
  material: THREE.RawShaderMaterial;
  mesh: THREE.Mesh;
  gui: GUI;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  constructor(camera: THREE.PerspectiveCamera, gui: GUI) {
    this.camera = camera;

    // Default uniforms for shaders
    this.defaultUniforms = {
      waveFrequency: 10.0,
      waveSpeed: 1.0,
      waveAmplitude: 0.1,
      displacement: 0.0,
      waveEnabled: true,
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
    document.addEventListener("click", (event) => {

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects([this.mesh]);

      if (intersects.length > 0) {
        console.log("Clicked on mesh");

        const intersectionPoint = intersects[0].point;
        this.material.uniforms.displacement.value = intersectionPoint.x;
      }


      this.material.uniforms.waveEnabled.value = !this.material.uniforms.waveEnabled.value;
    });
  }

  private createMaterial(uniforms: any): THREE.RawShaderMaterial {
    let material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        waveFrequency: { value: uniforms.waveFrequency },
        waveSpeed: { value: uniforms.waveSpeed },
        waveAmplitude: { value: uniforms.waveAmplitude },
        displacement: { value: uniforms.displacement },
        waveEnabled: { value: uniforms.waveEnabled },
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
    generalFolder
      .add(uniforms, "displacement", -0.5, 0.5)
      .name("Displacement")
      .onChange(() => (this.material.uniforms.displacement.value = uniforms.displacement),
      );
  }

  updateTime(elapsedTime: number) {
    this.material.uniforms.uTime.value = elapsedTime;
  }
}
