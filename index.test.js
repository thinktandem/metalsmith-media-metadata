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
  // If build pipeline fails, `files` never gets assigned
  expect(files).toBeDefined();

  // Exiftool output varies slightly by version, etc. Pick just a few fields to
  // check on.
  expect(files['sample.jpg'].exif).toBeDefined();
  expect(files['sample.jpg'].exif.ImageWidth).toBe(640);
  expect(files['sample.jpg'].exif.Flash).toBe('Off, Did not fire');
  expect(files['sample2.jpg'].exif).toBeDefined();
  expect(files['sample2.jpg'].exif.AFAreaMode).toBe('Single Area');
  expect(files['sample2.jpg'].exif.GPSLongitude).toBe(`11 deg 52' 53.32" E`);
});

it('adds exif data to video', () => {
  // If build pipeline fails, `files` never gets assigned
  expect(files).toBeDefined();

  const data = files['test-mpeg_512kb.mp4'];
  expect(data.exif).toBeDefined();

  expect(data.exif.TrackDuration).toBe('21.00 s');
  expect(data.exif.AudioChannels).toBe(2);
});

it('ignores non-media files', () => {
  expect(files).toBeDefined();
  expect(files['README.md'].exif).toBeUndefined();
});
