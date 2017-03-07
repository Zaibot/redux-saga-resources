const assert = require('assert');
const {
  createResource,
  createEditor
} = require('../node');

describe('resource', () => {
  describe('create', () => {
    it('should return an instance', () => {
      assert(createEditor('test', {}, createResource('test', {})));
    })
    it('should require a name', () => {
      assert.throws(() => createEditor('', {}, createResource('test', {})));
    })
    it('should require options', () => {
      assert.throws(() => createEditor('test', undefined, createResource('test', {})));
    })
    it('should require a resource', () => {
      assert.throws(() => createEditor('', {}));
    })
  })

  describe('instance', () => {
    const resource = createResource('test', {});
    const editor = createEditor('test', {}, resource);
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
    it('should have creators', () => {
      assert(editor.creators);
    })
    it('should have selectors', () => {
      assert(editor.selectors);
    })
  })
})