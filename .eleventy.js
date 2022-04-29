module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy({"src/public/**/*.(css|jpg|png|svg|webmanifest|ico|pdf)": "/"});

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: 'src/pages',
      includes: '../_includes',
      data: '../_data',
      output: '_site'
    }
  };
};