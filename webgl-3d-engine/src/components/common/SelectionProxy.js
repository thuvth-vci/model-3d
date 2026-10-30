import * as THREE from 'three';
import EdgeShader from '../../shaders/EdgeShader';

export class SelectionProxy {
    constructor(scene, selectedColor) {
        this.scene = scene;
        this.obj = null;
        this.proxies = [];
        this.material = { color: selectedColor, opacity: 0.4, transparent: true, metalness: 0.65, roughness: 0.54 }
        this.originMaterial = { ...this.material }
    }

    create(pickedObject) {
        pickedObject.traverse(e => {
            if (e.isMesh) {
                this.addProxy(e);
            }
        })
    }

    addProxy(targetObject) {

        let currentMaterial = { ...this.material };
        currentMaterial.color = new THREE.Color(currentMaterial.color);
        let selectionMaterialBase = new THREE.MeshStandardMaterial({ ...currentMaterial });
        let selectionMaterialTop = new THREE.MeshStandardMaterial({ ...currentMaterial });
        selectionMaterialTop.packedNormals = true;
        selectionMaterialBase.packedNormals = true;

        selectionMaterialBase.depthWrite = false;
        selectionMaterialBase.depthTest = false;
        if (!targetObject) return;
        let hiddenEdge = new THREE.Mesh(targetObject.geometry, selectionMaterialBase);
        hiddenEdge.proxyName = targetObject.name;
        hiddenEdge.matrix.copy(targetObject.matrixWorld);
        hiddenEdge.matrixAutoUpdate = false;
        hiddenEdge.matrixWorldNeedsUpdate = true;
        hiddenEdge.frustumCulled = false;
        this.scene.add(hiddenEdge);
        this.proxies.push(hiddenEdge);

        let topSelectionProxy = new THREE.Mesh(targetObject.geometry, selectionMaterialTop);
        topSelectionProxy.proxyName = targetObject.name;
        topSelectionProxy.matrix.copy(targetObject.matrixWorld);
        topSelectionProxy.matrixAutoUpdate = false;
        topSelectionProxy.matrixWorldNeedsUpdate = true;
        topSelectionProxy.frustumCulled = false;
        this.scene.add(topSelectionProxy);
        this.proxies.push(topSelectionProxy);
        this.obj = targetObject;
    }

    removeProxy(targetObject) {
        let proxies = Object.assign([], this.proxies);
        proxies.forEach(proxy => {
            if (proxy.proxyName == targetObject.name) {
                this.scene.remove(proxy);
            }
        })
    }

    clear(pickedObject) {
        if (pickedObject) {
            pickedObject.traverse(e => {
                if (e.isMesh) {
                    this.removeProxy(e);
                }
            })
        } else {
            if (this.proxies) {
                this.proxies.map((proxy) => this.scene.remove(proxy));
                this.proxies = [];
            }
        }
    }

    sync() {
        this.proxies.map((proxy) => proxy.matrix.copy(this.obj.matrixWorld));
    }


    hiddenProxy() {
        if (this.proxies) this.proxies.map((proxy) => proxy.visible = false);
    }

    showProxy() {
        this.proxies.map((proxy) => proxy.visible = true);
    }

    resetMaterial() {
        this.material = { ...this.originMaterial }
    }

    destroy() {
        this.clear();
        this.scene = null;
        this.obj = null;
        this.proxies = null;
    }
}