const express = require('express')
const browserify = require('browserify-middleware')
const literalify = require('literalify')
const React = require('react')
// const {DOM} = React
// const {body, div, script} = DOM
const ReactDOMServer = require('react-dom/server')

const server = express()
server.use(express.static('public'))
// const App = React.createFactory(require('./app'))
const App = require('./app')
const DB = require('./database')

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
    arts: [
      { source_id: 1,
        hash: 1586874354,
        statusCode: 200,
        src: 'https://www.quantamagazine.org/wp-content/uploads/2016/09/Dragonfly.jpg',
        date: 'Tue Mar 4, 2016',
        text: 'I fail to scare party guests. The $30. We\'ve reached out to advise the humor in Canada will no longer sell a Halloween decoration depicts a Halloween decoration depicting a window!'
      }
    ]
  }

  // Here we're using React to render the outer body, so we just use the
  // simpler renderToStaticMarkup function, but you could use any templating
  // language (or just a string) for the outer page template
  var html = ReactDOMServer.renderToString(
    <html>
      <head>
        <script src='amazon_assoc.js' />
        <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.4/css/bootstrap.min.css' integrity='sha384-2hfp1SzUoho7/TsGGGDaFdsuuDL0LX2hnUp6VkX3CUQ2K4K+xjboZdsXyp4oUHZj' crossOrigin='anonymous' />
        <link rel='stylesheet' href='style.css' />
        <link href='https://fonts.googleapis.com/css?family=UnifrakturCook:700' rel='stylesheet' />
        <script src='ga.js' />
      </head>
      <body>
        <App {...props} />
        <script src='./bundle.js'/>
      </body>
    </html>
  )

  // Return the page to the browser
  res.send(html)
})

server.get('/bundle.js', browserify(['react', 'react-dom', {'./start_browser.js': {run: true}}]))

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
