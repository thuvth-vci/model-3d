import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import * as THREE from 'three';
export class ObjectTransformControls {
  constructor(el, viewer) {
    this.el = el;
    this._viewer = viewer;

    //当前操作动画组
    this.animationScripItem = {
      name: "unname",
      duration: -1
    };

    this.controls = viewer.controls;
    this.camera = viewer.defaultCamera;
    this.domElement = viewer.renderer.domElement;
    this.scene = viewer.scene;
    this.mode = "translate";
    this.size = 1;
    this.boxHelper = null;
    this.centerPoint = null;
    this.sphereGeometry = new THREE.SphereGeometry(0.005, 10, 10);
    this.sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00ff,
      opacity: 0.4,
      transparent: true,
      metalness: 0.65,
      roughness: 0.54
    });
    this.sphereMaterial.packedNormals = true;
    this.sphereMaterial.depthWrite = false;
    this.sphereMaterial.depthTest = false;
    this.init();
  }

  init() {
    console.log("控制器已经初始化！！！");
    this._viewer.state.selectedEffect = false;
    this._viewer.addEventListener("pick-node", (e) => {
      this.clear();
      if (!e || !e.pickObjectParam || !e.pickObjectParam.target) {
        return
      }
      let pickObject = e.pickObjectParam.target;
      this.add(pickObject);
      this.pickObject = pickObject;
    })
  }

  /**
    * 
    * @param {String} mode 控件的模式，可选值包括：'translate'（平移模式）、'rotate'（旋转模式）、'scale'（缩放模式）
    */
  add(pickObject) {
    let _this = this;

    this.objectTransformControls = new TransformControls(this.camera, this.domElement);

    this.objectTransformControls.setMode(this.mode);
    this.objectTransformControls.setSize(this.size);

    this.createOriginalPoint(pickObject);

    this.objectTransformControls.attach(pickObject);

    this.objectTransformControls.addEventListener("dragging-changed", (e) => {
      let { type, value, target } = e;
      _this.controls.enabled = !value;
      this.processData(this.mode, pickObject, value)
    })
    this.objectTransformControls.addEventListener("change", (e) => {
      this.createOriginalPoint(pickObject);
      // this.processData(this.mode, pickObject, true)
    })
    this.scene.add(this.objectTransformControls);
  }

  getPickObjectCenter(pickObject, createBox = true) {
    const boundingBox = new THREE.Box3().setFromObject(pickObject);
    if (this.boxHelper) {
      this.scene.remove(this.boxHelper);
      this.boxHelper = null;
    }
    if (createBox) {
      this.boxHelper = new THREE.Box3Helper(boundingBox, 0xffff00);
      this.scene.add(this.boxHelper);
    }
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    return center;
  }

  createAnimationClipScript(name) {
    if (this.animationScripItem) {
      this.animationScrips.push(this.animationScripItem);
      this.animationScripItem = null;
    }
    this.animationScripItem = {
      name, keyFrameTracks: []
    }
  }

  findAnimationClipScriptIndex(nodeName, type) {
    let findIndex = this.animationScripItem.
      keyFrameTracks.
      findIndex(item => {
        return item.name === nodeName && item.type === type
      });
    return findIndex;
  }

  /**
   * 
   * @param {String} mode 控件模式
   * @param {Object} pickObject 拾取的物体
   * @param {Boolean} dragging 是否被抓取
   */
  processData(mode, pickObject, dragging) {
    let { name, keyFrameTracks } = this.animationScripItem;
    if (!keyFrameTracks) {
      this.animationScripItem.keyFrameTracks = [];
    }
    let keyFrameTrackIndex, keyFrameTrack;
    switch (mode) {
      case "translate":
        keyFrameTrackIndex = this.findAnimationClipScriptIndex(pickObject.name, ".position");
        keyFrameTrack = {
          name: pickObject.name,
          type: ".position",
          times: [],
          values: []
        };
        if (keyFrameTrackIndex > -1) {
          keyFrameTrack = this.animationScripItem.keyFrameTracks[keyFrameTrackIndex];
        }
        console.log("移动模式")
        if (dragging) {
          let lastTime = keyFrameTrack.times.length > 0 ? keyFrameTrack.times[keyFrameTrack.times.length - 1] : 0;
          keyFrameTrack.times.push(++lastTime);
          keyFrameTrack.values = keyFrameTrack.values.concat(pickObject.position.toArray())
          console.log("positionStart:", pickObject.name, pickObject.position.toArray());
        } else {
          let lastTime = keyFrameTrack.times.length > 0 ? keyFrameTrack.times[keyFrameTrack.times.length - 1] : 0;
          keyFrameTrack.times.push(++lastTime);
          keyFrameTrack.values = keyFrameTrack.values.concat(pickObject.position.toArray())
          console.log("positionEnd:", pickObject.name, pickObject.position.toArray());
        }
        if (keyFrameTrackIndex > -1) {
          this.animationScripItem.keyFrameTracks[keyFrameTrackIndex] = keyFrameTrack;
        } else {
          this.animationScripItem.keyFrameTracks.push(keyFrameTrack);
        }
        console.log(this.animationScripItem);
        this.dispatchEvent({ type: "translate", clip: this.animationScripItem });
        break
      case "rotate":
        keyFrameTrackIndex = this.findAnimationClipScriptIndex(pickObject.name, ".quaternion");
        keyFrameTrack = {
          name: pickObject.name,
          type: ".quaternion",
          times: [],
          values: []
        };
        if (keyFrameTrackIndex > -1) {
          keyFrameTrack = this.animationScripItem.keyFrameTracks[keyFrameTrackIndex];
        }
        console.log("旋转模式")
        if (dragging) {
          let lastTime = keyFrameTrack.times.length > 0 ? keyFrameTrack.times[keyFrameTrack.times.length - 1] : 0;
          keyFrameTrack.times.push(++lastTime);
          const matrix = new THREE.Matrix4().makeRotationFromEuler(pickObject.rotation);
          const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
          keyFrameTrack.values = keyFrameTrack.values.concat(quaternion.toArray())
          console.log("rotationStart:", pickObject.name, quaternion.toArray());
        } else {
          let lastTime = keyFrameTrack.times.length > 0 ? keyFrameTrack.times[keyFrameTrack.times.length - 1] : 0;
          keyFrameTrack.times.push(++lastTime);
          const matrix = new THREE.Matrix4().makeRotationFromEuler(pickObject.rotation);
          const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
          keyFrameTrack.values = keyFrameTrack.values.concat(quaternion.toArray());
          console.log("rotationEnd:", pickObject.name, quaternion.toArray());
        }
        if (keyFrameTrackIndex > -1) {
          this.animationScripItem.keyFrameTracks[keyFrameTrackIndex] = keyFrameTrack;
        } else {
          this.animationScripItem.keyFrameTracks.push(keyFrameTrack);
        }
        console.log(this.animationScripItem);
        this.dispatchEvent({ type: "rotate", clip: this.animationScripItem });
        break
      case "scale":
        console.log("缩放模式")
        if (dragging) {
          console.log("scaleStart:", pickObject.name, pickObject.scale.toArray());
        } else {
          console.log("scaleEnd:", pickObject.name, pickObject.scale.toArray());
        }
        break
    }
  }

  /**
   * 撤销动作
   */
  revoke() {

  }

  /**
   * 清除
   */
  clear() {
    if (this.objectTransformControls) {
      this.scene.remove(this.objectTransformControls);
      this.objectTransformControls.dispose();
      this.objectTransformControls.detach();
      this.objectTransformControls = null;
    }
    if (this.boxHelper) {
      this.scene.remove(this.boxHelper);
      this.boxHelper = null;
    }
    if (this.centerPoint) {
      this.scene.remove(this.centerPoint);
      this.centerPoint = null;
    }
  }

  createOriginalPoint(pickObject) {

    const center = this.getPickObjectCenter(pickObject);

    if (this.centerPoint) {
      this.scene.remove(this.centerPoint);
      this.centerPoint = null;
    }
    var centerPoint = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    centerPoint.position.copy(center);
    this.scene.add(centerPoint);
    this.centerPoint = centerPoint;

    // if (this.lineSegments) {
    //   this.scene.remove(this.lineSegments);
    // }
    // const edges = new THREE.EdgesGeometry(pickObject.geometry);
    // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    // const lineSegments = new THREE.LineSegments(edges, lineMaterial);
    // lineSegments.position.copy(center);
    // this.scene.add(lineSegments);
    // this.lineSegments = lineSegments;
    // pickObject.visible = false;

  }

  /**
   * 
   * @param {String} mode 控件的模式，可选值包括：'translate'（平移模式）、'rotate'（旋转模式）、'scale'（缩放模式）
   */
  switchMode(mode = "translate", size = 1) {
    if (!validateMode(mode)) {
      console.log("TransformControls不支持该模式！！！");
      return
    }
    this.mode = mode;
    this.size = size;

    if (this.pickObject) {
      this.clear();
      this.add(this.pickObject);
    }
  }
}

function validateMode(mode) {
  let modeScope = ["translate", "rotate", "scale"];
  return modeScope.includes(mode);
}

Object.setPrototypeOf(ObjectTransformControls.prototype, THREE.EventDispatcher.prototype);