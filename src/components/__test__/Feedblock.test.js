import React from 'react';
import {shallow, configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FeedBlock from '../FeedBlock.js';
import CommentOrSave from '../CommentOrSave.js';

configure({ adapter: new Adapter() });

describe('Feedblock should have the correct outputs for different interactions', ()=>{
  const component = shallow(<FeedBlock/>);
  const commentOrSave = shallow(<CommentOrSave/>);

  it('Feedblock should render correctly', ()=>{
    expect(component.exists('.feedBlockContainer')).toBe(true);
  });

  it ('CommentOrSave should render correctly', ()=>{
    expect(commentOrSave.length).toBe(1);
  });

  it('Feedblock class should change from feedBlockContainer to feedBlockContainerExpanded when expanding comments', ()=>{
    // the button to click to expand comment section
    const expandButton = component.find(CommentOrSave).at(0).dive().find('.expandComments').at(0);
    // before click
    expect(component.at(0).hasClass('feedBlockContainer')).toBe(true);
    expandButton.simulate('click');
    // after click
    expect(component.at(0).hasClass('feedBlockContainerExpanded')).toBe(true);
  });

  it('Bookmarking an item should get a truthy response from server', async ()=>{
    const bookmarkButton = component.find(CommentOrSave).at(1).dive().find('.bookmarkContainer').at(0);
    console.log(component.find(CommentOrSave).at(1).prop('bookmark'))
    bookmarkButton.simulate('click');
    // find a way to wait for async action to finish
  });
});