const assert = require('assert');
const {
  createResource
} = require('../node');

describe('resource', () => {
  describe('create', () => {
    it('should return an instance', () => {
      assert(createResource('resource.create', {}));
    })
    it('should require a name', () => {
      assert.throws(() => createResource('', {}));
    })
    it('should require options', () => {
      assert.throws(() => createResource('resource.create'));
    })
  })
  describe('instance', () => {
    const resource = createResource('resource.instance', {});
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
    it('should have fields', () => {
      assert(resource.fields);
    })
    it('should have selectors', () => {
      assert(resource.selectors);
    })
  })
})