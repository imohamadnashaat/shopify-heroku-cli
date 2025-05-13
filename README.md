# Shopify Heroku CLI

[![npm version](https://badge.fury.io/js/shopify-heroku-cli.svg)](https://www.npmjs.com/package/shopify-heroku-cli)
[![GitHub](https://img.shields.io/github/license/imohamadnashaat/shopify-heroku-cli)](https://github.com/imohamadnashaat/shopify-heroku-cli)

A lightweight command-line tool that seamlessly deploys Shopify apps to Heroku and synchronizes environment variables between platforms.

## Installation

Install globally via npm:

```bash
npm install -g shopify-heroku-cli
```

This will make the `shopify-heroku` command available globally on your system.

## Prerequisites

- [Shopify CLI](https://shopify.dev/tools/cli) installed and authenticated
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed and authenticated
- A Shopify app configured in your environment
- A Heroku app created and ready to use

## Quick Start

1. Install the CLI globally:

   ```bash
   npm install -g shopify-heroku-cli
   ```

2. Set up your environment variables:

   ```bash
   shopify-heroku set-env your-heroku-app-name
   ```

3. Deploy your app:

   ```bash
   shopify-heroku deploy your-heroku-app-name
   ```

## Examples

**Typical Workflow:**

```bash
# Create a Heroku app (if you haven't already)
heroku create my-shopify-app

# Set your environment variables
shopify-heroku set-env my-shopify-app

# Deploy your app
shopify-heroku deploy my-shopify-app

# Open your app in browser
heroku open --app my-shopify-app
```

## Features

**`set-env` command:**

- Automatically syncs Shopify environment variables to your Heroku app
- Configures `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` from your Shopify app
- Adds your Heroku app URL as `SHOPIFY_APP_URL` in the environment

**`deploy` command:**

- Sets up Heroku container stack configuration
- Manages git remote setup for Heroku
- Deploys your app with a single command
- Handles branch detection (main/master) automatically

## Troubleshooting

**Authentication Issues:**

- Ensure you're logged in to both Shopify CLI and Heroku CLI
- Run `shopify auth` and `heroku login` if needed

**Deployment Fails:**

- Check that your Heroku app exists with `heroku apps`
- Verify your git repository is properly initialized

**Environment Variables:**

- If variables aren't setting properly, try running `shopify-heroku set-env` again
- Confirm your Shopify app is properly configured

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE) © 2025 Mohamad Nashaat
