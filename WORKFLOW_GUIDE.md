# 🚀 GitHub Workflows & Automation Guide

This document explains all the automated workflows set up for the React State CLI project.

## 📋 Overview

The project uses GitHub Actions for comprehensive CI/CD automation including:

- **Continuous Integration** - Automated testing and quality checks
- **Automated Releases** - Version bumping and npm publishing  
- **Security** - Vulnerability scanning and dependency review
- **Dependency Management** - Automated dependency updates
- **Code Quality** - Linting, formatting, and code analysis

## 🔄 Workflow Files

### 1. **CI Workflow** (`.github/workflows/ci.yml`)

**Triggers**: Push to `main`/`develop`, Pull Requests
**Purpose**: Comprehensive testing and quality checks

**What it does**:
- ✅ Tests on Node.js 18.x and 20.x
- ✅ Runs ESLint and Prettier checks
- ✅ Builds the project
- ✅ Tests CLI functionality (dry-run and verbose)
- ✅ Security audit
- ✅ Validates generated files

**Status**: Runs on every PR and push to main branches

### 2. **Release Workflow** (`.github/workflows/release.yml`)

**Triggers**: Git tag push (format: `v*`)
**Purpose**: Automated npm publishing and GitHub releases

**What it does**:
- 📦 Publishes to npm registry
- 🏷️ Creates GitHub release
- ✅ Version validation
- 🔒 Provenance attestation

**Usage**:
```bash
# Create and push a tag to trigger release
git tag v1.0.2
git push origin v1.0.2
```

### 3. **Version Bump Workflow** (`.github/workflows/version-bump.yml`)

**Triggers**: Manual dispatch from GitHub UI
**Purpose**: Semi-automated version bumping

**What it does**:
- 🔢 Bumps package.json version
- 📝 Updates CHANGELOG.md
- 🔄 Creates release PR
- ✅ Runs tests before bumping

**Usage**:
1. Go to Actions tab in GitHub
2. Select "Version Bump" workflow
3. Click "Run workflow"
4. Choose version type (patch/minor/major)
5. Review and merge the created PR

### 4. **Tag and Release Workflow** (`.github/workflows/tag-and-release.yml`)

**Triggers**: Push to main when package.json changes
**Purpose**: Automatically create tags when version changes

**What it does**:
- 🔍 Detects version changes in package.json
- 🏷️ Creates and pushes git tag
- ▶️ Triggers release workflow

**Status**: Fully automated when version changes

### 5. **Auto Merge Workflow** (`.github/workflows/auto-merge.yml`)

**Triggers**: PR opened/updated, PR approved
**Purpose**: Automatically merge approved PRs and dependabot updates

**What it does**:
- 🤖 Auto-merges dependabot PRs after tests pass
- ✅ Auto-merges approved PRs after tests pass
- 🧪 Runs full test suite before merging

**Requirements**:
- All CI checks must pass
- PR must be approved (for human PRs)
- No merge conflicts

### 6. **CodeQL Security Analysis** (`.github/workflows/codeql.yml`)

**Triggers**: Push to main/develop, PRs to main, weekly schedule
**Purpose**: Advanced security analysis

**What it does**:
- 🔒 Scans for security vulnerabilities
- 📊 Code quality analysis
- ⚠️ Reports potential issues

**Status**: Runs weekly and on code changes

### 7. **Dependency Review** (`.github/workflows/dependency-review.yml`)

**Triggers**: PRs that modify package.json/package-lock.json
**Purpose**: Review dependency changes for security issues

**What it does**:
- 🔍 Reviews new dependencies
- 🚫 Blocks high-risk licenses
- ⚠️ Checks for vulnerabilities
- 📊 Generates dependency reports

## 🤖 Dependabot Configuration

**File**: `.github/dependabot.yml`
**Purpose**: Automated dependency updates

**Configuration**:
- 📅 Weekly updates on Mondays
- 🔄 Separate PRs for npm and GitHub Actions
- 👤 Auto-assigns to project maintainer
- 🏷️ Labeled for easy identification

