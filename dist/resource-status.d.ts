export type ResourceStatusT<R> = {
    status: 'idle';
} | {
    status: 'loading';
} | {
    status: 'reloading';
    data: R;
} | {
    status: 'error';
    error: unknown;
} | {
    status: 'complete';
    data: R;
    hasUpdated: boolean;
} | {
    status: 'updating';
    data: R;
} | {
    status: 'updating-error';
    data: R;
    error: unknown;
};
export declare function fromMaybeResourceData<R>(resource: ResourceStatusT<R>, defaultData: R): R;
export declare function maybeResourceData<R>(resource: ResourceStatusT<R>): R | undefined | null;
export declare function isFetching<R>(resource: ResourceStatusT<R>): boolean;
export declare const updateResource: <R>(resource: ResourceStatusT<R>, update: (data: R) => R) => ResourceStatusT<R>;
