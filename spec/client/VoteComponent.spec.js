/* globals jasmine, describe, it, expect */
import '../helpers/react';
import React from 'react';
import { mount, shallow } from 'enzyme';
import * as Fixture from './fixture';
import VoteComponent from '../../src/app/components/Vote';

describe('Given VoteComponent', () => {
  describe('When submit button is clicked', () => {
    describe('And item was not selected', () => {
      it('should not call onSumit', () => {
        const submit = jasmine.createSpy('submit');
        const wrapper = mount(
          <VoteComponent
            onSubmit={submit}
            items={Fixture.MOVIES}
          />
        );
        const buttons = wrapper.find('button[type="submit"]');
        buttons.at(0).simulate('submit');

        expect(submit.calls.count()).toEqual(0);
        expect(wrapper.state('selectedIndex')).toEqual(null);
        expect(wrapper.state('value')).toEqual(null);
      });
    });
    describe('And item was selected', () => {
      it('should call onSubmit with index and value', () => {
        const submit = jasmine.createSpy('submit');
        const wrapper = mount(
          <VoteComponent
            onSubmit={submit}
            items={Fixture.MOVIES}
            selectedIndex={0}
          />
        );
        const buttons = wrapper.find('button[type="submit"]');
        buttons.at(0).simulate('submit');

        expect(submit).toHaveBeenCalledWith(0, Fixture.MOVIES[0]);
      });
      it('should prevent further submission', () => {
        const submit = jasmine.createSpy('submit');
        const wrapper = mount(
          <VoteComponent
            onSubmit={submit}
            items={Fixture.MOVIES}
            selectedIndex={0}
          />
        );
        const buttons = wrapper.find('button[type="submit"]');
        buttons.at(0).simulate('submit');
        buttons.at(0).simulate('submit');

        expect(submit.calls.count()).toEqual(1);
      });
    });
  });
  describe('When items proprty is given', () => {
    it('should render list items for each item', () => {
      const wrapper = shallow(
        <VoteComponent items={Fixture.MOVIES} />
      );
      expect(wrapper.find('li').length).toBe(Fixture.MOVIES.length);
    });
    describe('And an item is selected', () => {
      it('should change value', () => {
        const wrapper = shallow(
          <VoteComponent items={Fixture.MOVIES}
            selectedIndex={0} />
        );
        wrapper.find('label').at(0).simulate('click');
        expect(wrapper.state('value')).toEqual(Fixture.MOVIES[0]);
        expect(wrapper.state('selectedIndex')).toEqual(0);
      });
    });
  });
  describe('When defaultValue is given', () => {
    it('should select item from first', () => {
      const wrapper = shallow(
        <VoteComponent
          items={Fixture.MOVIES}
          selectedIndex={0}
        />
      );
      expect(wrapper.state('value')).toEqual(Fixture.MOVIES[0]);
      expect(wrapper.state('selectedIndex')).toEqual(0);
    });
  });
});
