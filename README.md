# Resource Status

Defines the `ResourceStatusT` type and utilities operating on this type.

## Install

```sh
pnpm add @freckle/resource-status
```

## Release

See [RELEASE.md](./RELEASE.md).

## Development

```sh
pnpm install
```

| Script             | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `pnpm build`       | Compiles `src/` to `dist/` via `tsconfig.build.json`      |
| `pnpm test`        | Runs the test suite                                       |
| `pnpm coverage`    | Runs the test suite with coverage, gated at 70%           |
| `pnpm typecheck`   | Type-checks `src/`, test files included, without emitting |
| `pnpm format`      | Rewrites `src/**/*.ts` with Prettier                      |
| `pnpm format-check`| Checks `src/**/*.ts` formatting without rewriting         |
| `pnpm lint`        | Runs ESLint                                               |
| `pnpm knip`        | Reports unused files, dependencies, and exports           |

`dist/` is committed. Run `pnpm build` before pushing; CI fails if it is stale.

## `ResourceStatusT<R>`

Wraps data from a resource `R` with metadata to describe the status of accessing
and updating the data. The `status` field can be used to react accordingly:

```ts
type Props = {resource: ResourceStatusT<{username: string}>}
const UserView = ({resource}: Props) => {
  switch (resource.status) {
    case 'idle':
      return <p>User has not been loaded</p>
    case 'loading':
      return <p>Loading user</p>
    case 'reloading':
      return <p>User: {resource.data.username} (reloading)</p>
    case 'error':
      return (
        <p>
          Error loading user: <pre>{JSON.stringify(resource.error)}</pre>
        </p>
      )
    case 'complete':
      return <p>User: {resource.data.username}</p>
    case 'updating':
      return <p>User: {resource.data.username} (pending update)</p>
    case 'updating-error':
      return (
        <p>
          Error updating user {resource.data.username}: <pre>{JSON.stringify(resource.error)}</pre>
        </p>
      )
    default:
      return exhaustive(resource)
  }
}
```

## Utilities

Utilities are defined to make operating on a resource status.

### `maybeResourceData(resource)`

Returns the underlying `resource.data` if it exists.

### `fromMaybeResourceData(resource, default)`

Returns the underlying `resource.data` if it exists, or `default` otherwise.

### `isFetching(resource)`

Returns `true` when a `resource` is loading or reloading.

### `updateResource(resource, updateFn)`

Performs `updateFn(resource.data)` if there exists data in the resource, and
returns a new `resource`. This is convenient for reducer-style updates:

```ts
type State = ResourceStatusT<{username: string; token: string}>
type Action =
  | {type: 'USER_UPDATE_REQUEST'}
  | {type: 'USER_UPDATE_RESPONSE'; data: {username: string}}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'USER_UPDATE_REQUEST':
    // ...
    case 'USER_UPDATE_RESPONSE':
      return updateResource(state, user => ({
        ...user,
        username: action.data.username
      }))
  }
}
```

---

[LICENSE](./LICENSE)
