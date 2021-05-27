import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App.tsx';

configure({ adapter: new Adapter() });

// App should render
it ('App component exists', ()=>{
  const component  = shallow(<App/>);
  expect(component.exists('.App')).toBe(true);
});