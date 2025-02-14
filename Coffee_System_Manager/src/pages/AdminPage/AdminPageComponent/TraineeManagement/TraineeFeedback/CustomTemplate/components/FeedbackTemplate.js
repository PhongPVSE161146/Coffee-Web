// FeedbackTemplate.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import FeedbackForm from './Edit_Template/FeedbackForm';
import './FeedbackTemplate.css'; // Import the CSS file

// const { Title, Text } = Typography;

const FeedbackTemplate = () => {
  const [EditFeedbackSelected, setEditFeedbackSelected] = useState('edit');
 // Get the id from the URL parameter
  
  return (
<div className='new-class-detail'>
      <div className='diviner'>
        <h1 className="statitics-text" >Feedback Template</h1>   
          
      </div>
      
      <div className="categories-items">
        <a className={EditFeedbackSelected === 'edit' ? 'selected' : ''} onClick={() => setEditFeedbackSelected('class')}>Edit Template</a>
        
      </div>
      {EditFeedbackSelected === 'edit' && (
      <FeedbackForm/>
      
      )}


</div>
 
  );
};

export default FeedbackTemplate;
