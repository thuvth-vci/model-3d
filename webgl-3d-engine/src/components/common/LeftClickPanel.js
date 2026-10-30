import { createElement } from '../../utils/helper';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export class LeftClickPanel {
    constructor(el) {
        this.el = el;
        // this.viewer = viewer;
        this.panelDomEl = null;
        this.options = {
            menus: [
                { label: "虚化选中", key: 0 },
                { label: "隐藏选中", key: 1 },
                { label: "扩大选区", key: 2 }
            ]
        }
        this.init();
    }

    init() {
        //暂未开发
        createLectClickPanel.apply(this);
        // this.setPanelPosition(806, 375);
    }

    setPanelPosition(pageX, pageY) {
        this.panelDomEl.style.display = "block";
        this.panelDomEl.style.left = pageX + "px";
        this.panelDomEl.style.top = pageY + "px";
    }

    displayPanel(val) {
        this.panelDomEl.style.display = val ? "none" : "block";
    }
}



function createLectClickPanel() {
    const panel = createElement("div", "left-panel-container");
    const menu = createElement("div", "menu-container");
    this.options.menus.forEach(e => {
        const item = createElement("div", "item");
        const content = `<span>${e.label}</span>`;
        item.innerHTML = content;
        menu.appendChild(item);
    })
    panel.appendChild(menu);
    this.el.appendChild(panel);
    this.panelDomEl = panel;
}

function create2dPanel(nodeName) {
    let panel = createElement("div", "left-panel-container");
    let startPos = new THREE.Vector3();
    let nodeBox = getNodeBox3ByName(nodeName);
    let panelObject = new CSS2DObject(panel);
    panelObject.name = "left-panel-container";

}

function getNodeBox3ByName(nodeName) {
    let node = this.viewer.scene.getObjectByName(nodeName);
    let box = new THREE.Box3();
    if (!node) {
        return box;
    }
    box = new THREE.Box3();
    box.expandByObject(node);
    return box;
}
