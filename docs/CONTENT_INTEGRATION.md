# Content integration and release

See [Native library](NATIVE_LIBRARY.md) for the current public taxonomy, release gate and update workflow. The public catalog contains existing released web adaptations and one revision PDF; it is not the private source manifest.

## Private review

The existing content:import command may project the 44 private approved metadata records into .private/catalog.json for loopback-only review. That import does not authorize public publication. Private review remains disabled on Vercel and excluded from deployment traces. Never commit source paths or private files.
