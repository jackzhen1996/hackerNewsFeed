import React from 'react';
import {shallow, configure,} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MainFeed from '../MainFeed.js';

configure({ adapter: new Adapter() });


describe('Mainfeed functions should be correct',()=>{
  const component  = shallow(<MainFeed/>);

  it ('Mainfeed component exists', ()=>{
    expect(component.exists('.mainFeedContainer')).toBe(true);
  });

  // need to add a div to contain the children
  it('Main feed should have multiple children of Feedblocks', ()=>{
    expect(component.find('.mainFeedContainer').children().length).toBeDefined();
  });
});
