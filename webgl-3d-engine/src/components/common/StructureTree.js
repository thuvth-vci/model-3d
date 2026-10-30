import { createElement } from "../../utils/helper";
import "../../scss/structure-tree.scss";
import { TweenMax, Linear } from "gsap";
export class StructureTree {
    constructor(el, gltf) {
        this.el = el;
        this.gltf = gltf;
        this.defaultDepth = 4;
        this.init();
    }

    init() {
        this.domEl = createElement("div", "viewer-structure scrollbar-style");

        let titleEl = createElement("div", "title", `<p>目录结构</p>`);
        let closeIcon = createElement("div", "close-btn");
        closeIcon.addEventListener("click", () => {
            this.close();
        })
        titleEl.appendChild(closeIcon);

        this.domEl.appendChild(titleEl);

        this.el.appendChild(this.domEl);

        let unfoldBtn = createElement("div", "unfold-btn");
        unfoldBtn.title = "打开模型树";
        unfoldBtn.addEventListener("click", () => {
            this.open();
        })
        this.el.appendChild(unfoldBtn);

        this.initTree();
    }

    close() {
        TweenMax.to('.viewer-structure', 1, {
            width: 0,
            left: 0,
            display: "none",
            ease: Linear.easeIn,
            onComplete: () => {
                TweenMax.to(".unfold-btn", 0.5, {
                    opacity: 1,
                    left: "10px",
                    ease: Linear.easeIn
                })
            }
        })
    }

    open() {
        TweenMax.to(".unfold-btn", 0.5, {
            opacity: 0,
            left: "-50px",
            ease: Linear.easeIn
        })
        TweenMax.to('.viewer-structure', 1, {
            width: "280px",
            height: "80%",
            left: "50px",
            display: "block",
            ease: Linear.easeIn
        })
    }

    initTree() {
        const treeDomEl = createElement("div", "tree-container");
        traverseTree(this.gltf.scene, 1, ({ node, depth }) => {
            const treeNodeEl = createNode.apply(this, [node, depth]);
            node.el = treeNodeEl;
            treeDomEl.appendChild(treeNodeEl);
        })
        this.domEl.appendChild(treeDomEl);
    }
}

function createNode(node, depth) {
    const treeNodeEl = createElement("div", "tree-node");
    const nodeContent =
        `<div class="node-content" >
            <span class="expanded-btn" style="display:${!node.isMesh ? "inline-block" : "none"}"></span>
            <input class="checkbox" type="checkbox" checked="checked"/>
            <span title="${node.name}">${node.name}</span>
        </div>`
    treeNodeEl.innerHTML = nodeContent;
    treeNodeEl.style.paddingLeft = depth * 15 + "px";
    if (depth >= this.defaultDepth) {
        treeNodeEl.style.display = "none";
    }
    const expandedBtn = treeNodeEl.querySelector(".expanded-btn");
    expandedBtn.addEventListener("click", () => {
        if (expandedBtn.classList.value.indexOf("active") > -1) {
            expandedBtn.classList.remove("active");
            showNodeEl(node, false);
        } else {
            expandedBtn.classList.add("active");
            showNodeEl(node, true);
        }
    })

    const checkbox = treeNodeEl.querySelector(".checkbox");
    checkbox.addEventListener("click", () => {
        const checked = checkbox.checked;
        checkedNodeEl(node, checked);
    })
    return treeNodeEl;
}

function checkedNodeEl(node, bool) {
    node.children.forEach((child) => {
        const checkbox = child.el.querySelector(".checkbox");
        node.traverse(e => {
            if (!e.isMesh) return
            e.material.opacity = 0;
            e.visible = bool;
        })
        checkbox.checked = bool;
        if (child.children.length > 0) {
            checkedNodeEl(child, bool);
        }
    });
}

function showNodeEl(node, bool) {
    node.children.forEach((child) => {
        child.el.style.display = bool ? "inline-block" : "none";
    });
}



function traverseTree(node, depth, callback) {
    callback({ node, depth });
    if (node.children.length > 0) {
        depth += 1;
        node.children.forEach(e => {
            traverseTree(e, depth, callback);
        })
    }
}