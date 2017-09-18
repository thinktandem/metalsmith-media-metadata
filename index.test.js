/* eslint-env node,jest */
const {promisify} = require('util');
const mediaMetadata = require('./index');
const Metalsmith = require('metalsmith');
const path = require('path');
const rimraf = promisify(require('rimraf'));

let files;
let metal;

beforeAll(done => {
  // Setup metalsmith, but don't build yet.
  metal = Metalsmith(__dirname)
    .source('./')
    .ignore(['.*', 'node_modules', '__*'])
    .destination('__build')
    .use(mediaMetadata({}));

  // .use(mediaMetadata({}))
  metal.build((err, processedFiles) => {
    files = processedFiles;
    done(err);
  });
});

afterAll(() => {
  return rimraf(path.join(__dirname, '__build'));
});

it('adds exif data to images', () => {
  // If build pipeline failes, `files` never gets assigned
  expect(files).toBeDefined();
  expect(files['sample.jpg'].exif).toMatchSnapshot();
  expect(files['sample2.jpg'].exif).toMatchSnapshot();
});

it('ignores non-media files', () => {
  expect(files).toBeDefined();
  expect(files['README.md'].exif).toBeUndefined();
});
