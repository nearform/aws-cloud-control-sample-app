[![cd](https://github.com/nearform/aws-cloud-control-sample-app/actions/workflows/cd.yaml/badge.svg)](https://github.com/nearform/aws-cloud-control-sample-app/actions/workflows/cd.yaml)

# aws-cloud-control-sample-app

Sample application harnessing the new AWS Cloud Control API and App Runner service. For illustration purposes only!

Uses <a href="https://vitejs.dev/">vite</a> and
<a href="https://reactjs.org/">React</a>, and intended to be built by App
Runner via docker. Functionally, it uses Musicbrainz API to find info and links for any
musical artist known in its databases.

## Setup

```sh
npm install

# for development
npm run dev

# for previewing the production app
npm run build
npm run serve
```
