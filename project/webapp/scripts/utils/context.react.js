'use strict';

import React        from 'react'
import objectAssign from 'object-assign'
import resources    from '../constants/resources.react'

const context = {
  getChildContext() {
    return $.extend({}, this.context, resources);
  },
  childContextTypes: {
    router: React.PropTypes.func,
    locales: React.PropTypes.string,
    messages: React.PropTypes.object,
    formats: React.PropTypes.object,
    lang: React.PropTypes.string
  },
  contextTypes: {
    router: React.PropTypes.func,
    locales: React.PropTypes.string,
    messages: React.PropTypes.object,
    formats: React.PropTypes.object,
    lang: React.PropTypes.string
  }
};


export default function(obj) {
  obj.childContextTypes = context.childContextTypes;
  obj.contextTypes = context.contextTypes;

  obj.prototype.getChildContext = context.getChildContext;
}
