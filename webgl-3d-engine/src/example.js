import { App, ThreeViewer, StructureTree, ObjectTransformControls, ToolBar } from "./index";
let options = {
    test: "a"
}
example();//drag

//测试db
function example() {
    // let _app = new App(document.querySelector('.wrap'), options);

    const el = document.querySelector('.wrap');
    const viewerEl = document.createElement('div');
    viewerEl.classList.add('viewer');
    const dropEl = el.querySelector('.dropzone');
    dropEl.innerHTML = '';
    dropEl.appendChild(viewerEl);
    const modelDatas = [{
        fileUrl: "motor.glb",
        fileName: "motor"
    }];
    const viewer = new ThreeViewer(viewerEl, options);
    viewer.batchLoad(modelDatas).catch((e) => this.onError(e)).then(async (gltf) => {
        viewer.loadCompleted();
        el.querySelector('.spinner').style.display = 'none';
        modelDatas.forEach(modelData => {
            let { fileUrl, rootPath, fileMap } = modelData;
            if (typeof fileUrl === 'string') URL.revokeObjectURL(fileUrl);
        })
        const structureTree = new StructureTree(el, gltf);

        const objectTransformControls = new ObjectTransformControls(el, viewer);
        objectTransformControls.addEventListener("translate", async (e) => {
            console.log(e);
            const animations = await animationProxy.generate([e.clip]);
            animationPlayer.push(animations);
            console.log(animations)
        })

        objectTransformControls.addEventListener("rotate", async (e) => {
            console.log(e);
            const animations = await animationProxy.generate([e.clip]);
            animationPlayer.push(animations);
            console.log(animations)
        })

        const toolBar = new ToolBar(el, {
            revoke: () => { console.log("撤销") },
            translate: () => { objectTransformControls.switchMode(); },
            rotate: () => { objectTransformControls.switchMode("rotate"); },
            scale: () => { objectTransformControls.switchMode("scale"); },
            reset: () => { console.log("重置"); viewer.reset(); objectTransformControls.clear(); }
        });
    })
}