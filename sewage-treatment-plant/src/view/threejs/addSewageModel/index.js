
// 引入threejs
import * as THREE from 'three';
// 引入gltf模型加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 添加围栏函数
import { addFence } from '../addFence/index.js';
// 添加树模型函数
import { addPlant } from "../addPlant/index.js";

// sewageModel.glb 缺失时（体积超过100MB未纳入Git）使用的占位3D场景
// 按真实模型的命名约定摆放物体，使addFence/addPlant/poolMaterial/waterPlane都能正常工作，而不是整场留白
function buildFallbackSewageModel () {
    const fallbackGroup = new THREE.Group();
    fallbackGroup.name = '占位污水厂场景';

    // 地面
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        new THREE.MeshStandardMaterial({ color: 0x1f342b, roughness: 0.8, metalness: 0.1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    fallbackGroup.add(ground);

    // 主平台
    const platform = new THREE.Mesh(
        new THREE.BoxGeometry(220, 1, 240),
        new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.6 })
    );
    platform.receiveShadow = true;
    fallbackGroup.add(platform);

    // 围栏模板对象，供addFence克隆使用（放在地面以下，本身不可见）
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d });
    const fenceMeshLong = new THREE.Mesh(new THREE.BoxGeometry(24, 2, 0.4), fenceMat);
    fenceMeshLong.name = '3DXY_geometry_002002';
    fenceMeshLong.position.set(0, -100, 0);
    fallbackGroup.add(fenceMeshLong);

    const fenceMeshShort = new THREE.Mesh(new THREE.BoxGeometry(12, 2, 0.4), fenceMat);
    fenceMeshShort.name = '3DXY_geometry_002001';
    fenceMeshShort.position.set(0, -100, 0);
    fallbackGroup.add(fenceMeshShort);

    // 水池外墙/池体，供setPoolMaterial贴材质
    const poolMatBlue = new THREE.MeshStandardMaterial({ color: 0x1e5799, roughness: 0.4 });
    const poolMatCement = new THREE.MeshStandardMaterial({ color: 0x556270, roughness: 0.7 });

    const poolNorthSouth = new THREE.Mesh(new THREE.BoxGeometry(60, 6, 80), poolMatBlue);
    poolNorthSouth.name = '南北生物池蓝色';
    poolNorthSouth.position.set(-75, 3, 15);
    fallbackGroup.add(poolNorthSouth);

    const poolNorthSouthOut = new THREE.Mesh(new THREE.BoxGeometry(62, 5.8, 82), poolMatCement);
    poolNorthSouthOut.name = '南北生物池蓝色外';
    poolNorthSouthOut.position.set(-75, 2.9, 15);
    fallbackGroup.add(poolNorthSouthOut);

    const poolCement = new THREE.Mesh(new THREE.BoxGeometry(30, 5, 40), poolMatCement);
    poolCement.name = '南北生物池水泥';
    poolCement.position.set(-30, 2.5, 15);
    fallbackGroup.add(poolCement);

    const poolWestWall = new THREE.Mesh(new THREE.BoxGeometry(45, 5, 50), poolMatCement);
    poolWestWall.name = '西生物池外墙004';
    poolWestWall.position.set(-40, 2.5, -40);
    fallbackGroup.add(poolWestWall);

    // 各水池水面，供waterPlane识别尺寸并生成真正的水面网格
    const createWaterMesh = (name, x, z, sizeX, sizeZ, isCircle = false) => {
        const geo = isCircle
            ? new THREE.CircleGeometry(sizeX / 2, 64)
            : new THREE.PlaneGeometry(sizeX, sizeZ);
        geo.computeBoundingBox();
        const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ visible: false }));
        mesh.name = name;
        mesh.position.set(x, 4.5, z);
        mesh.rotation.x = -Math.PI / 2;
        fallbackGroup.add(mesh);
    };
    createWaterMesh('初沉池水面1', -60, 60, 24, 24, true);
    createWaterMesh('初沉池水面1001', -30, 60, 24, 24, true);
    createWaterMesh('南北生物池水面', -75, 15, 56, 76);
    createWaterMesh('东西生物池-东水面1', 10, -20, 25, 35);
    createWaterMesh('东西生物池-东水面2', 40, -20, 25, 35);
    createWaterMesh('东西生物池-西水面1', -40, -40, 20, 30);
    createWaterMesh('东西生物池-西水面2', -15, -40, 20, 30);
    createWaterMesh('二沉池3水面', 105, -45, 36, 36, true);
    createWaterMesh('二沉池3水面001', 105, -85, 36, 36, true);
    createWaterMesh('二沉池4水面', 60, -45, 36, 36, true);
    createWaterMesh('二沉池4水面001', 60, -85, 36, 36, true);
    createWaterMesh('高效沉淀池水面', 20, 40, 30, 30);
    createWaterMesh('v滤池水', 60, 40, 30, 30);

    // 鼓风机房建筑
    const blowerHouse = new THREE.Mesh(
        new THREE.BoxGeometry(35, 14, 25),
        new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.3 })
    );
    blowerHouse.position.set(1, 7, -14);
    blowerHouse.castShadow = true;
    fallbackGroup.add(blowerHouse);

    // 建筑物标签坐标，供label/index.js的addBuildLabel使用
    const buildLabelsGroup = new THREE.Group();
    buildLabelsGroup.name = '建筑物坐标';
    [
        { name: '曝气池', pos: [-75, 6, 40] },
        { name: '鼓风机房', pos: [1, 14, -14] },
        { name: '二沉池', pos: [106, 6, -43.5] },
        { name: '粗格栅', pos: [-75, 6, 60] },
    ].forEach(item => {
        const dummy = new THREE.Object3D();
        dummy.name = item.name;
        dummy.position.set(...item.pos);
        buildLabelsGroup.add(dummy);
    });
    fallbackGroup.add(buildLabelsGroup);

    // 树木坐标组，供addPlant克隆树模型使用
    const treeNames = ['松树坐标', '秋天树2坐标', '秋天树坐标', '矮树坐标', '大树坐标', '小树2坐标', '高树坐标', '旧树坐标'];
    treeNames.forEach((treeName, idx) => {
        const treeGroupNode = new THREE.Group();
        treeGroupNode.name = treeName;
        treeGroupNode.position.set(-60 + (idx % 4) * 35, 0, -100 + Math.floor(idx / 4) * 80);
        for (let i = 0; i < 4; i++) {
            const leafDummy = new THREE.Object3D();
            leafDummy.position.set((i % 2) * 8, 0, Math.floor(i / 2) * 8);
            treeGroupNode.add(leafDummy);
        }
        fallbackGroup.add(treeGroupNode);
    });

    return fallbackGroup;
}

