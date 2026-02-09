# UI5 Linter - Support and Community Resources

**Source**: [https://github.com/UI5/linter/blob/main/SUPPORT.md](https://github.com/UI5/linter/blob/main/SUPPORT.md)
**Last Updated**: 2025-11-21
**UI5 Linter Version**: 1.20.5

---

## Overview

This guide helps you get support for UI5 Linter issues, connect with the community, and choose the right channel for different types of questions or problems.

---

## ⚠️ Important: Do NOT Use GitHub Issues for Questions

**GitHub Issues are for**:
- ✅ Bug reports (confirmed issues)
- ✅ Feature requests
- ✅ Documentation problems

**GitHub Issues are NOT for**:
- ❌ Setup help
- ❌ General questions ("How do I...")
- ❌ Configuration assistance
- ❌ Troubleshooting guidance
- ❌ Best practices discussions

**Why**: GitHub Issues are for tracking development work, not community support. Questions in issues slow down the development process.

---

## Official Support Channels

### 1. StackOverflow ⭐ Recommended for Questions

**URL**: [http://stackoverflow.com/questions/tagged/ui5-tooling](http://stackoverflow.com/questions/tagged/ui5-tooling)

**Tag**: `ui5-tooling`

**Best For**:
- General questions about UI5 Linter
- Configuration help
- Troubleshooting linting issues
- Best practices
- "How do I..." questions

**How to Ask**:
```markdown
**Title**: Clear, specific question
Example: "How do I configure UI5 Linter to ignore test files?"

**Tags**: ui5-tooling, sapui5 (or openui5)

**Question Body**:
1. What you're trying to achieve
2. What you've tried
3. What's not working
4. Relevant code/configuration
5. Environment (UI5 Linter version, Node version, OS)
```

**Example Question**:
```markdown
# How do I fix no-globals rule errors in my UI5 project?

I'm getting `no-globals` rule violations when using `sap.ui.getCore()`.

## What I've Tried
- Running `ui5lint --fix` but it doesn't fix all occurrences
- Checked documentation for autofix limitations

## Configuration
```javascript
// ui5lint.config.mjs
export default {
  ignores: ["webapp/thirdparty/**"]
};
```

## Environment
- UI5 Linter: 1.20.5
- Node.js: 20.11.0
- OS: Windows 11

## Question
What are the limitations of autofix for `no-globals`? How do I manually fix unsupported cases?
```

**Why StackOverflow**:
- ✅ Answers benefit entire community (searchable)
- ✅ Expert community members can help
- ✅ Voting system highlights best answers
- ✅ Permanent knowledge base

---

### 2. OpenUI5 Community Slack

**Invite**: [https://ui5-slack-invite.cfapps.eu10.hana.ondemand.com](https://ui5-slack-invite.cfapps.eu10.hana.ondemand.com)

**Channel**: `#tooling`

**Best For**:
- Quick questions
- Real-time troubleshooting
- Community discussions
- Networking with other UI5 developers
- Sharing experiences

**How to Join**:
1. Visit [https://ui5-slack-invite.cfapps.eu10.hana.ondemand.com](https://ui5-slack-invite.cfapps.eu10.hana.ondemand.com)
2. Enter your email
3. Accept invitation
4. Join `#tooling` channel

**Channel Etiquette**:
- ✅ Search channel history first
- ✅ Provide context (version, OS, error message)
- ✅ Share code snippets (use code blocks)
- ✅ Thank people who help
- ❌ Don't cross-post to multiple channels
- ❌ Don't DM unless asked
- ❌ Don't post long code dumps (use gist.github.com)

**Example Slack Question**:
```
Hi! Getting an unexpected warning from UI5 Linter:

File: webapp/controller/Main.controller.js
Warning: no-ambiguous-event-handler

Config:
```javascript
export default {
  ignores: []
};
```

UI5 Linter: 1.20.5
Node: 20.11.0

Any ideas? 🤔
```

**Why Slack**:
- ✅ Fast responses (often within minutes)
- ✅ Friendly community
- ✅ Good for clarifying questions
- ✅ Less formal than StackOverflow

---

## When to Use Each Channel

### Use StackOverflow When:
- ✅ You have a well-defined question
- ✅ Answer would benefit others (searchable)
- ✅ You need detailed, documented response
- ✅ You can wait a few hours for answer
- ✅ You want permanent reference

**Examples**:
- "How does the autofix feature work?"
- "What's the best way to configure linter for monorepo?"
- "How do I integrate UI5 Linter with ESLint?"

---

### Use Slack When:
- ✅ You need quick clarification
- ✅ You're troubleshooting in real-time
- ✅ You want to discuss approach before implementing
- ✅ You have a time-sensitive question
- ✅ You want community feedback

**Examples**:
- "Quick question: Does --fix work on manifest.json?"
- "Anyone seen this error before? [screenshot]"
- "What's the recommended ignore pattern for Fiori Elements apps?"

---

### Use GitHub Issues When:
- ✅ You found a confirmed bug
- ✅ You have feature request with detailed use case
- ✅ Documentation is incorrect or missing
- ✅ You can provide reproduction steps

**Examples**:
- "Rule no-globals doesn't detect sap.ui.getCore() in arrow functions"
- "Feature Request: Add autofix for deprecated Button.tap event"
- "Documentation: Autofix limitations page missing Core API examples"

**Process**:
1. Confirm it's actually a bug (not configuration issue)
2. Search existing issues
3. Use issue template
4. Provide reproduction steps
5. Include environment details

See [Contributing Guide](contributing.md) for full details.

---

## Getting Help Checklist

Before asking for help, ensure you have:

**✅ Basic Information Ready**:
- [ ] UI5 Linter version: `ui5lint --version`
- [ ] Node.js version: `node --version`
- [ ] Operating system and version
- [ ] UI5 version in your project

**✅ Configuration**:
- [ ] ui5lint.config.js/mjs/cjs file (if used)
- [ ] Relevant package.json scripts
- [ ] ui5.yaml configuration

**✅ Error Details**:
- [ ] Exact error message (copy/paste, don't retype)
- [ ] Full command you ran
- [ ] Verbose output: `ui5lint --verbose`

**✅ Code Context**:
- [ ] Minimal code example demonstrating issue
- [ ] File structure (if relevant)
- [ ] Related configuration

**✅ What You've Tried**:
- [ ] List steps already attempted
- [ ] Note what didn't work
- [ ] Include search terms used (to avoid duplicate suggestions)

---

## Common Questions and Where to Ask

### Configuration Questions

**Question**: "How do I ignore specific files?"

**Best Channel**: StackOverflow or Slack

**Quick Answer**: See [Configuration Guide](configuration.md)

```javascript
// ui5lint.config.mjs
export default {
  ignores: ["webapp/thirdparty/**", "webapp/test/**"]
};
```

---

### Rule Questions

**Question**: "What does rule no-deprecated-api detect?"

**Best Channel**: StackOverflow (permanent reference)

**Quick Answer**: See [Rules Reference](rules-complete.md)

---

### Autofix Questions

**Question**: "Why didn't --fix work for deprecated API?"

**Best Channel**: StackOverflow or Slack

**Quick Answer**: See [Autofix Limitations](autofix-complete.md)

Many APIs can't be automatically fixed. Check the autofix reference for specific API limitations.

---

### Performance Questions

**Question**: "Linter is slow on my large codebase, how to optimize?"

**Best Channel**: StackOverflow (detailed answer)

**Quick Answer**: See [Performance Guide](performance.md)

Use ignore patterns, lint specific directories, and check benchmarks.

---

### Integration Questions

**Question**: "How do I integrate with GitHub Actions?"

**Best Channel**: StackOverflow

**Quick Answer**: See SKILL.md Integration section and `templates/github-actions-lint.yml`

---

## Community Resources

### Official Documentation

**Main Repository**: [https://github.com/UI5/linter](https://github.com/UI5/linter)

**Documentation**:
- README: [https://github.com/UI5/linter/blob/main/README.md](https://github.com/UI5/linter/blob/main/README.md)
- Rules: [https://github.com/UI5/linter/blob/main/docs/Rules.md](https://github.com/UI5/linter/blob/main/docs/Rules.md)
- Autofix: [https://github.com/UI5/linter/blob/main/docs/Scope-of-Autofix.md](https://github.com/UI5/linter/blob/main/docs/Scope-of-Autofix.md)
- Performance: [https://github.com/UI5/linter/blob/main/docs/Performance.md](https://github.com/UI5/linter/blob/main/docs/Performance.md)

---

### UI5 Community Resources

**SAP Community**: [https://community.sap.com/](https://community.sap.com/)

**Topics**: SAPUI5, OpenUI5, UI5 Tooling

**Best For**: General SAP/UI5 questions, not specifically UI5 Linter

---

**OpenUI5 Website**: [https://openui5.org/](https://openui5.org/)

**Best For**: UI5 framework documentation and resources

---

**SAPUI5 Documentation**: [https://sapui5.hana.ondemand.com/](https://sapui5.hana.ondemand.com/)

**Best For**: Official SAPUI5 framework documentation

---

### Learning Resources

**UI5 Tooling**: [https://sap.github.io/ui5-tooling/](https://sap.github.io/ui5-tooling/)

**Related Tools**: UI5 CLI, UI5 Builder, UI5 Server, UI5 Linter

---

## Troubleshooting Before Asking

### Step 1: Check Documentation

**Skill References**:
- [SKILL.md](../SKILL.md) - Main skill documentation
- [Rules Reference](rules-complete.md) - All 19 rules explained
- [Autofix Reference](autofix-complete.md) - What can/can't be fixed
- [CLI Options](cli-options.md) - All command-line flags
- [Configuration](configuration.md) - Config file setup
- [Performance](performance.md) - Optimization tips

**Official Docs**:
- [UI5 Linter README](https://github.com/UI5/linter/blob/main/README.md)
- [Rules Documentation](https://github.com/UI5/linter/blob/main/docs/Rules.md)

---

### Step 2: Search Existing Issues

```
[https://github.com/UI5/linter/issues?q=is%3Aissue+YOUR+SEARCH+TERMS](https://github.com/UI5/linter/issues?q=is%3Aissue+YOUR+SEARCH+TERMS)
```

**Common Searches**:
- "no-globals autofix"
- "manifest version error"
- "performance slow"
- "configuration not found"

---

### Step 3: Enable Verbose Logging

```bash
ui5lint --verbose --details
```

**Output includes**:
- Configuration loading details
- File processing information
- Rule execution details
- Detailed error messages

---

### Step 4: Try Dry-Run for Autofix

```bash
UI5LINT_FIX_DRY_RUN=true ui5lint --fix
```

**See what would change** without modifying files.

---

### Step 5: Isolate the Issue

**Create minimal reproduction**:
```bash
# Create test directory
mkdir ui5lint-test
cd ui5lint-test

# Create minimal file
cat > test.js << 'EOF'
sap.ui.define([], function() {
  return sap.ui.getCore();
});
EOF

# Test
ui5lint test.js
```

**If issue reproduces**: Great for asking help with minimal example

**If issue doesn't reproduce**: Problem is in your configuration or other code

---

## Response Time Expectations

### StackOverflow
- **Typical Response**: Few hours to 1-2 days
- **Depends On**: Question quality, complexity, community availability
- **Increase Chances**: Clear title, good tags, detailed question, code examples

### Slack
- **Typical Response**: Minutes to few hours
- **Depends On**: Time of day, channel activity
- **Increase Chances**: Be respectful of others' time, provide context

### GitHub Issues (Bugs)
- **Typical Response**: Few days to 1-2 weeks for initial triage
- **Depends On**: Issue severity, reproduction quality, maintainer availability
- **Increase Chances**: Complete bug template, provide reproduction, search duplicates

---

## Security Issues

**🔒 SPECIAL PROCESS FOR SECURITY VULNERABILITIES**

**DO NOT**:
- ❌ Create public GitHub issue
- ❌ Post in Slack
- ❌ Post on StackOverflow
- ❌ Discuss publicly anywhere

**DO**:
- ✅ Follow [Security Policy](https://github.com/UI5/linter/security/policy)
- ✅ Use GitHub's private security advisory feature
- ✅ Allow maintainers time to fix before public disclosure

**Why**: Public disclosure before fix puts all users at risk.

---

## Reporting Success Stories

**Where**: OpenUI5 Slack `#tooling` channel

**Share**:
- ✅ How UI5 Linter helped you
- ✅ Issues prevented
- ✅ Time saved
- ✅ Migration successes

**Benefits**:
- Helps others learn
- Motivates maintainers
- Builds community

**Example**:
```
Used UI5 Linter to prepare our app for UI5 2.x!

Found 127 issues:
- 45 deprecated APIs
- 23 global variable usages
- 12 manifest problems

Autofix handled 60%, manually fixed the rest in 2 days.

Migration to UI5 2.x: ✅ Success!

Thanks to the UI5 Linter team! 🎉
```

---

## Contributing Back

After getting help, consider:

**✅ Answer Questions**: Help others on StackOverflow or Slack

**✅ Improve Documentation**: Submit PR for docs that were unclear

**✅ Report Bugs**: If you found an issue, report it properly

**✅ Share Knowledge**: Blog posts, talks, tutorials

**✅ Contribute Code**: See [Contributing Guide](contributing.md)

---

## Summary

**Quick Decision Tree**:

```
Need help with UI5 Linter?
│
├─ General question / How to?
│  └─ StackOverflow (ui5-tooling tag)
│
├─ Quick question / Real-time troubleshooting?
│  └─ OpenUI5 Slack (#tooling channel)
│
├─ Found a bug / Feature request?
│  └─ GitHub Issues (after confirming)
│
├─ Security vulnerability?
│  └─ Private security advisory (GitHub)
│
└─ General UI5 question (not linter-specific)?
   └─ SAP Community / UI5 documentation
```

---

**Resources Checklist**:

**Before Asking**:
- [ ] Check skill references
- [ ] Search StackOverflow
- [ ] Search GitHub issues
- [ ] Try verbose mode
- [ ] Create minimal reproduction

**When Asking**:
- [ ] Choose right channel
- [ ] Provide version info
- [ ] Include configuration
- [ ] Share code example
- [ ] Describe what you tried

**After Receiving Help**:
- [ ] Mark answer as accepted (StackOverflow)
- [ ] Thank helpers
- [ ] Consider contributing back

---

**Document Version**: 1.0
**Last Verified**: 2025-11-21
**Next Review**: 2026-02-21
