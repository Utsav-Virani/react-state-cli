# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2025-01-XX

### Added
- Comprehensive CI/CD workflows and automation
- Comprehensive boundary tests for utility functions
- Test case coverage improvements
- Example files with better folder structure
- Complete ES modules support with Node.js 18 compatibility

### Changed
- Converted to ES modules for better compatibility
- Improved code formatting and linting
- Updated workflow branches configuration
- Enhanced ESLint configuration

### Fixed
- Package-lock.json sync issues
- Handled already published npm versions in release workflow
- ESLint configuration and dependency issues
- Workflow compatibility with master branch

### Dependencies
- Updated @typescript-eslint/eslint-plugin to latest version
- Improved dependency management with dependabot

## [1.0.1] - 2025-01-XX

### Added
- Initial release of React State CLI
- Support for generating Redux Toolkit slices from initial state files
- Automatic TypeScript interface generation
- EJS template-based code generation
- Support for nested object type inference

### Features
- `generate` command for creating Redux boilerplate
- Automatic action creator generation for each state property
- Smart type inference from initial state values
- Clean file organization with generated slice, reducer, and types files
- Root state interface generation

### Dependencies
- Redux Toolkit integration
- TypeScript support
- EJS templating engine
- Commander.js for CLI functionality
- Chalk for colored console output

## [1.0.0] - 2025-01-XX

### Added
- Initial development version
- Basic CLI structure
- Core generation logic
- Template system for code generation 