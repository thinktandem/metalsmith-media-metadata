/* eslint-env node */

const exiftool = require('node-exiftool');
const {Minimatch} = require('minimatch');

const DEFAULT_PATH = '*.+(gif|jpg|mp4|png)';

module.exports = function(options) {
  const matcher = new Minimatch((options && options.path) || DEFAULT_PATH, {
    nocase: true,
  });

  return function(files, metalsmith, done) {
    const ep = new exiftool.ExiftoolProcess();

    return ep
      .open()
      .then(() => {
        const promises = Object.entries(files).map(([file, data]) => {
          if (!matcher.match(file)) {
            return;
          }

          return ep.readMetadata(file).then(results => {
            if (results.error) {
              // eslint-disable-next-line no-console
              console.error(`Exiftool error: ${results.error}`);
              return;
            }

            if (results.data.length) {
              data.exif = results.data[0];
            } else {
              throw new Error('No data returned from exiftool');
            }
          });
        });

        return Promise.all(promises);
      })
      .then(() => ep.close(), () => ep.close())
      .then(done, done);
  };
};
