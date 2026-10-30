// 引入threejs
import * as THREE from 'three';
// 围栏数据数组[位置，旋转角度，是否启用长围栏]
const fenceDataArr = [
    // Z轴后方围栏
    [new THREE.Vector3(-77.2, 1.5, 128.7), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, 104.4), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, 80.1), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, 55.8), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, 31.5), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, 7.2), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, -17.1), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, -41.4), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, -65.7), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, -90), Math.PI / 2, true],
    [new THREE.Vector3(-77.2, 1.5, -114.3), Math.PI / 2, true],
    // [new THREE.Vector3(-77.2, 1.5, -138.6), Math.PI / 2, true],

    // X轴右方围栏
    [new THREE.Vector3(-67.7, 1.5, -144.5), 0, true],
    [new THREE.Vector3(-43.4, 1.5, -144.5), 0, true],
    [new THREE.Vector3(-19.1, 1.5, -144.5), 0, true],
    [new THREE.Vector3(5.2, 1.5, -144.5), 0, true],
    [new THREE.Vector3(29.5, 1.5, -144.5), 0, true],
    [new THREE.Vector3(53.8, 1.5, -144.5), 0, true],

    // Z轴前方围栏
    [new THREE.Vector3(73.6, 1.5, -143.5), Math.PI / 2, true],
    [new THREE.Vector3(73.6, 1.5, -119.2), Math.PI / 2, true],
    [new THREE.Vector3(73.6, 1.5, -94.9), Math.PI / 2, true],
    [new THREE.Vector3(73.6, 1.5, -70.6), 0, false],
    // [new THREE.Vector3(73.6, 1.5, -46.3), Math.PI / 2, true],
    // [new THREE.Vector3(73.6, 1.5, -22), Math.PI / 2, true],
    // [new THREE.Vector3(73.6, 1.5, 2.3), Math.PI / 2, true],
    // [new THREE.Vector3(73.6, 1.5, 26.6), Math.PI / 2, true],
    // [new THREE.Vector3(73.6, 1.5, 50.9), Math.PI / 2, true],
    // [new THREE.Vector3(73.6, 1.5, 75.2), Math.PI / 2, true],
    // [new THREE.Vector3(73.6, 1.5, 99.5), Math.PI / 2, true],
    // [new THREE.Vector3(73.6, 1.5, 123.9), Math.PI / 2, true],
    // [new THREE.Vector3(73.6, 1.5, 150.8), 0, false],

    // X轴左方围栏
    // [new THREE.Vector3(-3.7, 1.5, 152), Math.PI, true],
    // [new THREE.Vector3(20.6, 1.5, 152), Math.PI, true],
    // [new THREE.Vector3(44.9, 1.5, 152), Math.PI, true],
    // [new THREE.Vector3(69.2, 1.5, 152), Math.PI, true],
    // [new THREE.Vector3(69.2, 1.5, 152), Math.PI / 2, false],
    // [new THREE.Vector3(73.7, 1.5, 152), Math.PI / 2, false],
]
// 添加围栏
function addFence (model) {
    if (!model) return;
    const longFenceObj = model.getObjectByName('3DXY_geometry_002002');
    const shortFenceObj = model.getObjectByName('3DXY_geometry_002001');
    if (!longFenceObj && !shortFenceObj) return;

    const fenceGroup = new THREE.Group();
    fenceDataArr.map(arr => {
        // 根据围栏数据确定选用长围栏还是短围栏，缺失时退而使用另一种，避免出现缺口
        let sourceObj = arr[2] ? longFenceObj : shortFenceObj;
        if (!sourceObj) sourceObj = longFenceObj || shortFenceObj;
        if (!sourceObj) return;

        let fence = sourceObj.clone();
        if (!arr[2]) {
            fence.rotation.z += Math.PI / 4.6;
        }
        fence.rotation.z += arr[1];
        fence.position.copy(arr[0]);
        fenceGroup.add(fence);
    })
    model.add(fenceGroup);
}

export { addFence }