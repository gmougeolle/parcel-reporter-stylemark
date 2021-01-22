const { Reporter } = require("@parcel/plugin");
const fs = require("fs");
const path = require("path");
const stylemark = require("stylemark");
const { performance } = require("perf_hooks");

const PACKAGE_JSON_SECTION = "staticFiles";

const stylemarker = new Reporter({
  async report({ event, options, logger }) {
    if (event.type !== "buildSuccess") {
      return;
    }

    const compilableTypes = ["css", "js"];
    let shouldRun = true;

    event.bundleGraph.getBundles().forEach(bundle => {
      if (!compilableTypes.includes(bundle.type)) return;

      if (bundle.env.minify) shouldRun = false;
    });

    if (!shouldRun)
      return logger.info({
        message: `Minified assets cannot be used to build Stylemark because comments will be stripped out`
      });

    const buildStartedAt = performance.now();

    const result = stylemark({
      input: "udata_gouvfr/theme/static/",
      output: "udata_gouvfr/theme/static/stylemark/",
      configPath: options.projectRoot + "/.stylemark.yml"
    });

    const buildEndedAt = performance.now();

    logger.info({
      message: `📄 Stylemark built in ${buildEndedAt - buildStartedAt} ms`
    });
  }
});

exports.default = stylemarker;
