import React, {useState} from 'react';

const UpvoteIcon = () => {
  const [color, setColor] = useState('#BEBEBE');

  return (
    <svg className='icon' onMouseOver={()=>setColor('#EE6F2D')} onMouseLeave={()=>setColor('#BEBEBE')} width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.26795 1C8.03775 -0.333333 9.96225 -0.333333 10.7321 1L17.6603 13C18.4301 14.3333 17.4678 16 15.9282 16H2.0718C0.532197 16 -0.430054 14.3333 0.339746 13L7.26795 1Z" fill={color}/>
</svg>

  )
};

export default UpvoteIcon;