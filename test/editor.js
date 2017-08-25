const assert = require('assert');
const {
  createResource,
  createEditor
} = require('../node');

describe('editor', () => {
  describe('create', () => {
    it('should return an instance', () => {
      assert(createEditor('editor.create', {}, createResource('editor.create', {})));
    })
    it('should require a name', () => {
      assert.throws(() => createEditor('', {}, createResource('editor.name', {})));
    })
    it('should require options', () => {
      assert.throws(() => createEditor('editor.options', undefined, createResource('editor.options', {})));
    })
    it('should require a resource', () => {
      assert.throws(() => createEditor('', {}));
    })
  })

  describe('instance', () => {
    const resource = createResource('editor.instance', {});
    const editor = createEditor('editor.instance', {}, resource);
    it('should have a name', () => {
      assert(editor.name);
    })
    it('should have options', () => {
      assert(editor.options);
    })
    it('should have actions', () => {
      assert(editor.actions);
    })
    it('should have actions.all', () => {
      assert(editor.actions.all);
    })
    it('should have selectors', () => {
      assert(editor.selectors);
    })
  })
})