# Shopify Heroku CLI

A command-line tool to deploy Shopify apps to Heroku and manage environment variables between Shopify and Heroku.

## Installation

### As an npm package

```bash
npm install -g shopify-heroku-cli
```

### Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/shopify-heroku-cli.git
cd shopify-heroku-cli
npm install
npm link  # Make the CLI command available globally on your machine
```

## Prerequisites

- [Shopify CLI](https://shopify.dev/tools/cli) installed and authenticated
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed and authenticated
- A Shopify app configured in your environment
- A Heroku app created and ready to use

## Usage

The CLI supports two primary commands:

### Set Environment Variables

Set Shopify environment variables to your Heroku app:

```bash
shopify-heroku set-env your-heroku-app-name
```

### Deploy App

Deploy your Shopify app to Heroku:

```bash
shopify-heroku deploy your-heroku-app-name
```

## What it does

### Set Environment (set-env)

1. Fetches environment variables from your Shopify app using Shopify CLI
2. Extracts the `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` values
3. Gets the app URL from Heroku and adds it as `SHOPIFY_APP_URL`
4. Sets all these environment variables in your Heroku app

### Deploy (deploy)

1. Sets the Heroku stack to container
2. Configures the Heroku git remote
3. Deploys your app to Heroku using git push
4. Tries both 'main' and 'master' branches automatically

## License

MIT License

Copyright (c) 2025 Mohamad Nashaat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
