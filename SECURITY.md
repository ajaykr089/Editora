# Security policy

## Supported versions

Security fixes go into the latest release of each `@editora/*` package. Please update to the latest version
before reporting, and say which version you tested.

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Report it privately through GitHub:
[**Report a vulnerability**](https://github.com/ajaykr089/Editora/security/advisories/new)

Include what you found, how to reproduce it (a minimal HTML snippet or a StackBlitz is ideal), the affected
package and version, and what an attacker could do with it.

What to expect: an acknowledgement within a few days, a fix or a decision as soon as it has been looked at, and
credit in the release notes if you want it. Please give a reasonable time to fix the problem before you disclose
it publicly.

## What counts

Editora is an editor that handles untrusted HTML (paste, import, stored content). Reports about cross-site
scripting through the editor's content handling, sanitiser bypasses, unsafe defaults, and supply-chain problems in
the published packages are in scope. The sanitiser options are described in the
[security section of the README](README.md#-security).
