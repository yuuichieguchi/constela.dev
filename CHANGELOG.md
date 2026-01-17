# Changelog

All notable changes to Constela packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.9.0] - 2026-01-17

### Added

- **WebSocket Connections**: Real-time bidirectional communication support
  - `connections` property in DSL root schema
  - Event handlers: `onMessage`, `onOpen`, `onClose`, `onError`
  - `send` action step for sending messages
  - `close` action step for disconnecting
  - Dynamic URL support
  - `TypedStateStore` integration for advanced use cases

- **setPath Action Step**: Surgical updates to nested state
  - Update specific fields within array items without replacing the entire item
  - More efficient than `replaceAt` for partial updates

- **Key-based List Reconciliation**: Improved `each` node performance
  - Stable identity for list items via `key` property
  - Minimized DOM operations through intelligent diffing
  - Preserved input state and focus across list updates

### Changed

- @constela/compiler: ^0.8.0 → ^0.9.0
- @constela/core: ^0.8.0 → ^0.9.0
- @constela/router: ^9.0.0 → ^10.0.0
- @constela/runtime: ^0.11.1 → ^0.12.0
- @constela/server: ^4.1.0 → ^5.0.0
- @constela/start: ^1.3.0 → ^1.3.1

## [@constela/server v4.1.0] - 2025-01-15

### Added

- Add `styles` option to `renderToString` for SSR style evaluation
- Style presets are now evaluated server-side, outputting resolved CSS class strings
