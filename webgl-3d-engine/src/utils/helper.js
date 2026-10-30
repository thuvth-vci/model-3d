import * as  THREE from 'three';
function createElement(tag, className, html) {
    let el = document.createElement(tag);
    if (className) {
        el.className = className;
    }
    if (html) {
        el.innerHTML = html;
    }
    return el;
}

function getElementWidth(el) {
    if (el.getBoundingClientRect) {
        return el.getBoundingClientRect().width;
    } else {
        return el.clientWidth;
    }
}

function getElementHeight(el) {
    if (el.getBoundingClientRect) {
        return el.getBoundingClientRect().height;
    } else {
        return el.clientHeight;
    }
}

function setDefault( object, defaultVal ) {
    if( object === null || object === undefined ) return defaultVal;    
    return object;
}

function toScreenPosition(pos, camera, width, height) {
    var vector = pos.project(camera);
  
    vector.x = (vector.x + 1) / 2 * width;
    vector.y = -(vector.y - 1) / 2 * height;
    return {
        x: vector.x,
        y: vector.y,
    };
  };

/**
 * 获取该节点为的box、边长、，最大、最小的边长，中心点
 * @method getNodeBox
 * @param {ThreeObject3d} node 
 * @returns {Object}
 */
function getNodeBox(node) {
    
  let box = new THREE.Box3();
  let center = new THREE.Vector3();
  let length = new THREE.Vector3();
  box.expandByObject(node);
  box.getCenter(center);
  length = box.max.clone().sub(box.min); 
  let maxLength = Math.max(length.x, length.y, length.z);
  let minLength = Math.min(length.x, length.y, length.z);
    
  return {
    box, 
    center, 
    length, 
    maxLength, 
    minLength,
    max: box.max.clone(), 
    min: box.min.clone(), 
  };

}

/**
 * 获取两个Vector3三个方向的各自的长度
 * @method getLengthXYZ
 * @param {Vector3} vector1 
 * @param {Vector3} vector2 
 * @returns {Vector3}
 */

function getLengthXYZ(vector1, vector2) {
  vector1.clone().sub(vector2);
  if(vector1.x < 0) vector1.x * -1;
  if(vector1.y < 0) vector1.y * -1;
  if(vector1.z < 0) vector1.z * -1;
  return vector1;
}

//一般用于addEventListener和removeEventListener时绑定this用，
function bindThis(callBack, that) {

  if(!that._tempEvent) that._tempEvent = [];
  if(!that._tempEventBind) that._tempEventBind = [];


  let index = that._tempEvent.indexOf(callBack);
  let currentCallBackBinde = null
  if ( index === - 1 ) {
    currentCallBackBinde = callBack.bind(that)
    that._tempEvent.push(callBack);
    that._tempEventBind.push(currentCallBackBinde);
  } else {
    currentCallBackBinde = that._tempEventBind[index];
  }

  return currentCallBackBinde;
}

//保留小数位
function retainDecimals( num, decimals ){
  let currentDecimals = Math.pow( 10, decimals );
  return parseInt( num * currentDecimals ) / currentDecimals;
}

function angleToRad (angle) {
  return angle * (Math.PI / 180);
}

function defineProperty(object, property, callBack ) {
  var otheValue = object[property]
  Object.defineProperty(object, property, {
    get: () => {
        return otheValue;
    },
    set: (newVal) => {
      
      otheValue = newVal
      callBack()
    }
  });

}

export {
    createElement,
    getElementWidth,
    getElementHeight,
    setDefault,
    toScreenPosition,
    getNodeBox,
    bindThis,
    retainDecimals,
    angleToRad,
    getLengthXYZ,
    defineProperty
}