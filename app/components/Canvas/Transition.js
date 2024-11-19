import { Program, Mesh, Plane } from "ogl";
import gsap from "gsap";

import vertex from "shaders/plane-vertex.vert";
import fragment from "shaders/plane-fragment.frag";
import Detail from "./Detail";
import Collections from "./Collections";

export default class Transition {
  constructor({ collections, details, url, gl, scene, sizes }) {
    this.collections = collections;
    this.details = details;
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.url = url;

    this.geometry = new Plane(this.gl);
  }

  createProgram(texture) {
    this.program = new Program(this.gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: { uAlpha: { value: 1 }, tMap: { value: texture } },
    });
  }

  createMesh(mesh) {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.mesh.scale.x = mesh.scale.x;
    this.mesh.scale.y = mesh.scale.y;
    this.mesh.scale.z = mesh.scale.z;

    this.mesh.position.x = mesh.position.x;
    this.mesh.position.y = mesh.position.y;
    // The z-order
    this.mesh.position.z = mesh.position.z + 0.01;

    this.mesh.rotation.x = mesh.rotation.x;
    this.mesh.rotation.y = mesh.rotation.y;
    this.mesh.rotation.z = mesh.rotation.z;

    this.mesh.setParent(this.scene);
  }

  /**
   * @param {Detail | Collections} element
   * set element for transition in or out
   */
  setElement(element) {
    if (element.id === "collections") {
      const { index, medias } = element;
      const media = medias[index];

      this.createProgram(media.texture);
      this.createMesh(media.mesh);

      this.transition = "detail";
    } else {
      this.createProgram(element.texture);
      this.createMesh(element.mesh);

      this.transition = "collections";
    }
  }

  /**
   *
   * @param {Detail} element
   */
  animate(element, onComplete) {
    const timeline = gsap.timeline();

    timeline.to(
      this.mesh.scale,
      {
        x: element.scale.x,
        y: element.scale.y,
        z: element.scale.z,
        duration: 1.5,
        ease: "expo.inOut",
      },
      0,
    );

    timeline.to(
      this.mesh.position,
      {
        x: element.position.x,
        y: element.position.y,
        z: element.position.z,
        duration: 1.5,
        ease: "expo.inOut",
      },
      0,
    );

    timeline.to(
      this.mesh.rotation,
      {
        x: element.rotation.x,
        y: element.rotation.y,
        z: element.rotation.z,
        duration: 1.5,
        ease: "expo.inOut",
      },
      0,
    );

    timeline.call(() => {
      onComplete();
    });

    timeline.call(
      () => {
        this.scene.removeChild(this.mesh);
      },
      null,
      "+=0.2",
    );
  }
}
