const { Reporter } = require("@parcel/plugin");
const fs = require("fs");
const path = require("path");
const stylemark = require("stylemark");
const { performance } = require("perf_hooks");

const PACKAGE_JSON_SECTION = "stylemarkPath";

const stylemarker = new Reporter({
  async report({ event, options, logger }) {
    if (event.type !== "buildSuccess") {
      return;
    }

    const config = loadConfig(options.projectRoot);

    if (!config) throw new Error(`no valid config section in package.json.`);

    const input = config.input;
    const output = config.output;

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
      input,
      output,
      configPath: options.projectRoot + "/.stylemark.yml"
    });

    const buildEndedAt = performance.now();

    logger.info({
      message: `📄 Stylemark built in ${buildEndedAt - buildStartedAt} ms`
    });
  }
});

const loadConfig = rootFolder => {
  const packageJson = fs
    .readFileSync(path.join(rootFolder, "package.json"))
    .toString();
  const packageInfo = JSON.parse(packageJson);
  const packageSection = packageInfo[PACKAGE_JSON_SECTION];
  if (!packageSection) {
    throw new Error(`no "${PACKAGE_JSON_SECTION}" section in package.json.`);
  }

  return packageSection;
};

exports.default = stylemarker;
