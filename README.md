# parcel-reporter-copystatic

A very (very) simple plugin to copy static files at the end of each build. Files are only copied if they are newer, and only at the end of each build (no watcher included !).

This is so stupid that it actually hurts me to publish it, but publishing it will make it easier to use for me at least.
If you're feeling crazy and want to try it out, simply change your `.parcelrc` config :

```.parcelrc
{
  "extends": ["@parcel/config-default"],
  "reporters": ["...", "parcel-reporter-copystatic"]
}
```

Then, in your `package.json`, add a custom key :

```package.json
  "staticFiles": {
    "staticPath": [
      {
        "staticPath": "img/",
        "staticOutDir": "build/img/"
      }
    ]
  },
```

## Future development

This plugin is so simple it could actually either be generalized (something like `parcel-reporter-postbuild` that would allow to run arbitrary commands at the end of each build) or, if copying static assets is an hard requirement for you and you need more flexibility, this could become a full fletched plugin with sensible options and an actual watcher (or this plugin could try to inject those static files to parcel's watcher deps).

Either way, I currently don't have any intention of maintaining or developping this any further, as it fulfils my needs. However, feel free to submit PRs or better ideas in the comments. When Parcel documentation for custom transformers / plugins become better, I might take this to the next level.
