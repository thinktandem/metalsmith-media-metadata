# metalsmith-media-metadata [![build status](https://travis-ci.org/fortes/metalsmith-media-metadata.svg?branch=master)](https://travis-ci.org/fortes/metalsmith-media-metadata) [![codecov](https://codecov.io/gh/fortes/metalsmith-media-metadata/branch/master/graph/badge.svg)](https://codecov.io/gh/fortes/metalsmith-media-metadata) [![Greenkeeper badge](https://badges.greenkeeper.io/fortes/metalsmith-media-metadata.svg)](https://greenkeeper.io/)

Adds metadata to image and video metalsmith file objects. Only really useful when used in conjunction with other plugins.

## Example

The output of `exiftool` is added as metadata into the metalsmith file object for any media file:

```js
{
  'dog.jpg': {
    // Existing file data untouched
    exif: {
      exiftoolVersionNumber: 9.58,
      fileType: 'JPEG',
      mimeType: 'image/jpeg',
      jfifVersion: 1.01,
      resolutionUnit: 'None',
      xResolution: 1,
      yResolution: 1,
      imageWidth: 620,
      imageHeight: 413,
      // etc...
    }
  }
}
```

## Usage

```js
const mediaMetadata = require('metalsmith-media-metadata');

metalsmith.use(mediaMetadata({
  // Only process jpegs
  path: '*.+(jpg|jpeg)'
}));
```

There is one configuration option:

* `path`: [`minimatch`](https://github.com/isaacs/minimatch) *case-insensitive* glob that determines which files get processed (default: `*.+(gif|jpg|mp4|png)`)

## Requirements

* [`exiftool`](https://www.sno.phy.queensu.ca/~phil/exiftool/): Depending on your platform, installing [`dist-exiftool`](https://www.npmjs.com/package/dist-exiftool) may be the easiest way to go.

## Changelog

* `0.0.1`: Initial release

## Related plugins

* `metalsmith-image-dimensions`: Adds `width` and `height` to `img` tags.

## Miscellaneous

Sample images used in tests taken from [ianare/exif-samples](https://github.com/ianare/exif-samples)
