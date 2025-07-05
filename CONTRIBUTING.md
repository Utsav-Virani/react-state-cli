# Contributing to React State CLI

We love your input! We want to make contributing to React State CLI as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. **Fork the repo** and create your branch from `main`.
2. **Make your changes** and ensure the code follows our style guidelines.
3. **Test your changes** thoroughly.
4. **Update documentation** if you've changed APIs or functionality.
5. **Ensure the test suite passes** (when available).
6. **Make sure your code lints** without errors.
7. **Issue a pull request** with a clear description of your changes.

## Development Setup

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- TypeScript knowledge
- Git

### Setup Instructions

```bash
# Clone your fork
git clone https://github.com/Utsav-Virani/react-state-cli.git
cd react-state-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
npm link

# Test your changes
react-state-cli generate ./examples/initState.ts
```

### Project Structure

```
react-state-cli/
├── src/
│   ├── index.ts          # CLI entry point with Commander setup
│   ├── generate.ts       # Core generation logic
│   └── utils.ts          # Utility functions
├── templates/
│   ├── slice.ts.tpl      # Redux slice template
│   ├── reducers.ts.tpl   # Reducer export template
│   └── state.ts.tpl      # Root state template
├── dist/                 # Compiled TypeScript output
├── tests/               # Test files (when added)
└── examples/            # Example usage files
```

## Code Style

We follow these guidelines:

- **TypeScript**: All new code should be written in TypeScript
- **Formatting**: Use Prettier for consistent formatting
- **Linting**: Follow ESLint rules
- **Naming**: Use camelCase for variables and functions, PascalCase for classes
- **Comments**: Add JSDoc comments for public APIs

### Code Formatting

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Testing

Currently, the project uses manual testing. We welcome contributions to add automated testing:

- Unit tests for utility functions
- Integration tests for file generation
- CLI command testing

### Manual Testing Checklist

When making changes, please test:

1. **Basic generation**: Does `generate` command work with simple state?
2. **Complex state**: Does it handle nested objects and arrays?
3. **Edge cases**: Empty objects, null values, different data types
4. **File structure**: Are generated files in correct locations?
5. **TypeScript**: Do generated files compile without errors?

## Reporting Bugs

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/Utsav-Virani/react-state-cli.git/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Bug Report Template

```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.0.0]
- Package version: [e.g. 1.0.1]

## Additional Context
Add any other context about the problem here.
```

## Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **Include examples** of how the enhancement would work

## Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone.

### Our Standards

Examples of behavior that contributes to a positive environment:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## Recognition

Contributors who make significant contributions will be recognized in:

- README.md contributors section
- CHANGELOG.md for their specific contributions
- GitHub releases notes

## Getting Help

- **Documentation**: Check the README.md first
- **Issues**: Browse existing issues for similar problems
- **Discussions**: Start a discussion for questions about development
- **Email**: Contact maintainers directly for sensitive issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask questions. We're here to help!

- Open an issue with the `question` label
- Start a discussion in the GitHub Discussions tab
- Contact the maintainers directly

---

**Thank you for contributing!** 🎉 