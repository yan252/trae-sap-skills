# UI5 Linter - Contributing Guide

**Source**: [https://github.com/UI5/linter/blob/main/CONTRIBUTING.md](https://github.com/UI5/linter/blob/main/CONTRIBUTING.md)
**Last Updated**: 2025-11-21
**UI5 Linter Version**: 1.20.5

---

## Overview

This guide covers how to contribute to the UI5 Linter project, including reporting issues, requesting features, and submitting code changes. Following these guidelines ensures your contributions are processed efficiently.

---

## Before You Contribute

### Check Existing Work

**Search First**:
```bash
# Check if issue already exists
[https://github.com/UI5/linter/issues](https://github.com/UI5/linter/issues)

# Check the Task Board for related work
[https://github.com/orgs/SAP/projects/110](https://github.com/orgs/SAP/projects/110)
```

**Why**: Avoid duplicate reports and identify ongoing work that might address your needs.

---

## Reporting Issues

### When to Report Issues

**✅ Report Issues For**:
- Bugs in UI5 Linter functionality
- Problems with linting rules
- Autofix errors or unexpected behavior
- Documentation errors or gaps
- Feature requests for new rules or capabilities

**❌ DO NOT Report Issues For**:
- Problems with UI5 Linter dependencies (report to those projects)
- Issues with non-public UI5 APIs
- General UI5 questions (use community channels instead)
- Security vulnerabilities (follow security policy instead)

---

### Issue Reporting Standards

**Essential Requirements for Bug Reports**:

1. **Good Summary**
   - Be specific to the issue
   - Include what failed, not just "linter doesn't work"

   **Example**:
   ```
   ✅ Good: "no-globals rule fails to detect sap.ui.getCore() in arrow functions"
   ❌ Bad: "Linter broken"
   ```

2. **Reproducible Bug**
   - Provide step-by-step instructions
   - Include minimal code example
   - Specify exact commands run

   **Example**:
   ```markdown
   ## Steps to Reproduce
   1. Create file `test.js` with content:
      ```javascript
      const fn = () => sap.ui.getCore().byId("test");
      ```
   2. Run: `ui5lint test.js`
   3. Expected: Warning about global usage
   4. Actual: No warning shown
   ```

3. **Environment Details**
   - UI5 Linter version: `ui5lint --version`
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - Operating system: Windows 11, macOS 14, Ubuntu 22.04, etc.
   - UI5 version in your project

4. **Expected vs Actual Behavior**
   - What you expected to happen
   - What actually happened
   - Include error messages (full stack trace if applicable)

5. **Maximum Context**
   - Configuration file (ui5lint.config.js)
   - Relevant code snippets
   - Log output with `--verbose` flag

   **Example**:
   ```bash
   ui5lint --verbose test.js 2>&1 | tee debug.log
   ```

---

### Bug Report Template

Use the GitHub issue template or follow this format:

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- UI5 Linter version: 1.20.5
- Node.js version: 20.11.0
- npm version: 10.2.0
- OS: Ubuntu 22.04
- UI5 version: 1.120.0

## Configuration
```javascript
// ui5lint.config.mjs
export default {
  ignores: ["webapp/thirdparty/**"]
};
```

## Additional Context
- Verbose output attached
- Related to issue #123
```

---

### Issue Reporting Rules

**Critical Rules**:
- ✅ **One bug per report** - Open separate issues for different problems
- ✅ **English only** - All issues must be in English
- ✅ **Use template** - Follow the provided issue template
- ✅ **Search first** - Check for duplicates before reporting
- ❌ **No sensitive data** - Don't include credentials, tokens, or proprietary code

---

## Security Issues

**🔒 DO NOT create public GitHub issues for security vulnerabilities**

Instead:
1. Review the [Security Policy](https://github.com/UI5/linter/security/policy)
2. Report vulnerabilities through GitHub's private security advisory feature
3. Follow responsible disclosure practices

**Why**: Public disclosure puts users at risk before a fix is available.

---

## Feature Requests

### When to Request Features

**Good Feature Requests**:
- New linting rules for UI5 2.x compatibility
- Additional autofix capabilities
- New output formats
- Performance improvements
- Developer experience enhancements

**How to Request**:
1. Check [Task Board](https://github.com/orgs/SAP/projects/110) for existing work
2. Search [issues](https://github.com/UI5/linter/issues) for similar requests
3. Open issue with `Feature` label
4. Describe use case and expected behavior
5. Explain why this would benefit other users

**Feature Request Template**:
```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other approaches did you consider?

## Additional Context
- Screenshots, mockups, examples
- Related issues or RFCs
```

---

## Issue Labels

Understanding issue labels helps track and prioritize issues.

### Type Labels

| Label | Description |
|-------|-------------|
| **Bug** | Something isn't working correctly |
| **Feature** | New feature or enhancement request |

### UI5 Linter-Specific Labels

| Label | Description |
|-------|-------------|
| **detection** | Related to rule detection logic |
| **autofix** | Related to automatic fixing |
| **documentation** | Documentation improvements |
| **needs triage** | Issue needs review by maintainers |

### Status Labels (Open Issues)

| Label | Description |
|-------|-------------|
| **information required** | More details needed from reporter |
| **good first issue** | Suitable for new contributors |
| **help wanted** | Community contributions welcome |

### Status Labels (Closed Issues)

| Label | Description |
|-------|-------------|
| **duplicate** | Already reported elsewhere |
| **invalid** | Not a valid issue |
| **wontfix** | Won't be fixed/implemented |

---

## Code Contributions

### Contribution Process

**Step-by-Step Workflow**:

1. **Confirm Change is Welcome**
   ```bash
   # Check Task Board for related work
   [https://github.com/orgs/SAP/projects/110](https://github.com/orgs/SAP/projects/110)

   # Comment on related issue or create discussion
   ```

2. **Fork the Repository**
   ```bash
   # Fork via GitHub UI, then clone
   git clone [https://github.com/YOUR-USERNAME/linter.git](https://github.com/YOUR-USERNAME/linter.git)
   cd linter
   ```

3. **Create Branch**
   ```bash
   # Use descriptive branch name
   git checkout -b fix/no-globals-arrow-functions
   # or
   git checkout -b feat/new-rule-name
   ```

4. **Make Changes**
   ```bash
   # Follow development conventions
   # See docs/Guidelines.md and docs/Development.md

   # Run tests
   npm test

   # Run linter
   npm run lint
   ```

5. **Commit Changes**
   ```bash
   # Follow Conventional Commits format
   git commit -m "fix(no-globals): Detect globals in arrow functions

   - Add support for arrow function expressions
   - Update test fixtures
   - Add regression test for issue #123"
   ```

6. **Push Branch**
   ```bash
   git push origin fix/no-globals-arrow-functions
   ```

7. **Create Pull Request**
   - Use GitHub UI to create PR
   - Fill out PR template
   - Link related issues
   - Provide clear description

8. **Accept DCO**
   - CLA Assistant will prompt for Developer Certificate of Origin
   - Required for first-time contributors
   - Accept to proceed with PR

9. **Address Review Feedback**
   ```bash
   # Make requested changes
   git add .
   git commit -m "fix: Address review feedback"
   git push
   ```

10. **Merge**
    - Maintainers will merge approved PRs
    - Squash merge is typically used
    - Credit will be given in commit and release notes

---

### Development Conventions

**See Full Guides**:
- **Guidelines.md** - Coding standards, testing, git workflow
- **Development.md** - Setup, SAPUI5 types, autofix development

**Key Standards**:

**Code Style**:
```bash
# ESLint enforced
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

**Testing**:
```bash
# Run all tests (CI-style)
npm test

# Run unit tests once
npm run unit

# Run unit tests in watch mode
npm run unit-watch
```

**Git Workflow**:
```bash
# Use rebase, NOT merge
git fetch origin
git rebase origin/main

# NO merge commits
# Maintainers will squash on merge
```

**Commit Message Format**:
```
type(scope): Description

- Bullet point details
- Another detail

Fixes #123
```

**Types**: fix, feat, docs, style, refactor, test, chore

**Scope**: Rule name, component, or area affected

**Example**:
```
fix(xml-transpiler): Log unknown namespaces as verbose instead of warning

- Changes log level for unknown XML namespaces
- Reduces noise in common scenarios
- Aligns with UI5 best practices

Fixes #456
```

---

### Developer Certificate of Origin (DCO)

**What is DCO?**

The Developer Certificate of Origin is a lightweight alternative to traditional CLAs (Contributor License Agreements). It certifies that you have the right to submit your contribution.

**How to Accept**:
1. First PR triggers CLA Assistant
2. Click link and accept DCO terms
3. Terms follow [developercertificate.org](https://developercertificate.org/)
4. One-time acceptance covers all future PRs

**DCO Statement**:
> By submitting this pull request, I certify that my contribution is made under the terms of the Developer Certificate of Origin.

---

### AI-Generated Code

**Guidelines for AI-Assisted Contributions**:

If your contribution includes AI-generated code:
1. Follow SAP's [AI Code Contribution Guidelines](https://github.com/SAP/.github/blob/main/CONTRIBUTING_USING_GENAI.md)
2. Review and understand all AI-generated code
3. Ensure code meets project standards
4. Test thoroughly
5. Disclose AI assistance in PR description (optional but recommended)

**Important**:
- You are responsible for all submitted code, regardless of origin
- AI-generated code must pass all quality checks
- Maintainers may request clarification or changes

---

## RFC Process (Request for Comments)

**When to Write an RFC**:
- Major new features
- Breaking changes
- Architectural decisions
- Significant API changes

**RFC Template**:
[https://github.com/UI5/linter/blob/main/rfcs/0000-template.md](https://github.com/UI5/linter/blob/main/rfcs/0000-template.md)

**Process**:
1. Copy template to `rfcs/NNNN-my-feature.md`
2. Fill out all sections
3. Create PR with RFC
4. Discuss in PR comments
5. Iterate based on feedback
6. Final decision by maintainers

**Note**: Currently no active RFCs, but process is available for major proposals.

---

## Contribution Best Practices

### Before Submitting PR

**✅ Checklist**:
- [ ] Tests pass: `npm test`
- [ ] Linter passes: `npm run lint`
- [ ] Code follows guidelines
- [ ] Commit messages follow conventions
- [ ] Branch rebased on latest main
- [ ] No merge commits
- [ ] Related issue referenced
- [ ] PR template completed

### During Review

**✅ Good Practices**:
- Respond to feedback promptly
- Ask questions if review unclear
- Make requested changes quickly
- Be open to suggestions
- Keep discussion professional

**❌ Avoid**:
- Force pushing after review (unless requested)
- Adding unrelated changes
- Arguing without technical justification
- Ignoring review feedback

### After Merge

**✅ Follow Up**:
- Monitor for issues related to your change
- Be available to fix regressions
- Update documentation if needed
- Close related issues

---

## Common Contribution Scenarios

### Scenario 1: Fix a Bug

```bash
# 1. Find and confirm bug
ui5lint test.js --verbose

# 2. Create issue if not exists
# GitHub issue #789

# 3. Fork and branch
git clone [https://github.com/YOUR-USERNAME/linter.git](https://github.com/YOUR-USERNAME/linter.git)
git checkout -b fix/issue-789

# 4. Write failing test
# test/lib/rules/no-globals.js

# 5. Fix the bug
# src/linter/rules/no-globals.js

# 6. Verify test passes
npm run unit

# 7. Commit
git commit -m "fix(no-globals): Detect globals in arrow functions

- Add support for ArrowFunctionExpression
- Add test case for issue #789
- Update documentation

Fixes #789"

# 8. Push and create PR
git push origin fix/issue-789
```

---

### Scenario 2: Add New Rule

```bash
# 1. Create RFC or discussion first (for major rules)
# 2. Get approval from maintainers

# 3. Fork and branch
git checkout -b feat/new-rule-name

# 4. Implement rule
# src/linter/rules/new-rule-name.js

# 5. Add tests
# test/lib/rules/new-rule-name.js

# 6. Add documentation
# Update docs/Rules.md

# 7. Run full test suite
npm test

# 8. Commit
git commit -m "feat(rules): Add new-rule-name for detecting X

- Implements new rule to detect Y
- Adds comprehensive test coverage
- Documents rule in Rules.md

Implements #456"

# 9. Push and create PR
git push origin feat/new-rule-name
```

---

### Scenario 3: Improve Documentation

```bash
# 1. Identify documentation gap
# 2. Fork and branch
git checkout -b docs/improve-autofix-guide

# 3. Update documentation
# docs/Scope-of-Autofix.md

# 4. Commit
git commit -m "docs(autofix): Clarify limitations for Core APIs

- Add examples of unsupported APIs
- Link to GitHub issues #619, #620
- Improve troubleshooting section"

# 5. Push and create PR
git push origin docs/improve-autofix-guide
```

---

## Resources for Contributors

**Official Documentation**:
- [Development Guide](https://github.com/UI5/linter/blob/main/docs/Development.md)
- [Guidelines](https://github.com/UI5/linter/blob/main/docs/Guidelines.md)
- [Rules Documentation](https://github.com/UI5/linter/blob/main/docs/Rules.md)

**GitHub Resources**:
- [Task Board](https://github.com/orgs/SAP/projects/110)
- [Issues](https://github.com/UI5/linter/issues)
- [Pull Requests](https://github.com/UI5/linter/pulls)
- [Security Policy](https://github.com/UI5/linter/security/policy)

**Community**:
- [OpenUI5 Slack](https://ui5-slack-invite.cfapps.eu10.hana.ondemand.com) - #tooling channel
- [StackOverflow](http://stackoverflow.com/questions/tagged/ui5-tooling) - ui5-tooling tag

---

## Summary

**Quick Reference**:

**Report Bug**: Search → Create issue → Follow template → Provide context

**Request Feature**: Search → Create issue → Describe use case → Explain benefit

**Contribute Code**: Confirm welcome → Fork → Branch → Commit → PR → Review → Merge

**Get Help**: Use community channels (Slack, StackOverflow), not GitHub issues

---

**Document Version**: 1.0
**Last Verified**: 2025-11-21
**Next Review**: 2026-02-21
