# Upstream synchronization

RunTars retains the upstream Git history. Upstream release tags use the
`rakazo/` namespace; RunTars releases use their own version tags. A synchronization
PR must use a merge commit so the upstream commit remains an ancestor of `main`.
Source synchronization does not publish a release or deploy the application.

## Initial baseline

- Upstream release: `v0.11.0`.
- Saved tag: `rakazo/v0.11.0`.
- Commit: `ef5c3dd97f83f9b92d1dffcb6cb22cc09f5e2d76`.

## v0.12.0 synchronization

- Source: [Rakazo v0.12.0](https://github.com/elie222/rakazo/releases/tag/v0.12.0).
- Saved tag: `rakazo/v0.12.0`.
- Commit: `8b3dcd596dedc63021d98373107ab06665b0ad41`.
- Previous complete baseline: `v0.11.0`, as recorded above.
- Scope: all 492 upstream commits since the previous baseline, including code,
  dependencies, migrations, translations, release notes and workflow changes.
- Integration: no RunTars-specific commits existed at the previous baseline;
  the merge has no conflicts. Upstream files are preserved exactly. This record
  is the only additional file.

This record takes effect on the product mainline when its synchronization PR is
merged. Confirm ancestry with:

```bash
git merge-base --is-ancestor 8b3dcd596dedc63021d98373107ab06665b0ad41 origin/main
```

### Upgrade considerations

The release includes organization membership, conversation memory, vault access
controls, per-model settings, and security and reliability fixes across web,
desktop and mobile. Read the
[self-host upgrade notes](../../CHANGELOG.md#self-host-upgrade-notes) before deploying.

- There are 41 added SQL migrations, including deferred removals. No migrations
  were executed during source synchronization.
- Upgrade API and workers together before depending on per-model settings.
  Upgrade the server before the desktop client for single-use screen sign-in.
- Bot sending now requires `BOT_EMAIL_SMTP_URL` on API and workers. Drain old
  workers before enabling the new recipient policy.
- Stop old API and workers before explicitly migrating vault content encryption;
  old releases cannot read migrated vault items. Restricted vault access also
  requires the documented runtime database role.
- Database timezone defaults move to UTC. Existing sessions must reconnect, and
  operators must check role-level overrides and database-owner permissions.
- Inherited deployment and release identities still require a separate RunTars
  configuration review. GitHub Actions was disabled when this sync was prepared
  and was left disabled.

### Verification boundary

The merge's upstream files match the pinned release and the staged whitespace
check passes. With Node 24.22.3, the repository convention checks (the command
behind `pnpm checks`), package-manager wrapper tests and worktree setup tests
passed: 115 passing tests and one Windows-only test skipped. The default Node 22
runtime could not execute all checks; verification used a temporary Node 24
runtime without changing the system installation.

Application unit tests, typechecks, builds, database upgrade tests and UI flows
were not run locally. The checkout has no installed workspace dependencies.
No CI screenshots are available because RunTars Actions is disabled.

Upstream evidence is separate from RunTars acceptance: release artifacts,
lint/typecheck and Postgres journeys passed on the release commit, but the
upstream aggregate check failed after unit-test shards were cancelled. This is
not a fully green upstream test run and does not establish deployment readiness.
