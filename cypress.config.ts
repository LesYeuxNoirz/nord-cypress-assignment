import { defineConfig } from 'cypress';
import { rmSync } from 'fs';
import { sep } from 'path';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
  e2e: {
    baseUrl: 'https://nordlayer.com/blog/',
    specPattern: 'test/specs/**/*.feature',
    supportFile: 'test/support/index.ts',
    video: true,
    videosFolder: 'test/videos',
    screenshotOnRunFailure: false,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)]
        })
      );

      // Clean the video of a successfully run spec to save time on its compression
      on('after:spec', (spec, results) => {
        const { video, tests } = results;

        // tests is set to null if the spec crashed, otherwise it's an array of test result objects
        if (video && tests?.every(t => t.state !== 'failed')) {
          try {
            process.stdout.write(
              `Successfully removed the video of the spec "${spec.name.split(sep).pop()}" as it passed successfully`
            );

            rmSync(video);
          } catch (error) {
            process.stdout.write(
              `Failed to remove the video ${video} with an error: ${(error as Error).message}`
            );

            throw error;
          }
        }
      });

      return config;
    }
  }
});
