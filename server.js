const express = require('express')

const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/', function (req, res) {
  res.sendStatus(200)
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode.', app.get('port'), app.get('env'))
})
