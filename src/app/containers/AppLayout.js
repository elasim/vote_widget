import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ErrorComponent from '../components/Error';
import { clearError } from '../actions/vote';

export default function AppLayout(props) {
  let error;
  if (props.error) {
    error = (
      <ErrorComponent
        message={props.error.message}
        action={() => props.clearError()}
        actionTitle="DISMISS"
      />
    );
  }
  return (
    <div className="container">
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        {error}
        {props.children}
      </div>
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.any,
  clearError: PropTypes.func.isRequired,
  error: PropTypes.object
};

function mapStateToProps(state) {
  return {
    error: state.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearError() {
      return dispatch(clearError());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