## 📋 Pull Request Template

**File**: `.github/PULL_REQUEST_TEMPLATE.md`
**Purpose**: Standardized PR descriptions

**Features**:
- ✅ Comprehensive checklist
- 📝 Clear sections for description and testing
- 🔗 Issue linking
- 📷 Screenshot support

## 🚀 Release Process

### Automated Release (Recommended)

1. **Create Release PR**:
   ```bash
   # Use GitHub UI: Actions → Version Bump → Run workflow
   ```

2. **Review & Merge**:
   - Edit CHANGELOG.md with actual changes
   - Ensure all tests pass
   - Merge the release PR

3. **Automatic Publication**:
   - Tag is automatically created
   - GitHub release is generated
   - npm package is published

### Manual Release

1. **Bump Version**:
   ```bash
   npm version patch  # or minor/major
   ```

2. **Update Changelog**:
   ```bash
   # Edit CHANGELOG.md manually
   ```

3. **Create Tag**:
   ```bash
   git push origin v1.0.2
   ```

## 🔧 Required Secrets

For the workflows to function properly, set these secrets in GitHub:

### Repository Secrets

1. **`NPM_TOKEN`** (Required for npm publishing)
   ```bash
   # Create token at https://www.npmjs.com/settings/tokens
   # Add as repository secret
   ```

2. **`GITHUB_TOKEN`** (Automatically provided)
   - Used for creating releases and PRs
   - No manual setup required

## 📊 Status Badges

Add these badges to your README.md:

```markdown
[![CI](https://github.com/Utsav-Virani/react-state-cli/workflows/CI/badge.svg)](https://github.com/Utsav-Virani/react-state-cli/actions/workflows/ci.yml)
[![Release](https://github.com/Utsav-Virani/react-state-cli/workflows/Release/badge.svg)](https://github.com/Utsav-Virani/react-state-cli/actions/workflows/release.yml)
[![CodeQL](https://github.com/Utsav-Virani/react-state-cli/workflows/CodeQL/badge.svg)](https://github.com/Utsav-Virani/react-state-cli/actions/workflows/codeql.yml)
[![npm version](https://badge.fury.io/js/react-state-cli.svg)](https://badge.fury.io/js/react-state-cli)
```

## 🐛 Troubleshooting

### Common Issues

1. **Release fails with version mismatch**:
   - Ensure package.json version matches the git tag
   - Use the version bump workflow for consistency

2. **npm publish fails**:
   - Check NPM_TOKEN secret is set correctly
   - Verify token has publish permissions
   - Ensure package name is available

3. **Auto-merge not working**:
   - Check branch protection rules
   - Ensure all required checks are passing
   - Verify PR approval requirements

4. **CodeQL analysis fails**:
   - Check TypeScript compilation
   - Review security policy configuration

### Manual Intervention

If automation fails, you can always:

1. **Manual npm publish**:
   ```bash
   npm run build
   npm publish
   ```

2. **Manual release creation**:
   - Use GitHub UI to create release
   - Upload built assets if needed

3. **Manual tag creation**:
   ```bash
   git tag v1.0.2
   git push origin v1.0.2
   ```

## 📈 Monitoring

### GitHub Actions Dashboard

Monitor workflow status at:
```
https://github.com/Utsav-Virani/react-state-cli/actions
```

### npm Package Status

Check published packages at:
```
https://www.npmjs.com/package/react-state-cli
```

### Security Alerts

Review security findings at:
```
https://github.com/Utsav-Virani/react-state-cli/security
```

---

## 🎯 Best Practices

1. **Always use version bump workflow** for releases
2. **Review dependabot PRs** before auto-merge
3. **Keep CHANGELOG.md updated** with meaningful descriptions
4. **Monitor security alerts** and address promptly
5. **Test releases** in staging environment when possible

This automation setup ensures:
- ✅ Consistent code quality
- 🚀 Reliable releases  
- 🔒 Security monitoring
- 📦 Automated dependency management
- 🧪 Comprehensive testing

Your React State CLI project is now fully automated and production-ready! 🎉 