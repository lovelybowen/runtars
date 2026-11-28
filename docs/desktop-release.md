# Desktop releases

Stable RunTars tags publish the Windows installer alongside the Android APK and server images.
See [RunTars releases](./runtars-release.md#windows-and-android-release-assets) for that workflow.
The separate manual `release-desktop` workflow handles the multi-platform Electron distribution.

## Repository secrets

macOS (required):

| Secret                         | Value                                                                      |
| ------------------------------ | -------------------------------------------------------------------------- |
| `DESKTOP_MAC_CSC_LINK`         | Base64 of the `Developer ID Application` certificate exported as `.p12`    |
| `DESKTOP_MAC_CSC_KEY_PASSWORD` | Password used when exporting the `.p12`                                    |
| `APPLE_API_KEY_ID`             | App Store Connect API key ID (the `XXXXXXXXXX` in `AuthKey_XXXXXXXXXX.p8`) |
| `APPLE_API_ISSUER`             | Issuer ID shown on App Store Connect > Users and Access > Integrations     |
| `APPLE_API_KEY_P8`             | Contents of the `AuthKey_*.p8` file                                        |

The API key needs the Developer role. The workflow writes it to a mode 600 file
in the runner's temp directory for the packaging step and deletes it afterwards.

The manual multi-platform workflow signs Windows through Azure Artifact Signing once it is configured, logging in
with GitHub OIDC instead of a stored secret. Create a Public Trust certificate
profile, then an app registration with the Artifact Signing Certificate Profile
Signer role on the signing account, and a `desktop-release` environment in the
repository settings. Give the app registration a federated credential whose
subject is exactly the one printed under "Federated token details" in the
release's Azure login step. This repository's OIDC subject includes owner and
repository IDs, so the plain `repo:<owner>/<repo>:environment:desktop-release`
form does not match.

| Secret                        | Value                                           |
| ----------------------------- | ----------------------------------------------- |
| `DESKTOP_WIN_AZURE_TENANT_ID` | Directory (tenant) ID of the app registration   |
| `DESKTOP_WIN_AZURE_CLIENT_ID` | Application (client) ID of the app registration |

| Variable                       | Value                                                                   |
| ------------------------------ | ----------------------------------------------------------------------- |
| `DESKTOP_WIN_SIGNING_ENDPOINT` | The signing account's URI, such as `https://eus.codesigning.azure.net/` |
| `DESKTOP_WIN_SIGNING_ACCOUNT`  | The signing account name                                                |
| `DESKTOP_WIN_SIGNING_PROFILE`  | The certificate profile name                                            |
| `DESKTOP_WIN_PUBLISHER`        | The certificate's common name, exactly as validated                     |

Missing Windows signing credentials stop the build. Each Windows release checks the installer
and the packaged application signatures, their timestamps and the update feed publisher.

Set a secret from a file without echoing it:

```sh
base64 -i devid.p12 | gh secret set DESKTOP_MAC_CSC_LINK
gh secret set APPLE_API_KEY_P8 < AuthKey_XXXXXXXXXX.p8
```

## Cut a release

Follow `.agents/skills/release/SKILL.md`: one release PR writes the
`CHANGELOG.md` section from the pull requests merged since the last tag and
bumps `version` in `apps/desktop/package.json`. Once it merges, tag the merge
commit `v<version>` and push the tag.

The workflow refuses tags that do not match the desktop version, have no
matching changelog section, are not on `main`, or are not newer than the latest
published release. The release text is that changelog section followed by the
merged pull requests.

## Apple silicon server bundle

The macOS job also builds `rakazo-server-darwin-arm64-<version>.tar.xz` with
`scripts/build-server-bundle.mjs` and publishes it as an asset of the same
release. It holds the API, worker, web server and migrations with their
production dependencies, so This computer can run them without Docker. The app
does not include it; it ships only `server-bundle.json` in its resources, with
the asset's `url`, `sha256`, `size` and `version`, and downloads the bundle when
someone picks This computer. Builds without that file, such as local packaging,
have no bundle to download. The release also publishes that `server-bundle.json`
as an asset, so the previous version can fetch the next bundle as soon as it has
downloaded the update.
