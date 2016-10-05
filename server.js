const express = require('express')
const browserify = require('browserify-middleware')
const literalify = require('literalify')
const React = require('react')
const {DOM} = React
const {body, div, script} = DOM
const ReactDOMServer = require('react-dom/server')

const server = express()
const App = React.createFactory(require('./app'))

server.set('port', process.env.PORT || 3000)

server.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html')

  // `props` represents the data to be passed in to the React component for
  // rendering - just as you would pass data, or expose variables in
  // templates such as Jade or Handlebars.  We just use some dummy data
  // here (with some potentially dangerous values for testing), but you could
  // imagine this would be objects typically fetched async from a DB,
  // filesystem or API, depending on the logged-in user, etc.
  var props = {
    items: [
      'Item 0',
      'Item 1',
      'Item </script>',
      'Item <!--inject!-->'
    ]
  }

  // Here we're using React to render the outer body, so we just use the
  // simpler renderToStaticMarkup function, but you could use any templating
  // language (or just a string) for the outer page template
  var html = ReactDOMServer.renderToStaticMarkup(
    <body>

      {/*
      The actual server-side rendering of our component occurs here, and we
      pass our data in as `props`. This div is the same one that the client
      will "render" into on the browser from browser.js
      */}
      <div id='content' dangerouslySetInnerHTML={createContent(props)}></div>

      {/*
      The props should match on the client and server, so we stringify them
      on the page to be available for access by the code run in browser.js
      You could use any var name here as long as it's unique
      */}
      <script dangerouslySetInnerHTML={passProps(props)}></script>

      {/*
      We'll load React from a CDN - you don't have to do this,
      you can bundle it up or serve it locally if you like
      */}

      <script src='//cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react.min.js'></script>
      <script src='//cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react-dom.min.js'></script>

      {/*
      Then the browser will fetch and run the browserified bundle consisting
      of browser.js and all its dependencies.
      We serve this from the endpoint a few lines down.
      */}

      <script src='/bundle.js'></script>
    </body>
  )

  // Return the page to the browser
  res.send(html)
})

server.get('/bundle.js', browserify(['react', 'react-dom', {'./browser.js': {run: true}}]))

// server.get('/bundle.js', function (req, res) {
//   res.setHeader('Content-Type', 'text/javascript')
//
//   // Here we invoke browserify to package up browser.js and everything it requires.
//   // DON'T do it on the fly like this in production - it's very costly -
//   // either compile the bundle ahead of time, or use some smarter middleware
//   // (eg browserify-middleware).
//   // We also use literalify to transform our `require` statements for React
//   // so that it uses the global variable (from the CDN JS file) instead of
//   // bundling it up with everything else
//   browserify()
//     .add('./browser.js')
//     .transform(literalify.configure({
//       'react': 'window.React',
//       'react-dom': 'window.ReactDOM'
//     }))
//     .bundle()
//     .pipe(res.send)
// })

server.listen(server.get('port'), () => {
  console.log('Express server listening on port %d in %s mode.', server.get('port'), server.get('env'))
})

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify (obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

function createContent (props) {
  return {__html: ReactDOMServer.renderToString(App(props))}
}

function passProps (props) {
  return {__html: 'var APP_PROPS = ' + safeStringify(props) + ';'}
}
