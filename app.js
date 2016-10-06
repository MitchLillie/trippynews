var React = require('react')
var Article = require('./article')

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered. We also want the button to be disabled until the
  // component has fully mounted on the DOM
  getInitialState: function () {
    return {arts: this.props.arts, disabled: true}
  },

  // Once the component has been mounted, we can enable the button
  componentDidMount: function () {
    this.setState({disabled: false})
  },

  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  // Note that we allow the button to be disabled initially, and then enable it
  // when everything has loaded
  render: function () {
    let articles = this.props.arts.map((article, i) => {
      return <Article {...article} key={i + 1} />
    })
    return (
      <div>
        <nav className='navbar navbar-fixed-top navbar-light bg-faded'>
          <div className='text-wrap'>
            <svg viewBox='0 0 130 110' width='325px' height='85px'>
              <pattern id='p-img' viewBox='0 0 290 200' patternUnits='userSpaceOnUse' width='300%' height='260%' x='-30%' y='-60%'>
                <image href='flickr.com_SurFeRGiRL30_CC-BY-2.0.jpg' width={500} height={500} />
              </pattern>
              <text textAnchor='left' dy='1.15em' dx='-1.8em' className='img-layer'>Trippy News</text>
            </svg>
          </div>
        </nav>
        <div className='container articles'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8'>
                {articles}
              </div>
              <div className='col-md-3'>
                <script src='//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US'></script>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
})
// return div(null,
//
//   button({onClick: this.handleClick, disabled: this.state.disabled}, 'Add Item'),
//
//   ul({children: this.state.items.map(function (item) {
//     return li(null, item)
//   })})
// )
