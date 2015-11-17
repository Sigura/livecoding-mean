'use strict';

const objectAssign    = require('object-assign');

const extensions = {
    valueLinkBuilder (paramName) {
        return {
            value: this.state[paramName],
            requestChange: (val) => this.handleChange({
                target: {
                    name: paramName,
                    value: val
                }
            })
        };
    },

    classSet (obj) {
        let result = Object.keys(obj)
            .filter(key => obj[key])
            .join(' ');

        return result;
    },

    l10n (messageName) {
      return this.context.messages[messageName];
    }

};


export default function(obj) {
  objectAssign(obj.prototype, extensions);
}
