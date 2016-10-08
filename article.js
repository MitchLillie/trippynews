var React = require('react')

module.exports = React.createClass({
  render: function () {
    return (
      <div className='article'>
        <div className='row'>
          <div className='col-md-10 offset-md-2'><img src={this.props.src || 'http://loremflickr.com/600/400/' + this.props.text.split(/[.!?]/)[0].split(' ')[0]} className='img-fluid' /></div>
        </div>
        <div className='row'>
          <div className='col-md-1 offset-md-1'>
            <p>&rsaquo;</p>
          </div>
          <div className='col-md-10'>
            <h3>{this.props.text.split(/[.!?]/)[0]}</h3>
            <p>{this.props.text.split(/[.!?]/).slice(1).join('.').slice(1)}</p>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6 offset-md-2'>
            <p> <small>{this.props.date}</small></p>
          </div>
        </div>
      </div>
    )
  }
})
