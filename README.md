# Better-Auth Custom Fork

This repository contains a customized fork of the better-auth library tailored for specific use cases. It's maintained as a private npm package.

## Overview

This repository modifies the original better-auth library to support custom authentication flows and requirements for our applications. The customized package is published as `@atomrigslab/better-auth` and used in guildpal-auth-server and client pages.

## Development

### Setup

```bash
# Install dependencies
pnpm install
```

### Making Changes

1. Navigate to `packages/better-auth` directory
2. Implement your custom changes for your specific use case
3. Test your changes locally

### Building

```bash
# Build the package
pnpm build
```

### Publishing

1. Configure npm publishing with a `.npmrc` file
2. Deploy to npm:
```bash
npm publish
```

## Usage

After publishing, you can use the updated package in your projects:

```bash
# In guildpal-auth-server or client projects
npm install @atomrigslab/better-auth
```

## Important Notes

- This is a custom fork - changes may not be compatible with the original library
- Maintain this repository to keep track of your customizations
- When updating the original library, carefully merge changes to avoid conflicts

## Related Projects

- guildpal-auth-server
- Client pages that depend on this authentication library