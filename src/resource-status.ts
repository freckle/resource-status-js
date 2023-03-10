import {maybe} from '@freckle/maybe'
import {exhaustive} from '@freckle/exhaustive'

export type ResourceStatusT<R> =
  | {
      status: 'idle'
    }
  | {
      status: 'loading'
    }
  | {
      status: 'reloading'
      data: R
    }
  | {
      status: 'error'
      error: unknown
    }
  | {
      status: 'complete'
      data: R
      hasUpdated: boolean
    }
  | {
      status: 'updating'
      data: R
    }
  | {
      status: 'updating-error'
      data: R
      error: unknown
    }

export function fromMaybeResourceData<R>(resource: ResourceStatusT<R>, defaultData: R): R {
  return maybeResourceData(resource) ?? defaultData
}

export function maybeResourceData<R>(resource: ResourceStatusT<R>): R | undefined | null {
  switch (resource.status) {
    case 'idle':
      return null
    case 'loading':
      return null
    case 'reloading':
      return resource.data
    case 'error':
      return null
    case 'complete':
      return resource.data
    case 'updating':
      return resource.data
    case 'updating-error':
      return resource.data
    default:
      return exhaustive(resource)
  }
}

export function isFetching<R>(resource: ResourceStatusT<R>): boolean {
  return resource.status === 'loading' || resource.status === 'reloading'
}

export const updateResource = <R>(
  resource: ResourceStatusT<R>,
  update: (data: R) => R
): ResourceStatusT<R> => {
  const mData = maybeResourceData(resource)
  return maybe(
    () => resource,
    data => ({
      status: 'complete',
      data: update(data),
      hasUpdated: false // This is used for async updates, e.g. from a fetch response
    }),
    mData
  )
}
