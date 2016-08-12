import { Component, Children, PropTypes } from 'react';

export default class AppContext extends Component {
  getChildContext() {
    return this.props.context;
  }
  render() {
    return Children.only(this.props.children);
  }
}

AppContext.propTypes = {
  children: PropTypes.node,
  context: PropTypes.object,
};

AppContext.childContextTypes = {
  setTitle: PropTypes.func,
  setMeta: PropTypes.func,
  insertCss: PropTypes.func,
};
