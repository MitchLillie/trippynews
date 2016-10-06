amzn_assoc_placement = 'adunit0'
amzn_assoc_search_bar = 'false'
amzn_assoc_tracking_id = 'trippynews-20'
amzn_assoc_ad_mode = 'manual'
amzn_assoc_ad_type = 'smart'
amzn_assoc_marketplace = 'amazon'
amzn_assoc_region = 'US'
amzn_assoc_title = 'Trippy Picks'
amzn_assoc_linkid = '8053f87397a66d5084f55dd5d4fce218'
amzn_assoc_asins = randomizeAsins()
amzn_assoc_size = 'autox2000'
amzn_assoc_rows = '7'

function randomizeAsins () {
  var asins = ['B00TXNX9E4', 'B000QGF986', 'B00634MYBU', 'B01ACRWASK', 'B000N5MK8M', 'B01AU56QAW', 'B01BV74HHC', 'B0000DH7X7', 'B00O06VTTQ', 'B00FGED458', 'B001UHKH6O', 'B01LWNF74M', 'B00CJQ4680']
  console.log("shuffle(asins).join(','): ", shuffle(asins).join(','))
  return shuffle(asins).join(',')
}

// Thank you http://stackoverflow.com/a/2450976/5213573
function shuffle (array) {
  var currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
