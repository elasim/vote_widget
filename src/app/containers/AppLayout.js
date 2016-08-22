import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

export default function AppLayout(props) {
  return (
    <div>
      <Link to="/vote">Vote</Link>
      <Link to="/vote_result">VoteResult</Link>
      {props.children}
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.any
};
