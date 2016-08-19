import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import LoadingIndicator from '../LoadingIndicator';
import css from './VoteComponent.css';
import 'bootstrap/dist/css/bootstrap.css';

export default class VoteComponent extends Component {
  static displayName = 'VoteComponent';
  static propTypes = {
    disable: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.object),
    onSubmit: PropTypes.func,
    selectedIndex: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string
  };
  static defaultProps = {
    onSubmit: emptyFunction,
    items: []
  };
  constructor(...args) {
    super(...args);
    this.state = {
      ...this.createValueState(this.props.selectedIndex),
      disable: this.props.disable
    };
    this.onSubmit = ::this.onSubmit;
    this.onChangeItem = ::this.onChangeItem;
  }
  compoenntWillReceiveProps(nextProps) {
    if (nextProps.selectedIndex !== this.props.selectedIndex) {
      this.setState(this.createValueState(nextProps.selectedIndex));
    }
  }
  render() {
    const { className, style, items } = this.props;
    const { selectedIndex } = this.state;
    const disable = this.isDisabled();
    if (!items) {
      return (
        <LoadingIndicator />
      );
    }
    return (
      <form className={className} style={style} onSubmit={this.onSubmit}>
        <fieldset disabled={disable}>
          <ol className="list-group">
            {items.map((item, index) => {
              return (
                <li className="list-group-item" key={item.id}>
                  <label className={css['item--selectable']}>
                    <div className={css['radio-outer']}>
                      <input type="radio" name="movieId" value={index}
                        onChange={this.onChangeItem}
                        defaultChecked={index === selectedIndex} />
                    </div>
                    <h4>{item.title}</h4>
                    <p className="text-right">{item.directorName}</p>
                    <p>{item.summary}</p>
                  </label>
                </li>
              );
            })}
          </ol>
          <p className="text-center">
            <button type="submit" className="btn btn-default">Vote</button>
          </p>
        </fieldset>
      </form>
    );
  }
  onChangeItem(e) {
    this.setState(this.createValueState(parseInt(e.target.value, 10)));
  }
  onSubmit(e) {
    e.preventDefault();
    const { value, selectedIndex } = this.state;
    const disable = this.isDisabled();
    if (value !== null && !disable) {
      this.props.onSubmit(selectedIndex, value);
      this.setState({
        disable: true
      });
    }
  }
  createValueState(nextSelectedIndex) {
    return {
      selectedIndex: nextSelectedIndex > -1 ? nextSelectedIndex : null,
      value: nextSelectedIndex > -1 ? this.props.items[nextSelectedIndex] : null
    };
  }
  isDisabled() {
    return (typeof this.props.disable !== 'undefined')
      ? this.props.disable : this.state.disable;
  }
}
