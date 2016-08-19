import React, { PropTypes } from 'react';
import withRouter from 'react-router/lib/withRouter';
import ErrorComponent from '../components/Error';

function NotFoundContainer({ router }) {
  return (
    <ErrorComponent message="Not Found"
      action={() => router.goBack()}
      actionTitle="Go Back"
    />
  );
}

NotFoundContainer.propTypes = {
  router: PropTypes.object
};

export default withRouter(NotFoundContainer);
