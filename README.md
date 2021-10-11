# aws-cloud-control-sample-app
Sample application harnessing the new AWS Cloud Control API and App Runner service. For illustration purposes only!

Uses <a href="https://vitejs.dev/">vite</a> and
    <a href="https://reactjs.org/">React</a>, and intended to be built by App
    Runner. Functionally, it uses Musicbrainz API to find info and links for any
    musical artist known in its databases.

## Required for App Runner config:

`runtime`
```
nodejs12
```

`port`
```
5000
```

`build_command`(s)
```
npm install
npm run build
npm run serve
```

