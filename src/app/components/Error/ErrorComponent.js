import React, { PropTypes } from 'react';

export default function ErrorComponent(props) {
  const { action, actionTitle, message } = props;
  let actionButton;
  if (action && actionTitle) {
    actionButton = (
      <p className="text-center">
        <button className="btn btn-default"
          onClick={e => props.action(e)}>
          {actionTitle}
        </button>
      </p>
    );
  }
  return (
    <div>
      <h2>Error</h2>
      <p className="alert alert-danger">{message}</p>
      {actionButton}
    </div>
  );
}

ErrorComponent.propTypes = {
  message: PropTypes.string.isRequired,
  action: PropTypes.func,
  actionTitle: PropTypes.string
};
