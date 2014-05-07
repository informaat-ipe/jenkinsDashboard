# jenkinsDashboard

Quick and dirty dashboard for development, running on raspberry pi's.

It rotates three views:

1. Build status
2. Production server status
3. Burndown charts

## Build status
Data is pulled from our internal Jenkins server. It displays all branches, the last commit message and the build status.

## Production server status
Data is pulled from a little process made by Aiko running on port `:1984` on the jenkins server. It is a wrapper around the aws-sdk, blended with some other sources of data. It moves in mysterious ways.

## Burndown charts
Charts are published on Google Drive, we pull them in with simple `<img>` tags.
