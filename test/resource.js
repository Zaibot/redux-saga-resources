const assert = require('assert');
const {
  createResource
} = require('../es6');

describe('resource', () => {
  describe('create', () => {
    it('should return an instance', () => {
      assert(createResource('test', {}));
    })
    it('should require a name', () => {
      assert.throws(() => createResource('', {}));
    })
    it('should require options', () => {
      assert.throws(() => createResource('test'));
    })
  })
  describe('instance', () => {
    const resource = createResource('test', {});
    it('should have a name', () => {
      assert(resource.name);
    })
    it('should have options', () => {
      assert(resource.options);
    })
    it('should have actions', () => {
      assert(resource.actions);
    })
    it('should have actions.all', () => {
      assert(resource.actions.all);
    })
    it('should have creators', () => {
      assert(resource.creators);
    })
    it('should have fields', () => {
      assert(resource.fields);
    })
    it('should have selectors', () => {
      assert(resource.selectors);
    })
  })
})