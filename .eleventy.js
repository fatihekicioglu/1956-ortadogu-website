module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addCollection("haberler", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/haberler/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("maclar", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/maclar/*.md").sort((a, b) => a.date - b.date);
  });

  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  eleventyConfig.addFilter(
    "oynanan",
    (maclar) => (maclar || []).filter((m) => m.data.bizim_gol != null && m.data.rakip_gol != null)
  );

  eleventyConfig.addFilter(
    "planlanan",
    (maclar) => (maclar || []).filter((m) => m.data.bizim_gol == null || m.data.rakip_gol == null)
  );

  eleventyConfig.addFilter("trDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
