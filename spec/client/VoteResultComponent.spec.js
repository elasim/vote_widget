/* globals describe, it, expect */
import '../helpers/react';
import React from 'react';
import { shallow } from 'enzyme';
import * as Fixture from './fixture';
import VoteResultComponent from '../../src/app/components/VoteResult';

describe('Given VoteResultComponent', () => {
  describe('When items property is given', () => {
    it('should render list for each tiem with rank, title, and percentage',
      () => {
        const items = Fixture.MOVIES.map((movie, index) => {
          return {
            title: movie.title,
            votes: (index + 1) * 10
          };
        });
        const total = items.reduce((sum, item) => sum += item.votes, 0);
        const wrapper = shallow(
          <VoteResultComponent items={items} />
        );
        const renderedListItems = wrapper.find('li');
        expect(renderedListItems.length).toBe(items.length);
        renderedListItems.forEach((li, index) => {
          const percentage = (items[index].votes / total * 100).toFixed(2);
          expect(li.text().indexOf(percentage) !== -1).toEqual(true);
        });
      }
    );
  });
});
