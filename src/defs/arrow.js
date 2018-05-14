/**
 * Created by Elaine on 2018/5/11.
 */
const Util = require('../util/index');

const DEFAULT_PATH = {
  'marker-start': 'M0 2 L6.445174776667712 0 L 6.445174776667712 4z',
  'marker-end': 'M 0 0 L 6.445174776667712 2 L 0 4 z',
};

function setDefaultPath (parent, name, stroke) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  el.setAttribute('d', DEFAULT_PATH[name]);
  el.setAttribute('stroke', 'none');
  el.setAttribute('fill', stroke || '#000');
  parent.appendChild(el);
  parent.setAttribute('refX', 3.22);
  parent.setAttribute('refY', 2);
  parent.setAttribute('markerWidth', 20);
  parent.setAttribute('markerHeight', 20);
  parent.setAttribute('orient', 'auto');
  return el;
}

function setMarker(cfg, parent, name, stroke) {
  const shape = cfg.shape;
  if (!shape) {
    return setDefaultPath(parent, name);
  }
  if (shape.type !== 'marker') {
    throw "the shape of an arrow should be an instance of Marker";
  }
  shape.attr({ stroke: 'none', fill: stroke });
  parent.append(shape.get('el'));
  const width = shape.__attrs.x;
  const height = shape.__attrs.y;
  parent.setAttribute('refX', width);
  parent.setAttribute('refY', height);
  parent.setAttribute('markerWidth', width * 2);
  parent.setAttribute('markerHeight', height * 2);
  parent.setAttribute('orient', 'auto');
  return shape;
}

const Arrow = function(name, cfg, stroke) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  const id = Util.uniqueId('marker' + '_');
  el.setAttribute('id', id);
  this.__cfg = { el, id, stroke: stroke || '#000' };
  this.__cfg[name] = true;
  let child = null;
  if (typeof cfg === 'boolean' && cfg) {
    child = setDefaultPath(el, name, stroke);
    this._setChild(child, true);
  } else if(typeof cfg=== 'object') {
    child = setMarker(cfg, el, name, stroke);
    this._setChild(child, false);
  }
  this.__attrs = { config: cfg };
  return this;
};

Util.augment(Arrow, {
  type: 'arrow',
  match(type, attr) {
    if(type !== this.type) {
      return false;
    }
    if (!this.__cfg[name]) {
      return false;
    }
    if (attr.stroke !== '#000') {
      return false;
    }
    if (typeof attr === 'boolean' && !this.__cfg.default) {
      return false;
    }
    return true;
  },
  _setChild(child, isDefault) {
    this.__cfg.child = child;
    this.__cfg.default = isDefault;
  },
  update(fill) {
    const child = this.__cfg.child;
    if (child.attr) {
      child.attr('fill', fill);
    } else {
      child.setAttribute('fill', fill);
    }
  },
});

module.exports = Arrow;