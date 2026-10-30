import { ValidationController } from './lib/validation-controller.js';
import { ThreeViewer, StructureTree, ToolBar, ObjectTransformControls } from "../index";
import { SimpleDropzone } from 'simple-dropzone';
import queryString from 'query-string';

window.VIEWER = {};

export class App {
    /**
     * 
     * @param {Element} el 
     * @param {Options} options 
     */
    constructor(el, options) {

        const hash = options.hash ? queryString.parse(options.hash) : {};

        this.options = {
            kiosk: Boolean(hash.kiosk),
            model: hash.model || '',
            preset: hash.preset || '',
            cameraPosition: hash.cameraPosition
                ? hash.cameraPosition.split(',').map(Number)
                : null
        };
        this.el = el;
        this.viewer = null;
        this.viewerEl = null;
        this.spinnerEl = el.querySelector('.spinner');
        this.dropEl = el.querySelector('.dropzone');
        this.inputEl = el.querySelector('#file-input');
        this.validationCtrl = new ValidationController(el);
        this.createDropzone();
        this.hideSpinner();
    }

    /**
     * view 管理
     */
    createViewer() {
        this.viewerEl = document.createElement('div');
        this.viewerEl.classList.add('viewer');
        this.dropEl.innerHTML = '';
        this.dropEl.appendChild(this.viewerEl);
        this.viewer = new ThreeViewer(this.viewerEl, this.options);
        return this.viewer;
    }

    /**
     * 设置文件拖放控制器
     */
    createDropzone() {
        const dropCtrl = new SimpleDropzone(this.dropEl, this.inputEl);
        dropCtrl.on('drop', ({ files }) => this.load(files));
        dropCtrl.on('dropstart', () => this.showSpinner());
        dropCtrl.on('droperror', () => this.hideSpinner());
    }

    /**
     * 加载模型文件支持多个
     * @param  {Map<string, File>} fileMap
     */
    load(fileMap) {
        let models = [];
        // let rootFile;
        // let rootPath;
        Array.from(fileMap).forEach(([path, file]) => {
            if (file.name.match(/\.(gltf|glb)$/)) {
                let model = {
                    rootFile: file,
                    rootPath: path.replace(file.name, ''),
                    fileMap,
                    fileName: file.name
                }

                models.push(model);
            }
        });
        this.view(models);
    }

    /**
     * Passes a model to the viewer, given file and resources.
     * @param  {File|string} rootFile
     * @param  {string} rootPath
     * @param  {Map<string, File>} fileMap
     */
    view(models) {
        if (this.viewer) this.viewer.clear();

        const viewer = this.viewer || this.createViewer();

        let modelDatas = [];

        models.forEach(model => {
            let { rootFile, rootPath, fileMap, fileName } = model;
            const fileUrl = typeof rootFile === 'string'
                ? rootFile
                : URL.createObjectURL(rootFile);
            let modelData = { fileUrl, rootPath, fileMap, fileName };
            modelDatas.push(modelData);
        })


        const cleanup = () => {
            this.hideSpinner();
            modelDatas.forEach(modelData => {
                let { fileUrl, rootPath, fileMap } = modelData;
                if (typeof fileUrl === 'string') URL.revokeObjectURL(fileUrl);
            })
        };

        viewer.batchLoad(modelDatas).catch((e) => this.onError(e)).then((modelInfo) => {
            modelDatas.forEach(modelData => {
                if (!this.options.kiosk) {
                    const { fileUrl, rootPath, fileMap } = modelData;
                    this.validationCtrl.validate(fileUrl, rootPath, fileMap, modelInfo);
                }
            })
            viewer.loadCompleted();
            cleanup();

            //创建目录树
            const structureTree = new StructureTree(this.el, modelInfo);

            const objectTransformControls = new ObjectTransformControls(this.el, viewer);
            objectTransformControls.addEventListener("translate", async (e) => {
                console.log(e);
            })

            const toolBar = new ToolBar(this.el, {
                revoke: () => { console.log("撤销"); viewer.reset(); },
                translate: () => { objectTransformControls.switchMode(); },
                rotate: () => { objectTransformControls.switchMode("rotate"); },
                scale: () => { objectTransformControls.switchMode("scale"); },
                reset: () => { console.log("重置"); viewer.reset(); objectTransformControls.clear(); }
            });
        })
    }

    /**
    * @param  {Error} error
    */
    onError(error) {
        let message = (error || {}).message || error.toString();
        if (message.match(/ProgressEvent/)) {
            message = 'Unable to retrieve this file. Check JS console and browser network tab.';
        } else if (message.match(/Unexpected token/)) {
            message = `Unable to parse file content. Verify that this file is valid. Error: "${message}"`;
        } else if (error && error.target && error.target instanceof Image) {
            message = 'Missing texture: ' + error.target.src.split('/').pop();
        }
        window.alert(message);
        console.error(error);
    }

    showSpinner() {
        this.spinnerEl.style.display = '';
    }

    hideSpinner() {
        this.spinnerEl.style.display = 'none';
    }
}