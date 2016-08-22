import React, { Component, PropTypes } from 'react';

export default class UsernamePrompt extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    setUsername: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };
  static defaultProps = {
    defaultValue: ''
  }
  constructor(...args) {
    super(...args);
    this.state = {
      error: null,
      username: this.props.defaultValue
    };
    this.onSubmit = ::this.onSubmit;
    this.onChangeUsername = ::this.onChangeUsername;
  }
  render() {
    const {
      defaultValue,
      className,
      style
    } = this.props;
    return (
      <form onSubmit={this.onSubmit} className={className} style={style}>
        {this.renderError()}
        <div className="input-group">
          <input className="form-control" type="text" id="username"
            defaultValue={defaultValue}
            placeholder="Username"
            onChange={this.onChangeUsername}
          />
          <span className="input-group-btn">
            <button type="submit" className="btn btn-default">
              Submit
            </button>
          </span>
        </div>
      </form>
    );
  }
  renderError() {
    let error;
    if (this.state.error !== null) {
      error = (
        <p className="alert alert-danger">{this.state.error}</p>
      );
    }
    return error;
  }
  onChangeUsername(e) {
    this.setState({
      username: String(e.target.value).trim()
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const username = this.state.username.trim();
    const length = username.length;
    if (length > 140) {
      this.setState({
        error: 'Username cannot contains more than 140 characters'
      });
    } else if (length < 2) {
      this.setState({
        error: 'Username must contains more than two characters'
      });
    } else {
      this.setState({
        error: null
      });
      this.props.setUsername(username);
    }
  }
}
