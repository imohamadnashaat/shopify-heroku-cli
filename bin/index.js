#!/usr/bin/env node

import { execa } from 'execa';
import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

program
  .name('shopify-heroku')
  .description('CLI tool for Shopify and Heroku integration')
  .version('1.0.0');

program
  .command('set-env')
  .description('Set Shopify environment variables to Heroku')
  .argument('<heroku-app-name>', 'Name of the Heroku app')
  .action(setEnvToHeroku);

program
  .command('deploy')
  .description('Deploy Shopify app to Heroku')
  .argument('<heroku-app-name>', 'Name of the Heroku app')
  .action(deployToHeroku);

async function setEnvToHeroku(herokuApp) {
  try {
    console.log(
      chalk.blue(`Setting Shopify environment variables to ${herokuApp}...`)
    );

    // Fetch environment variables from Shopify directly to memory
    console.log(chalk.gray('Fetching environment variables from Shopify...'));
    let shopifyEnvVars = [];

    try {
      const { stdout } = await execa('shopify', ['app', 'env', 'show'], {
        stdio: 'pipe',
      });
      shopifyEnvVars = stdout.split('\n').filter((line) => line.trim());
    } catch (error) {
      console.error(
        chalk.red('Failed to fetch Shopify environment variables:'),
        error.message
      );
      process.exit(1);
    }

    // Extract required variables
    console.log(chalk.gray('Filtering required variables...'));
    const filteredVars = shopifyEnvVars.filter((line) =>
      line.trim().match(/^(SHOPIFY_API_KEY|SHOPIFY_API_SECRET)=/)
    );

    // Ensure we've got the required variables
    if (filteredVars.length === 0) {
      console.error(
        chalk.red(
          'Error: No SHOPIFY_API_KEY or SHOPIFY_API_SECRET found in Shopify environment variables'
        )
      );
      process.exit(1);
    }

    // Try to fetch web URL from Heroku or construct it if permission issues
    let shopifyAppUrl;
    console.log(chalk.gray(`Getting Web URL for Heroku app ${herokuApp}...`));

    try {
      const { stdout: herokuInfo } = await execa('heroku', [
        'info',
        '--app',
        herokuApp,
      ]);

      const webUrlMatch = herokuInfo.match(/Web URL:\s*(https?:\/\/[^\s]+)/);
      if (webUrlMatch) {
        shopifyAppUrl = webUrlMatch[1];
        console.log(chalk.green(`Found Heroku Web URL: ${shopifyAppUrl}`));
      } else {
        throw new Error('Could not parse Web URL from Heroku info');
      }
    } catch (error) {
      console.log(
        chalk.yellow(
          'Could not fetch Heroku app URL directly, constructing URL...'
        )
      );

      // Construct the standard Heroku URL
      shopifyAppUrl = `https://${herokuApp}.herokuapp.com`;
      console.log(
        chalk.green(`Using constructed Heroku URL: ${shopifyAppUrl}`)
      );

      // Check if the URL is accessible
      try {
        await execa('curl', ['-s', '--head', shopifyAppUrl]);
        console.log(
          chalk.green(`Verified URL is accessible: ${shopifyAppUrl}`)
        );
      } catch (curlError) {
        console.log(
          chalk.yellow(`Could not verify URL accessibility, proceeding anyway`)
        );
      }
    }

    // Add SHOPIFY_APP_URL to our list of environment variables
    filteredVars.push(`SHOPIFY_APP_URL=${shopifyAppUrl}`);

    // Process the environment variables
    console.log(chalk.blue('Pushing environment variables to Heroku...'));
    const envVars = filteredVars.map((line) => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim(); // Handle values that might contain = characters
      return { key: key.trim(), value };
    });

    for (const { key, value } of envVars) {
      if (key) {
        console.log(chalk.gray(`Setting ${key}...`));
        await execa('heroku', [
          'config:set',
          `${key}=${value}`,
          '--app',
          herokuApp,
        ]);
      }
    }

    console.log(
      chalk.green(`Environment variables successfully set to ${herokuApp}`)
    );
  } catch (error) {
    console.error(
      chalk.red('Error setting environment variables to Heroku:'),
      error
    );
    process.exit(1);
  }
}

async function deployToHeroku(herokuApp) {
  try {
    console.log(chalk.blue(`Deploying Shopify app to Heroku: ${herokuApp}...`));

    // Set Heroku stack to container
    console.log(
      chalk.gray(`Setting Heroku stack to container for ${herokuApp}...`)
    );
    try {
      await execa('heroku', ['stack:set', 'container', '--app', herokuApp]);
      console.log(chalk.green('Heroku stack set to container'));
    } catch (error) {
      console.error(
        chalk.yellow(
          'Warning: Failed to set Heroku stack to container, it might be already set:'
        ),
        error.message
      );
    } // Set up Heroku remote directly
    console.log(chalk.gray(`Setting up Heroku remote for ${herokuApp}...`));
    try {
      await execa('heroku', ['git:remote', '-a', herokuApp]);
      console.log(chalk.green('Heroku remote set'));
    } catch (error) {
      console.log(
        chalk.yellow(`Warning: Could not set Heroku remote: ${error.message}`)
      );
      console.log(chalk.yellow('Continuing with deployment anyway...'));
    }

    // Deploy to Heroku
    console.log(chalk.blue(`Deploying to ${herokuApp}...`));
    try {
      await execa('git', ['push', 'heroku', 'main'], { stdio: 'inherit' });
      console.log(chalk.green(`Successfully deployed to ${herokuApp}`));
    } catch (pushError) {
      // If main branch fails, try master branch
      console.log(
        chalk.yellow(
          'Deployment failed with main branch, trying master branch...'
        )
      );
      try {
        await execa('git', ['push', 'heroku', 'master'], { stdio: 'inherit' });
        console.log(chalk.green(`Successfully deployed to ${herokuApp}`));
      } catch (error) {
        console.error(chalk.red('Deployment failed:'), error.message);
        console.log(
          chalk.yellow(
            'Make sure you are in a git repository and have committed your changes.'
          )
        );
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(chalk.red('Error deploying to Heroku:'), error);
    process.exit(1);
  }
}

program.parse(process.argv);
