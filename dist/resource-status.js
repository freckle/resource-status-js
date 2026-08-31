import { maybe } from '@freckle/maybe';
import { exhaustive } from '@freckle/exhaustive';
export function fromMaybeResourceData(resource, defaultData) {
    return maybeResourceData(resource) ?? defaultData;
}
export function maybeResourceData(resource) {
    switch (resource.status) {
        case 'idle':
            return null;
        case 'loading':
            return null;
        case 'reloading':
            return resource.data;
        case 'error':
            return null;
        case 'complete':
            return resource.data;
        case 'updating':
            return resource.data;
        case 'updating-error':
            return resource.data;
        default:
            return exhaustive(resource);
    }
}
export function isFetching(resource) {
    return resource.status === 'loading' || resource.status === 'reloading';
}
export const updateResource = (resource, update) => {
    const mData = maybeResourceData(resource);
    return maybe(() => resource, data => ({
        status: 'complete',
        data: update(data),
        hasUpdated: false // This is used for async updates, e.g. from a fetch response
    }), mData);
};
