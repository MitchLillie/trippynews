var React = require('react')
var DOM = React.DOM
var {div, button, ul, li, nav} = DOM

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered. We also want the button to be disabled until the
  // component has fully mounted on the DOM
  getInitialState: function () {
    return {items: this.props.items, disabled: true}
  },

  // Once the component has been mounted, we can enable the button
  componentDidMount: function () {
    this.setState({disabled: false})
  },

  // Then we just update the state whenever its clicked by adding a new item to
  // the list - but you could imagine this being updated with the results of
  // AJAX calls, etc
  handleClick: function () {
    this.setState({
      items: this.state.items.concat('Item ' + this.state.items.length)
    })
  },

  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  // Note that we allow the button to be disabled initially, and then enable it
  // when everything has loaded
  render: function () {
    return (
      <div>
        <button>Hello</button>
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

// <nav class="navbar navbar-fixed-top navbar-light bg-faded">
//   <div class="text-wrap">
//     <svg viewBox="0 0 100 100" width="400px" height="100px">
//       <pattern id="p-img" viewBox="0 0 300 200" patternUnits="userSpaceOnUse" width="300%" height="200%" x="100px" y="-10%">
//         <image xlink:href="https://s-media-cache-ak0.pinimg.com/originals/93/e6/58/93e6585e1eb37e17ec9a7d3d55679147.jpg" width="300" height="300"></image>
//       </pattern>
//       <text text-anchor="left" dy="1.2em" dx="-1.8em" class="img-layer">Trippy News</text>
//     </svg>
//   </div>
// </nav>
// <div class="container articles">
//   <div class="container">
//     <div class="row">
//       <div class="col-md-8">
//         <div class="row">
//           <div class="col-md-10 offset-md-2"><img src="https://www.quantamagazine.org/wp-content/uploads/2016/09/Dragonfly.jpg" class="img-fluid"/></div>
//         </div>
//         <div class="row">
//           <div class="col-md-1 offset-md-1">
//             <p>›</p>
//           </div>
//           <div class="col-md-10">
//             <h3>I Fail to Scare Party Guests</h3>
//             <p>The $30. We've reached out to advise the humor in Canada will no longer sell a Halloween decoration depicts a Halloween decoration depicting a window!</p>
//           </div>
//         </div>
//         <div class="row">
//           <div class="col-md-6 offset-md-2">
//             <p> <small>Tue Mar 8, 2016</small></p>
//           </div>
//         </div>
//         <div class="row">
//           <div class="col-md-10 offset-md-2"><img src="https://www.quantamagazine.org/wp-content/uploads/2016/09/Ghissi_Altarpeiece_1K.jpg" class="img-fluid"/></div>
//         </div>
//         <div class="row">
//           <div class="col-md-1 offset-md-1">
//             <p>›</p>
//           </div>
//           <div class="col-md-10">
//             <h3>Pranjal Borkotoky Gently Waved his Game</h3>
//             <p><a>Pranjal Borkotoky gently waved his golf club at the birds continued to squawk loudly while keeping an eye on the ball. Pranjal Borkotoky shared video of himself swinging at the birds as he wrote?</a></p>
//           </div>
//         </div>
//         <div class="row">
//           <div class="col-md-6 offset-md-2">
//             <p><small>Wed Mar 9, 2016</small></p>
//           </div>
//         </div>
//       </div>
//       <div class="col-md-3">
//         <script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US"></script>
//       </div>
//     </div>
//   </div>
// </div>
