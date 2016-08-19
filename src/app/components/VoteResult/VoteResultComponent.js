import React, { PropTypes } from 'react';
import LoadingIndicator from '../LoadingIndicator';

export default function VoteResult(props) {
  const { items } = props;
  const total = items.reduce((sum, item) => sum += item.votes, 0);

  let prepared = !!items;
  for (let i = 0; prepared && i < items.length; ++i) {
    if (!items[i].votes) {
      prepared = false;
    }
  }

  if (!prepared) {
    return (
      <LoadingIndicator />
    );
  }

  const listItems = items.map((item, index) => {
    const { title, votes } = item;
    const ratio = votes ? (votes / total * 100).toFixed(2) : 'unknown';
    return (
      <li key={index} className="list-group-item">
        <span className="badge">{votes}</span>
        {title} ({ratio}%)
      </li>
    );
  });
  return (
    <ol className="lst-group">
      {listItems}
    </ol>
  );
}

VoteResult.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object)
};
