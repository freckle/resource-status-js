import {
  type ResourceStatusT,
  maybeResourceData,
  fromMaybeResourceData,
  isFetching,
  updateResource
} from '.'

type TestData = 'foo' | 'bar' | 'baz'
type TestResource = ResourceStatusT<TestData>

describe('resource-status', () => {
  // Create test resources
  const idle = {status: 'idle'} as TestResource
  const loading = {status: 'loading'} as TestResource
  const reloading = {status: 'reloading', data: 'bar'} as TestResource
  const error = {status: 'error', error: 'Could not fetch'} as TestResource
  const complete = {status: 'complete', data: 'foo', hasUpdated: false} as TestResource
  const updating = {status: 'updating', data: 'foo'} as TestResource
  const updatingError = {
    status: 'updating-error',
    data: 'foo',
    error: 'Could not update'
  } as TestResource

  describe('maybeResourceData', () => {
    it('should return null for idle resource', () => {
      const result = maybeResourceData(idle)
      expect(result).toBeNull
    })
    it('should return null for loading resource', () => {
      const result = maybeResourceData(loading)
      expect(result).toBeNull
    })
    it('should return data for reloading resource', () => {
      const result = maybeResourceData(reloading)
      expect(result).toEqual('bar')
    })
    it('should return null for error resource', () => {
      const result = maybeResourceData(error)
      expect(result).toBeNull
    })
    it('should return data for complete resource', () => {
      const result = maybeResourceData(complete)
      expect(result).toEqual('foo')
    })
    it('should return data for updating resource', () => {
      const result = maybeResourceData(updating)
      expect(result).toEqual('foo')
    })
    it('should return data for updating-error resource', () => {
      const result = maybeResourceData(updatingError)
      expect(result).toEqual('foo')
    })
  })

  describe('fromMaybeResourceData', () => {
    it('should return data resources with data', () => {
      const result = fromMaybeResourceData(complete, 'baz')
      expect(result).toEqual('foo')
    })
    it('should return default for resources without data', () => {
      const result = fromMaybeResourceData(error, 'baz')
      expect(result).toEqual('baz')
    })
  })

  describe('isFetching', () => {
    it('should be false for idle resource', () => {
      const result = isFetching(idle)
      expect(result).toEqual(false)
    })
    it('should be true for loading resource', () => {
      const result = isFetching(loading)
      expect(result).toEqual(true)
    })
    it('should be true for reloading resource', () => {
      const result = isFetching(reloading)
      expect(result).toEqual(true)
    })
    it('should be false for error resource', () => {
      const result = isFetching(error)
      expect(result).toEqual(false)
    })
    it('should be false for complete resource', () => {
      const result = isFetching(complete)
      expect(result).toEqual(false)
    })
    it('should be false for updating resource', () => {
      const result = isFetching(updating)
      expect(result).toEqual(false)
    })
    it('should be false for updating-error resource', () => {
      const result = isFetching(updatingError)
      expect(result).toEqual(false)
    })
  })

  describe('updateResource', () => {
    it('should not call update and return resource for resource with no data ', () => {
      const updateFn = jest.fn()
      const result = updateResource(idle, updateFn)
      expect(result).toEqual(idle)
      expect(updateFn).not.toHaveBeenCalled()
    })
    it('should update for resource with data', () => {
      const updateFn = () => 'baz'
      const result = updateResource(complete, updateFn)
      expect(result).toEqual({status: 'complete', data: 'baz', hasUpdated: false})
    })
  })
})