// 添加污水厂模型函数
async function addSewageModel (envMap) {
    // 创建模型组对象
    const model = new THREE.Group();
    model.rotateY(-Math.PI / 2);
    model.name = '污水厂模型';

    // 进度条元素
    const progressDiv = document.getElementsByClassName('ant-progress-bg')[0];
    // 进度条文字百分比元素
    const progressText = document.getElementsByClassName('ant-progress-text')[0];
    const hideProgress = () => {
        setTimeout(() => {
            const progElem = document.getElementsByClassName('progress')[0];
            if (progElem) progElem.style.display = 'none';
        }, 1500);
    };

    // 创建gltf模型加载器
    const gltfLoader = new GLTFLoader();

    return new Promise(resolve => {
        // http://211.143.122.110:18062/model/sewage.glb
        // 加载污水厂模型
        gltfLoader.load('./sewageModel.glb', (gltf) => {
            const loadedScene = gltf.scenes ? gltf.scenes[0] : gltf.scene;
            loadedScene.traverse(function (obj) {
                if (obj.name && obj.name.includes('玻璃')) {
                    obj.material.envMap = envMap;
                    obj.material.metalness = 0.3;
                    obj.material.roughness = 0.5;
                    obj.material.transparent = true;
                    obj.material.opacity = 0.9;
                    obj.material.refractionRatio = 0.5;
                    obj.material.envMapIntensity = 1;
                    obj.material.reflectivity = 0.9;
                    obj.material.transmission = 1.0;
                    obj.material.thickness = 0.5;
                }
                if (obj.isMesh) {
                    // 开启产生阴影
                    obj.castShadow = true;
                    // 开启接受阴影
                    obj.receiveShadow = true;
                }
            })
            model.add(loadedScene);
            // 添加围栏
            addFence(loadedScene);
            // 添加树模型
            addPlant(loadedScene);

            if (progressDiv) progressDiv.style.width = '100%';
            if (progressText) progressText.innerHTML = `项目正在初始化`;
            // 延迟几秒再隐藏进度条
            hideProgress();
            resolve(model);
        },
            (xhr) => {
                // 模型加载百分比进度
                if (xhr.total > 0) {
                    const percent = ((xhr.loaded / xhr.total) * 100).toFixed(1);
                    // 设置加载进度(由于进度条动画存在一定延迟，所以在基础上加一点)
                    if (progressDiv) progressDiv.style.width = (percent - '') + 6 + '%';
                    if (progressText) {
                        progressText.innerHTML = percent === '100.0'
                            ? `项目正在初始化`
                            : `模型加载中${percent}%`;
                    }
                }
            },
            (error) => {
                // sewageModel.glb 体积超过100MB，未纳入Git，本地缺失该文件时会走到这里
                console.warn('污水厂模型(sewageModel.glb)加载失败，使用占位3D场景代替。请将该文件放入 public 目录下以显示真实模型。', error);
                const fallbackScene = buildFallbackSewageModel();
                model.add(fallbackScene);
                addFence(fallbackScene);
                addPlant(fallbackScene);

                if (progressText) progressText.innerHTML = `模型文件缺失，已使用占位场景`;
                hideProgress();
                resolve(model);
            })
    })
}

export { addSewageModel }
