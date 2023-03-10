"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResource = exports.isFetching = exports.maybeResourceData = exports.fromMaybeResourceData = void 0;
const maybe_1 = require("@freckle/maybe");
const exhaustive_1 = require("@freckle/exhaustive");
function fromMaybeResourceData(resource, defaultData) {
    var _a;
    return (_a = maybeResourceData(resource)) !== null && _a !== void 0 ? _a : defaultData;
}
exports.fromMaybeResourceData = fromMaybeResourceData;
function maybeResourceData(resource) {
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
            return (0, exhaustive_1.exhaustive)(resource);
    }
}
exports.maybeResourceData = maybeResourceData;
function isFetching(resource) {
    return resource.status === 'loading' || resource.status === 'reloading';
}
exports.isFetching = isFetching;
const updateResource = (resource, update) => {
    const mData = maybeResourceData(resource);
    return (0, maybe_1.maybe)(() => resource, data => ({
        status: 'complete',
        data: update(data),
        hasUpdated: false // This is used for async updates, e.g. from a fetch response
    }), mData);
};
exports.updateResource = updateResource;
