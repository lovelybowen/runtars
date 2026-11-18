# RunTars release addresses

The first release covers the website, web application, and Compose self-hosted server. Native downloads
continue to use the upstream Rakazo distribution. Internal package names, environment variable
names, protocols, database names, and native application identities remain unchanged.

The individual operator of the RunTars website and hosted application uses the public name RunTars Lab. Hosted
registration is limited to the operator's approved email addresses.

## Public addresses

| Purpose | Address |
| --- | --- |
| Website | https://runtars.com |
| Website alias | https://www.runtars.com redirects to the apex, retaining path and query |
| Application | https://app.runtars.com |
| Support and security reports | support@runtars.com |
| System sender | RunTars &lt;no-reply@notify.runtars.com&gt; |
| System reply address | support@runtars.com |
| Source | https://github.com/lovelybowen/runtars |
| Issues | https://github.com/lovelybowen/runtars/issues |
| Releases | https://github.com/lovelybowen/runtars/releases |
| Installation guide | https://runtars.com/self-hosted-ai-agent/ |
| Full installation reference | https://github.com/lovelybowen/runtars/blob/main/docs/self-host.md |

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

| Image | Purpose |
| --- | --- |
| `ghcr.io/lovelybowen/runtars/app` | API, worker, web and supervisor |
| `ghcr.io/lovelybowen/runtars/computer` | Docker bot computers |
| `ghcr.io/lovelybowen/runtars/updater` | Optional update sidecar |

Production installs pin a published `vX.Y.Z` tag for both app and computer, with the installer and
Compose files taken from that tag. `vX.Y.Z` in setup examples is a placeholder, not an available
release. Development installs can explicitly use `edge` from `main`.

The official update source is the RunTars repository alone. Its stable Git tags resolve to full
`sha-<commit>` application images. Prereleases are skipped. The existing updater retains its
cached-image rollback and does not replace itself; upgrade the updater deliberately. See
[upgrading](./self-host-upgrading.md) for the deployment-specific commands and limits.

## Retained upstream services

Desktop downloads, their failure fallback, mobile stores and APKs still point to Rakazo. Native
update feeds are unchanged. Social links, affiliate links, plugin submissions, integration claims,
and the integration catalog also retain their upstream targets. These are separate from the
RunTars application and source links. Upstream publisher attribution and historical evidence remain
upstream attribution, not RunTars operating claims.

Verify both HTML and Markdown versions of the privacy policy and terms on the public domain.
Review the test-mode billing disclosure before enabling live payments.

The separate Kubernetes recipe still contains explicitly pinned upstream image digests. It is not
the first-release installation path; do not relabel those digests as RunTars images without a
separate build and validation. Historical benchmark records also retain their tested upstream images.

## Before the first release

- Choose the first RunTars version and prepare its release notes separately. Do not reuse an
  upstream tag or publish upstream history as RunTars releases.
- Adjust the release workflow before pushing a `v*` tag: the inherited tag currently starts
  `release-desktop`, and GitHub release creation is part of that workflow. The server-only release
  needs its own release-note publication without requiring desktop signing or producing installers.
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
