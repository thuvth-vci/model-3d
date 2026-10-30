import { createElement } from "../../utils/helper";
import "../../scss/viewer-toolbar.scss";

export class ToolBar {
  constructor(el, opt) {
    this.el = el;
    this.opt = opt;
    this.bars = [
      {
        title: "撤销",
        mode: "revoke",
        icon: "revoke-icon"
      },
      {
        title: "平移",
        mode: "translate",
        icon: "translate-icon",
        // state: "active"
      },
      {
        title: "旋转",
        mode: "rotate",
        icon: "rotate-icon"
      },
      {
        title: "缩放",
        mode: "scale",
        icon: "scale-icon"
      },
      {
        title: "重置",
        mode: "reset",
        icon: "reset-icon"
      }
    ];
    this.activeBarEl = null;
    this.activeBarIconEl = null;
    this.isCollapse = false;
    this.init();
  }

  init() {
    const viewerBbar = createElement('div', 'toolbar');
    this.bars.forEach(e => {
      let { title, mode, icon, state } = e;
      let barItem = createElement("div", `bar-item ${state}`);
      barItem.title = title;
      let iconEl = createElement("div", `icon ${icon} ${state}`);
      iconEl.addEventListener("click", () => {
        if (this.activeBarEl && this.activeBarIconEl) {
          this.activeBarIconEl.classList.remove("active");
          this.activeBarEl.classList.remove("active");
          this.activeBarEl = null;
          this.activeBarIconEl = null;
        }

        //调用接口
        this.opt[mode]();

        iconEl.classList.add("active");
        barItem.classList.add("active");
        this.activeBarEl = barItem;
        this.activeBarIconEl = iconEl;
      })
      barItem.appendChild(iconEl);
      viewerBbar.appendChild(barItem);
    })
    this.el.appendChild(viewerBbar);
  }
}