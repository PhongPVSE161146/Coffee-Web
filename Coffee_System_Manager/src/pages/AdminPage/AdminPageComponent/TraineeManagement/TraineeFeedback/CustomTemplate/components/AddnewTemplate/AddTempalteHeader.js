// FeedbackTemplate.js
import React, { useState } from 'react';

import AddTemplate from './components/AddTemplate';
import './FeedbackTemplate.css'; // Import the CSS file

// const { Title, Text } = Typography;

const AddTempalteHeader = () => {
  const [AddTemplateSelected, setAddTemplateSelected] = useState('edit');
  return (
<div className='new-class-detail'>
      <div className='diviner'>
        <h1 className="statitics-text" >Feedback Template</h1>   
          
      </div>
      
      <div className="categories-items">
        <a className={AddTemplateSelected === 'edit' ? 'selected' : ''} onClick={() => setAddTemplateSelected('class')}>Add Template</a>
        
      </div>
      {AddTemplateSelected === 'edit' && (
      <AddTemplate/>
      
      )}


</div>
 
  );
};

export default AddTempalteHeader;
