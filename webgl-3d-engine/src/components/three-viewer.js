import {
    AmbientLight,
    AnimationMixer,
    AxesHelper,
    Box3,
    Cache,
    DirectionalLight,
    GridHelper,
    HemisphereLight,
    LinearEncoding,
    LoaderUtils,
    LoadingManager,
    PMREMGenerator,
    PerspectiveCamera,
    REVISION,
    Scene,
    SkeletonHelper,
    Vector3,
    WebGLRenderer,
    sRGBEncoding,
    LinearToneMapping,
    ACESFilmicToneMapping,
    Group,
    LoopOnce,
    Raycaster,
    EventDispatcher,
    Vector2
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { GUI } from 'dat.gui';
import { environments } from './environment/index.js';
import { SelectionProxy } from './common/SelectionProxy';
import { LeftClickPanel } from './common/LeftClickPanel.js';
// import { createBackground } from './lib/three-vignette.js';
const DEFAULT_CAMERA = '[default]';

const MANAGER = new LoadingManager();
// const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`
const THREE_PATH = `three@0.${REVISION}.x`
const DRACO_LOADER = new DRACOLoader(MANAGER).setDecoderPath(`${THREE_PATH}/examples/js/libs/draco/gltf/`);
const KTX2_LOADER = new KTX2Loader(MANAGER).setTranscoderPath(`${THREE_PATH}/examples/js/libs/basis/`);

const Preset = { ASSET_GENERATOR: 'assetgenerator' };

Cache.enabled = true;

export class ThreeViewer {
    /**
     * 
     * @param {Element} el 
     * @param {Options} options 
     */
    constructor(el, options) {
        this.el = el;
        this.options = options;
        this.lights = [];
        this.content = null;
        this.mixer = null;
        this.clips = [];
        this.gui = null;
        if (options.preset) {
            Tinybird.trackEvent('preset', { preset: options.preset });
        }
        this.state = {
            environment: options.preset === Preset.ASSET_GENERATOR
                ? environments.find((e) => e.id === 'footprint-court').name
                : environments[1].name,
            background: false,
            playbackSpeed: 1.0,
            actionStates: {},
            camera: DEFAULT_CAMERA,
            wireframe: false,
            skeleton: false,
            grid: false,
            selectedColor: "#005344",
            //是否添加选中效果
            selectedEffect: true,
            // Lights
            punctualLights: true,
            exposure: 0.0,
            toneMapping: LinearToneMapping,
            textureEncoding: 'sRGB',
            ambientIntensity: 0.3,
            ambientColor: 0xFFFFFF,
            directIntensity: 0.8 * Math.PI, // TODO(#116)
            directColor: 0xFFFFFF,
            bgColor1: '#ffffff',
            bgColor2: '#353535'
        }
        this.prevTime = 0;

        this.stats = new Stats();
        this.stats.dom.height = '48px';
        [].forEach.call(this.stats.dom.children, (child) => (child.style.display = ''));


        this.scene = new Scene();
        this.objectGroup = new Group();
        this.objectGroup.name = "SceneRoot";
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        this.selectionProxy = new SelectionProxy(this.scene, this.state.selectedColor);
        this.INTERSECTED = null;

        this.originalMaterial = {};
        this.objectScene = {};

        const fov = options.preset === Preset.ASSET_GENERATOR
            ? 0.8 * 180 / Math.PI
            : 60;
        this.defaultCamera = new PerspectiveCamera(fov, el.clientWidth / el.clientHeight, 0.01, 1000);
        this.defaultCamera.name = "camera";
        this.activeCamera = this.defaultCamera;
        this.scene.add(this.defaultCamera);

        this.renderer = window.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = sRGBEncoding;
        // this.renderer.setClearColor(0xcccccc);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(el.clientWidth, el.clientHeight);

        this.pmremGenerator = new PMREMGenerator(this.renderer);
        this.pmremGenerator.compileEquirectangularShader();

        this.neutralEnvironment = this.pmremGenerator.fromScene(new RoomEnvironment()).texture;

        this.controls = new OrbitControls(this.defaultCamera, this.renderer.domElement);
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = -10;
        this.controls.screenSpacePanning = true;

        // this.vignette = createBackground({
        //     aspect: this.defaultCamera.aspect,
        //     grainScale: IS_IOS ? 0 : 0.001, // mattdesl/three-vignette-background#1
        //     colors: [this.state.bgColor1, this.state.bgColor2]
        // });
        // this.vignette.name = 'Vignette';
        // this.vignette.renderOrder = -1;

        this.el.appendChild(this.renderer.domElement);

        this.cameraCtrl = null;
        this.cameraFolder = null;
        this.animFolder = null;
        this.animCtrls = [];
        this.morphFolder = null;
        this.morphCtrls = [];
        this.skeletonHelpers = [];
        this.gridHelper = null;
        this.axesHelper = null;

        this.addAxesHelper();
        this.addGUI();
        if (options.kiosk) this.gui.close();
        this.leftClickPanel = new LeftClickPanel(this.el);

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('mouseup', this.mouseup.bind(this), false);
        window.addEventListener('mousedown', this.mousedown.bind(this), false);
        // window.addEventListener('mousemove', this.mousemove.bind(this), false);
    }

    animate(time) {

        requestAnimationFrame(this.animate);
        const dt = (time - this.prevTime) / 1000;
        TWEEN.update();
        this.controls.update();
        this.stats.update();
        this.mixer && this.mixer.update(dt);
        this.render();
        this.prevTime = time;
    }

    render() {
        this.renderer.render(this.scene, this.activeCamera);
        if (this.state.grid) {
            this.axesCamera.position.copy(this.defaultCamera.position)
            this.axesCamera.lookAt(this.axesScene.position)
            this.axesRenderer.render(this.axesScene, this.axesCamera);
        }
    }

    mousemove(e) {
        let object = this.intersectObjects(e);
        this.raycastHover.apply(this, [object]);
    }

    mousedown(e) {
        const { pageX, pageY } = e;
        // console.log("mousedown", pageX, pageY)
        this.oX = pageX;
        this.oY = pageY;
    }

    mouseup(e) {
        const { pageX, pageY } = e;
        // console.log("mouseup", pageX, pageY)
        if (Math.abs(pageX - this.oX) > 2 || Math.abs(pageY - this.oY) > 2) {
            return
        }
        let object = this.intersectObjects(e);
        this.leftClickPanel.displayPanel(true);
        this.selectionProxy.clear();
        switch (e.button) {
            case 0:
                console.log("左键被点击");
                this.raycastClick.apply(this, [object]);
                break
            case 1:
                console.log("中间按钮被点击");
                break
            case 2:
                console.log("右键被点击，屏幕坐标:", pageX, pageY);
                if (object) {
                    this.raycastClick.apply(this, [object]);
                    this.leftClickPanel.setPanelPosition(pageX, pageY);
                } else {
                    this.leftClickPanel.displayPanel(true);
                }
                break
            default:
                console.log(e.button);
                break
        }

    }

    /**
     * 选中模型
     * @param {object} pickObject 
     * @returns 
     */
    raycastHover(pickObject) {
        if (!pickObject) {
            if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
            this.INTERSECTED = null;
            return
        }
        this.INTERSECTED = pickObject;
        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(0xff0000);
    }


    /**
     * 选中模型
     * @param {object} pickObject 
     * @returns 
     */
    raycastClick(pickObject) {
        if (!pickObject) {
            this.selectionProxy.clear();
            this.dispatchEvent({ type: "pick-node", pickObjectParam: null });
            return
        }
        console.log("点击部件", pickObject.name, pickObject);
        console.log("目标相机", JSON.stringify({
            "endPos": [this.activeCamera.position.x, this.activeCamera.position.y, this.activeCamera.position.z],
            "rotation": [this.activeCamera.rotation._x, this.activeCamera.rotation._y, this.activeCamera.rotation._z],
            "lookAt": [this.controls.target.x, this.controls.target.y, this.controls.target.z]
        }))

        if (this.state.selectedEffect) {
            this.selectionProxy.clear();
            this.selectionProxy.create(pickObject);
        }
        let pickObjectParam = {
            target: pickObject,
            selectedEffect: this.state.selectedEffect
        };
        this.dispatchEvent({ type: "pick-node", pickObjectParam });
    }

    /**
     * 屏幕点击事件
     * @param {event} e 
     * @returns 
     */
    intersectObjects(e) {
        const { clientHeight, clientWidth } = this.el.parentElement;

        this.mouse.x = (e.offsetX / clientWidth) * 2 - 1;
        this.mouse.y = -(e.offsetY / clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.activeCamera);

        let selectNode = [];
        this.scene.children.map(child => {
            if (child instanceof Group) {
                if (child.children > 0) {
                    child.children.map(node => {
                        selectNode.push(node)
                    })
                } else {
                    selectNode.push(child);
                }
            }
        })

        if (selectNode.length === 0) {
            return
        }

        let intersects = this.raycaster.intersectObjects(selectNode, true);

        if (intersects.length <= 0) {
            console.warn("未选中模型!");
            return null;
        }
        let object = intersects[0].object;
        if (object && object.visible) {
            return object;
        }
    }

    resize() {

        const { clientHeight, clientWidth } = this.el.parentElement;

        this.defaultCamera.aspect = clientWidth / clientHeight;
        this.defaultCamera.updateProjectionMatrix();
        // this.vignette.style({ aspect: this.defaultCamera.aspect });
        this.renderer.setSize(clientWidth, clientHeight);

        this.axesCamera.aspect = this.axesDiv.clientWidth / this.axesDiv.clientHeight;
        this.axesCamera.updateProjectionMatrix();
        this.axesRenderer.setSize(this.axesDiv.clientWidth, this.axesDiv.clientHeight);
    }

    /**
    * Adds AxesHelper.
    *
    * See: https://stackoverflow.com/q/16226693/1314762
    */
    addAxesHelper() {
        this.axesDiv = document.createElement('div');
        this.el.appendChild(this.axesDiv);
        this.axesDiv.classList.add('axes');

        const { clientWidth, clientHeight } = this.axesDiv;

        this.axesScene = new Scene();
        this.axesCamera = new PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 10);
        this.axesScene.add(this.axesCamera);

        this.axesRenderer = new WebGLRenderer({ alpha: true });
        this.axesRenderer.setPixelRatio(window.devicePixelRatio);
        this.axesRenderer.setSize(this.axesDiv.clientWidth, this.axesDiv.clientHeight);

        this.axesCamera.up = this.defaultCamera.up;

        this.axesCorner = new AxesHelper(5);
        this.axesScene.add(this.axesCorner);
        this.axesDiv.appendChild(this.axesRenderer.domElement);
    }

    /**
     * 批量模型加载
     * @param {Array} urlArray 
     */
    batchLoad(urlArray) {

        let modelUrls = urlArray;
        if (!Array.isArray(urlArray)) {
            modelUrls = [urlArray];
        }
        let loadPromiseAll = [];
        modelUrls.forEach(urlData => {
            let { fileUrl, rootPath, fileMap, fileName } = urlData;
            loadPromiseAll.push(this.load(fileUrl, rootPath, fileMap, fileName));
        })
        return new Promise((resolve, reject) => {
            Promise.all(loadPromiseAll).then(objects => {
                objects.forEach(object => {
                    console.log(object);
                    let { scene, animations, fileName } = object;
                    scene.name = fileName;
                    scene.animations = animations;
                    this.objectScene[fileName] = { animations, scene };
                    this.objectGroup.add(scene);
                })
                this.objectGroup.position.fromArray([0, 0, 0]);
                // this.objectGroup.layers.set(1)
                this.setContent(this.objectGroup);
                resolve({ scene: this.objectGroup })
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 组件渲染完成需要执行的操作放在这里
     */
    loadCompleted() {
        // this.structureTree = new StructureTree(this);
        this.backupContent(this.content);
    }

    /**
     * 
     * @param {string} url   //模型地址
     * @param {string} rootPath  //根路径
     * @param {string} assetMap  //资源映射
     * @returns 
     */
    load(url, rootPath, assetMap, fileName) {
        const baseURL = LoaderUtils.extractUrlBase(url);
        return new Promise((resolve, reject) => {
            MANAGER.setURLModifier((url, path) => {
                const normalizedURL = rootPath + decodeURI(url).replace(baseURL, '').replace(/^(\.?\/)/, '');
                if (assetMap && assetMap.has(normalizedURL)) {
                    const blob = assetMap.get(normalizedURL);
                    const blobURL = URL.createObjectURL(blob);
                    blobURLs.push(blobURL);
                    return blobURL;
                }
                return (path || '') + url;
            })
            const loader = new GLTFLoader(MANAGER)
                .setCrossOrigin('anonymous')
                .setDRACOLoader(DRACO_LOADER)
                .setKTX2Loader(KTX2_LOADER.detectSupport(this.renderer))
                .setMeshoptDecoder(MeshoptDecoder);
            const blobURLs = [];
            loader.load(url, (gltf) => {
                window.VIEWER.json = gltf;
                const scene = gltf.scene || gltf.scenes[0];
                const animations = gltf.animations || [];
                if (!scene) {
                    throw new Error(
                        'This model contains no scene, and cannot be viewed here. However,'
                        + ' it may contain individual 3D resources.'
                    );
                }
                // this.setContent(scene, clips);
                blobURLs.forEach(URL.revokeObjectURL);
                resolve({ scene, animations, fileName });
            }, (xhr) => {
                let progress = (xhr.loaded / xhr.total).toFixed(2) * 100;
                console.log((progress + "%"))
            }, reject)
        })
    }

    /**
     * 备份
     * @param {THREE.Object3D} object 
     */
    backupContent(object) {
        let currentMesh = object || this.content;
        currentMesh.traverse((node) => {
            node.userData['originalData'] = {} //用于备份材质或是位置等原始数据，以便重置模型时使用
            if (node.material) {
                node.material.envMap = this.texture;
                node.material.reflectivity = 0;
                node.material.fog = false;
                node.userData.originalData['color'] = node.material.color.clone();
                node.userData.originalData['opacity'] = node.material.opacity;
                node.userData.originalData['transparent'] = node.material.transparent;
                // node.userData.originalData['material'] = node.material;

                //用于备份模型原有材质 用于重置模型功能
                this.originalMaterial[node.uuid] = node.material
            }
            node.userData.originalData['visible'] = node.visible;
            node.userData.originalData['position'] = node.position.clone();
            node.userData.originalData['scale'] = node.scale.clone();
            node.userData.originalData['rotation'] = node.rotation.clone();
        })
    }


    /**
     * @param {THREE.Object3D} object
     * @param {Array<THREE.AnimationClip} clips
     */
    setContent(object) {
        this.clear();
        const box = new Box3().setFromObject(object);
        const size = box.getSize(new Vector3()).length();
        const center = box.getCenter(new Vector3());
        this.controls.reset();

        object.position.x += (object.position.x - center.x);
        object.position.y += (object.position.y - center.y);
        object.position.z += (object.position.z - center.z);

        this.controls.maxDistance = size * 10;
        this.defaultCamera.near = size / 100;
        this.defaultCamera.far = size * 100;
        this.defaultCamera.updateProjectionMatrix();

        if (this.options.cameraPosition) {
            this.defaultCamera.position.fromArray(this.options.cameraPosition);
            this.defaultCamera.lookAt(new Vector3());
        } else {
            this.defaultCamera.position.copy(center);
            this.defaultCamera.position.x += size / 2.0;
            this.defaultCamera.position.y += size / 5.0;
            this.defaultCamera.position.z += size / 1.0;
            this.defaultCamera.lookAt(center);
        }
        this.setCamera(DEFAULT_CAMERA);
        this.axesCamera.position.copy(this.defaultCamera.position)
        this.axesCamera.lookAt(this.axesScene.position)
        this.axesCamera.near = size / 100;
        this.axesCamera.far = size * 100;
        this.axesCamera.updateProjectionMatrix();
        this.axesCorner.scale.set(size, size, size);
        this.controls.saveState();
        this.scene.add(object);
        this.content = object;
        this.state.punctualLights = true;

        this.content.traverse((node) => {
            if (node.isLight) {
                this.state.punctualLights = false;
            } else if (node.isMesh) {
                node.material.depthWrite = !node.material.transparent;
                this.setTranslationMeshCenter(node);
            }
        });

        this.updateLights();
        this.updateEnvironment();
        window.VIEWER.scene = this.content;
    }

    setTranslationMeshCenter(mesh) {
        let meshCenterLocal, originOffset, meshPosOffset;
        let box3 = new Box3();
        let meshCenterWorldBefore = new Vector3();
        let meshCenterWorldLater = new Vector3();

        //获取geometry.translate前的mesh 中心点
        box3.setFromObject(mesh);
        box3.getCenter(meshCenterWorldBefore);

        //让mesh的geometry对齐到原点位置（x:0, y:0, z:0）
        meshCenterLocal = mesh.worldToLocal(meshCenterWorldBefore.clone());
        originOffset = new Vector3().sub(meshCenterLocal);
        mesh.geometry.translate(originOffset.x, originOffset.y, originOffset.z);

        //获取geometry.translate 后的mesh 中心点
        box3.setFromObject(mesh);
        box3.getCenter(meshCenterWorldLater);
        let meshCenterLocalBefore = mesh.parent.worldToLocal(meshCenterWorldBefore.clone());
        let meshCenterLocalLater = mesh.parent.worldToLocal(meshCenterWorldLater.clone());
        //计处 geometry.translate 前后的偏差
        meshPosOffset = meshCenterLocalBefore.clone().sub(meshCenterLocalLater);

        //对 mesh.position  调整偏差; 让 mesh.position处于一个正确位置 
        mesh.position.add(meshPosOffset.clone());
        mesh.userData.toCenterPosOffset = originOffset.clone();

    }

    /**
    * @param {string} name
    */
    setCamera(name) {
        if (name === DEFAULT_CAMERA) {
            this.controls.enabled = true;
            this.activeCamera = this.defaultCamera;
        } else {
            this.controls.enabled = false;
            this.content.traverse((node) => {
                if (node.isCamera && node.name === name) {
                    this.activeCamera = node;
                }
            });
        }
    }

    updateLights() {
        const state = this.state;
        const lights = this.lights;

        if (state.punctualLights && !lights.length) {
            this.addLights();
        } else if (!state.punctualLights && lights.length) {
            this.removeLights();
        }

        this.renderer.toneMapping = Number(state.toneMapping);
        this.renderer.toneMappingExposure = Math.pow(2, state.exposure);

        if (lights.length === 2) {
            lights[0].intensity = state.ambientIntensity;
            lights[0].color.setHex(state.ambientColor);
            lights[1].intensity = state.directIntensity;
            lights[1].color.setHex(state.directColor);
        }
    }

    addLights() {
        const state = this.state;

        if (this.options.preset === Preset.ASSET_GENERATOR) {
            const hemiLight = new HemisphereLight();
            hemiLight.name = 'hemi_light';
            this.scene.add(hemiLight);
            this.lights.push(hemiLight);
            return;
        }

        const light1 = new AmbientLight(state.ambientColor, state.ambientIntensity);
        light1.name = 'ambient_light';
        this.defaultCamera.add(light1);

        const light2 = new DirectionalLight(state.directColor, state.directIntensity);
        light2.position.set(0.5, 0, 0.866); // ~60º
        light2.name = 'main_light';
        this.defaultCamera.add(light2);

        this.lights.push(light1, light2);
    }

    removeLights() {

        this.lights.forEach((light) => light.parent.remove(light));
        this.lights.length = 0;

    }

    addGUI() {

        const gui = this.gui = new GUI({ autoPlace: false, width: 260, hideable: true });

        // Display controls.
        const dispFolder = gui.addFolder('Display');
        const envBackgroundCtrl = dispFolder.add(this.state, 'background');
        envBackgroundCtrl.onChange(() => this.updateEnvironment());
        const wireframeCtrl = dispFolder.add(this.state, 'wireframe');
        wireframeCtrl.onChange(() => this.updateDisplay());
        const gridCtrl = dispFolder.add(this.state, 'grid');
        gridCtrl.onChange(() => this.updateDisplay());
        dispFolder.add(this.controls, 'autoRotate');

        // Lighting controls.
        const lightFolder = gui.addFolder('Lighting');
        const encodingCtrl = lightFolder.add(this.state, 'textureEncoding', ['sRGB', 'Linear']);
        encodingCtrl.onChange(() => this.updateTextureEncoding());
        lightFolder.add(this.renderer, 'outputEncoding', { sRGB: sRGBEncoding, Linear: LinearEncoding })
            .onChange(() => {
                this.renderer.outputEncoding = Number(this.renderer.outputEncoding);
                traverseMaterials(this.content, (material) => {
                    material.needsUpdate = true;
                });
            });
        const envMapCtrl = lightFolder.add(this.state, 'environment', environments.map((env) => env.name));
        envMapCtrl.onChange(() => this.updateEnvironment());
        [
            lightFolder.add(this.state, 'toneMapping', { Linear: LinearToneMapping, 'ACES Filmic': ACESFilmicToneMapping }),
            lightFolder.add(this.state, 'exposure', -10, 10, 0.01),
            lightFolder.add(this.state, 'punctualLights').listen(),
            lightFolder.add(this.state, 'ambientIntensity', 0, 2),
            lightFolder.addColor(this.state, 'ambientColor'),
            lightFolder.add(this.state, 'directIntensity', 0, 4), // TODO(#116)
            lightFolder.addColor(this.state, 'directColor')
        ].forEach((ctrl) => ctrl.onChange(() => this.updateLights()));

        // Animation controls.
        this.animFolder = gui.addFolder('Animation');
        this.animFolder.domElement.style.display = 'none';
        const playbackSpeedCtrl = this.animFolder.add(this.state, 'playbackSpeed', 0, 1);
        playbackSpeedCtrl.onChange((speed) => {
            if (this.mixer) this.mixer.timeScale = speed;
        });
        this.animFolder.add({ playAll: () => this.playAllClips() }, 'playAll');

        // Morph target controls.
        this.morphFolder = gui.addFolder('Morph Targets');
        this.morphFolder.domElement.style.display = 'none';

        // Camera controls.
        this.cameraFolder = gui.addFolder('Cameras');
        this.cameraFolder.domElement.style.display = 'none';

        // Stats.
        const perfFolder = gui.addFolder('Performance');
        const perfLi = document.createElement('li');
        this.stats.dom.style.position = 'static';
        perfLi.appendChild(this.stats.dom);
        perfLi.classList.add('gui-stats');
        perfFolder.__ul.appendChild(perfLi);

        const guiWrap = document.createElement('div');
        this.el.appendChild(guiWrap);
        guiWrap.classList.add('gui-wrap');
        guiWrap.appendChild(gui.domElement);
        gui.open();

    }

    updateDisplay() {
        if (this.skeletonHelpers.length) {
            this.skeletonHelpers.forEach((helper) => this.scene.remove(helper));
        }

        traverseMaterials(this.content, (material) => {
            material.wireframe = this.state.wireframe;
        });

        this.content.traverse((node) => {
            if (node.isMesh && node.skeleton && this.state.skeleton) {
                const helper = new SkeletonHelper(node.skeleton.bones[0].parent);
                helper.material.linewidth = 3;
                this.scene.add(helper);
                this.skeletonHelpers.push(helper);
            }
        });

        if (this.state.grid !== Boolean(this.gridHelper)) {
            if (this.state.grid) {
                this.gridHelper = new GridHelper();
                this.axesHelper = new AxesHelper();
                this.axesHelper.renderOrder = 999;
                this.axesHelper.onBeforeRender = (renderer) => renderer.clearDepth();
                this.scene.add(this.gridHelper);
                this.scene.add(this.axesHelper);
            } else {
                this.scene.remove(this.gridHelper);
                this.scene.remove(this.axesHelper);
                this.gridHelper = null;
                this.axesHelper = null;
                this.axesRenderer.clear();
            }
        }
    }

    updateGUI() {
        this.cameraFolder.domElement.style.display = 'none';

        this.morphCtrls.forEach((ctrl) => ctrl.remove());
        this.morphCtrls.length = 0;
        this.morphFolder.domElement.style.display = 'none';

        this.animCtrls.forEach((ctrl) => ctrl.remove());
        this.animCtrls.length = 0;
        this.animFolder.domElement.style.display = 'none';

        const cameraNames = [];
        const morphMeshes = [];
        this.content.traverse((node) => {
            if (node.isMesh && node.morphTargetInfluences) {
                morphMeshes.push(node);
            }
            if (node.isCamera) {
                node.name = node.name || `VIEWER__camera_${cameraNames.length + 1}`;
                cameraNames.push(node.name);
            }
        });

        if (cameraNames.length) {
            this.cameraFolder.domElement.style.display = '';
            if (this.cameraCtrl) this.cameraCtrl.remove();
            const cameraOptions = [DEFAULT_CAMERA].concat(cameraNames);
            this.cameraCtrl = this.cameraFolder.add(this.state, 'camera', cameraOptions);
            this.cameraCtrl.onChange((name) => this.setCamera(name));
        }

        if (morphMeshes.length) {
            this.morphFolder.domElement.style.display = '';
            morphMeshes.forEach((mesh) => {
                if (mesh.morphTargetInfluences.length) {
                    const nameCtrl = this.morphFolder.add({ name: mesh.name || 'Untitled' }, 'name');
                    this.morphCtrls.push(nameCtrl);
                }
                for (let i = 0; i < mesh.morphTargetInfluences.length; i++) {
                    const ctrl = this.morphFolder.add(mesh.morphTargetInfluences, i, 0, 1, 0.01).listen();
                    Object.keys(mesh.morphTargetDictionary).forEach((key) => {
                        if (key && mesh.morphTargetDictionary[key] === i) ctrl.name(key);
                    });
                    this.morphCtrls.push(ctrl);
                }
            });
        }

        if (this.clips.length) {
            this.animFolder.domElement.style.display = '';
            const actionStates = this.state.actionStates = {};
            this.clips.forEach((clip, clipIndex) => {
                clip.name = `${clipIndex + 1}. ${clip.name}`;

                // Autoplay the first clip.
                let action;
                if (clipIndex === 0) {
                    actionStates[clip.name] = true;
                    action = this.mixer.clipAction(clip);
                    action.play();
                } else {
                    actionStates[clip.name] = false;
                }

                // Play other clips when enabled.
                const ctrl = this.animFolder.add(actionStates, clip.name).listen();
                ctrl.onChange((playAnimation) => {
                    action = action || this.mixer.clipAction(clip);
                    action.setEffectiveTimeScale(1);
                    playAnimation ? action.play() : action.stop();
                });
                this.animCtrls.push(ctrl);
            });
        }
    }

    updateEnvironment() {

        const environment = environments.filter((entry) => entry.name === this.state.environment)[0];

        this.getCubeMapTexture(environment).then(({ envMap }) => {
            this.scene.environment = envMap;
            this.scene.background = this.state.background ? envMap : null;

        });

    }

    getCubeMapTexture(environment) {
        const { id, path } = environment;

        // neutral (THREE.RoomEnvironment)
        if (id === 'neutral') {
            return Promise.resolve({ envMap: this.neutralEnvironment });
        }

        // none
        if (id === '') {
            return Promise.resolve({ envMap: null });
        }

        return new Promise((resolve, reject) => {
            new EXRLoader()
                .load(path, (texture) => {
                    const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
                    this.pmremGenerator.dispose();

                    resolve({ envMap });

                }, undefined, reject);

        });

    }

    reset() {
        this.content.traverse(node => {
            let { originalData } = node.userData;
            if (!originalData) return;

            if (node.isMesh) {
                if (this.originalMaterial[node.uuid]) node.material = this.originalMaterial[node.uuid];
                if (originalData.opacity >= 0) node.material.opacity = originalData.opacity;
                if (originalData.color) node.material.color.copy(originalData.color);
            }
            if (originalData.position) node.position.copy(originalData.position);
            if (originalData.scale) node.scale.copy(originalData.scale);
            if (originalData.rotation) node.rotation.copy(originalData.rotation);
            node.visible = true;
        })
    }

    clear() {
        if (!this.content) return;
        // this.objectScene = {};
        // this.objectGroup = new Group();
        this.scene.remove(this.content);
        // dispose geometry
        this.content.traverse((node) => {
            if (!node.isMesh) return;
            node.geometry.dispose();
        });
        // dispose textures
        traverseMaterials(this.content, (material) => {
            for (const key in material) {
                if (key !== 'envMap' && material[key] && material[key].isTexture) {
                    material[key].dispose();
                }
            }
        });
    }
}

function traverseMaterials(object, callback) {
    object.traverse((node) => {
        if (!node.isMesh) return;
        const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];
        materials.forEach(callback);
    });
}

Object.setPrototypeOf(ThreeViewer.prototype, EventDispatcher.prototype);