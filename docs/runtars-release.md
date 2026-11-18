# RunTars release addresses

RunTars v0.1.0 shipped the website, web application, and Compose server. Subsequent stable
releases built with this workflow also distribute Windows and Android clients on GitHub Releases.

The individual operator of the RunTars website and hosted application uses the public name RunTars Lab. Hosted
registration is limited to the operator's approved email addresses.

## Public addresses

| Purpose                      | Address                                                                 |
| ---------------------------- | ----------------------------------------------------------------------- |
| Website                      | https://runtars.com                                                     |
| Website alias                | https://www.runtars.com redirects to the apex, retaining path and query |
| Application                  | https://app.runtars.com                                                 |
| Support and security reports | support@runtars.com                                                     |
| System sender                | RunTars &lt;no-reply@notify.runtars.com&gt;                             |
| System reply address         | support@runtars.com                                                     |
| Source                       | https://github.com/lovelybowen/runtars                                  |
| Issues                       | https://github.com/lovelybowen/runtars/issues                           |
| Releases                     | https://github.com/lovelybowen/runtars/releases                         |
| Installation guide           | https://runtars.com/self-hosted-ai-agent/                               |
| Full installation reference  | https://github.com/lovelybowen/runtars/blob/main/docs/self-host.md      |

For the RunTars hosted deployment only, configure these existing settings outside the repository:

```dotenv
RAKAZO_HOST=app.runtars.com
BETTER_AUTH_URL=https://app.runtars.com
WEB_ORIGIN=https://app.runtars.com
EMAIL_FROM="RunTars <no-reply@notify.runtars.com>"
EMAIL_REPLY_TO=support@runtars.com
PRIVACY_POLICY_URL=https://runtars.com/privacy/
SIGNUPS_ENABLED=true
SIGNUP_ALLOWLIST=approved-user@example.invalid
MESSAGING_OPEN_SIGNUP=false
OIDC_ALLOW_SIGNUP_BYPASS=false
```

Keep credentials in the deployment's secret configuration. Configure the email provider separately.
Self-hosters use their own origins, sender, and privacy policy; the local examples retain loopback
defaults. `API_URL` depends on the selected deployment topology and is not a second public domain.

Replace the example allowlist with the approved addresses in the private deployment
configuration. The release rehearsal uses the existing Stripe sandbox and its matching
webhook secret. Verify the public billing capability and that an unlisted email is refused.

## Installation and updates

| Image                                  | Purpose                         |
| -------------------------------------- | ------------------------------- |
| `ghcr.io/lovelybowen/runtars/app`      | API, worker, web and supervisor |
| `ghcr.io/lovelybowen/runtars/computer` | Docker bot computers            |
| `ghcr.io/lovelybowen/runtars/updater`  | Optional update sidecar         |

Production installs pin a published `vX.Y.Z` tag for both app and computer, with the installer and
Compose files taken from that tag. `vX.Y.Z` in setup examples is a placeholder, not an available
release. Development installs can explicitly use `edge` from `main`.

The official update source is the RunTars repository alone. Its stable Git tags resolve to full
`sha-<commit>` application images. Prereleases are skipped. The existing updater retains its
cached-image rollback and does not replace itself; upgrade the updater deliberately. See
[upgrading](./self-host-upgrading.md) for the deployment-specific commands and limits.

## Windows and Android release assets

After merging the version notes at `docs/releases/vX.Y.Z.md` and passing main CI, tag that commit
`vX.Y.Z`. The tag builds all three images, a signed x64 NSIS installer (`RunTars-Setup-X.Y.Z.exe`)
and a signed universal APK (`RunTars-X.Y.Z.apk`). Both clients default to the RunTars hosted
application. The GitHub Release includes both installers and
`SHA256SUMS`. Check the downloaded assets with `sha256sum -c SHA256SUMS` from their directory.

To build just the APK, push a dedicated tag such as `v0.1.0-android.1`. The **Build RunTars
Android APK** workflow retains the signed APK as a run artifact for seven days. The stable
`vX.Y.Z` tag is the separate trigger for publishing the GitHub Release.

Configure signing before tagging:

- **Windows** uses a fixed self-signed certificate. Store the base64 PFX and its password as
  `WINDOWS_RELEASE_PFX` and `WINDOWS_RELEASE_PFX_PASSWORD` in the tag-restricted
  `windows-release` environment. The workflow checks the certificate SHA-256 fingerprint,
  Authenticode signatures and timestamps. SmartScreen may warn on download and managed devices
  may block installation. Install a newer EXE manually to upgrade. A tag such as
  `v0.1.1-windows.1` rehearses the same installer build and retains an Actions artifact.
- **Android** uses the `android-release` environment. Set `ANDROID_KEYSTORE_BASE64` to the
  base64-encoded release keystore and set `ANDROID_KEY_ALIAS`, `ANDROID_KEYSTORE_PASSWORD`
  and `ANDROID_KEY_PASSWORD`. Keep an independent secure backup of the key. Installs of
  `com.runtars.app` upgrade by installing a newer APK signed with the same key. The tag sets the
  visible version. Both build paths use UTC seconds since 2020-01-01 for Android’s version code.

The APK uses embedded JavaScript and manual APK updates. This distribution has no Expo project
or Firebase push credentials, so push notifications and background incoming-call alerts are
unavailable. Android passkeys require a domain association for the RunTars package and its
signing certificate. The existing server association targets the upstream Android package.

## Retained upstream services

The website’s native download buttons, fallback links and mobile store links still lead to
Rakazo. Get the RunTars Windows installer and APK from the versioned GitHub Release. Social links,
affiliate links, plugin submissions, integration claims,
and the integration catalog also retain their upstream targets. These are separate from the
RunTars application and source links. Upstream publisher attribution and historical evidence remain
upstream attribution, not RunTars operating claims.

Verify both HTML and Markdown versions of the privacy policy and terms on the public domain.
Review the test-mode billing disclosure before enabling live payments.

The separate Kubernetes recipe still contains explicitly pinned upstream image digests. It is not
the first-release installation path; do not relabel those digests as RunTars images without a
separate build and validation. Historical benchmark records also retain their tested upstream images.

## Release verification

- Review the versioned notes in `docs/releases/vX.Y.Z.md` and link them from the changelog.
  Verify both clients install and connect to the intended server on real devices. On the next
  release, check a Windows update and an Android APK upgrade over the previous installation.
- Confirm Actions and package publication are enabled, then verify all three image manifests and
  public pulls for the intended architectures before advertising the release.
- Configure and verify DNS, HTTPS, the website alias redirect, and the application reverse proxy.
- Verify the notification sending domain and the selected mail provider's DNS records, delivery,
  and reply routing. Verify support receives security reports.
- Update enabled sign-in providers' callback registrations and validate sign-in and recovery links
  against the application origin. Changing a source URL does not update a provider's dashboard.
- Verify the release in a disposable
  deployment, including health, version, upgrade, and rollback, before production rollout.

This checklist records work still required at release time. Address changes alone do not establish
DNS, mail delivery, published images, native compatibility, or production acceptance.
