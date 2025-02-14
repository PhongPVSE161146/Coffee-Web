import React, { useEffect } from "react";
import './UnderConstruction.css'
import BuildingSign from '../../assets/Page-Under-Construction/Under_Construction-612x612.jpg'
import Builder from '../../assets/Page-Under-Construction/construction-vehicles-005-512.svg'
import Building2 from '../../assets/Page-Under-Construction/construction-worker-005-512.svg'
import Builder2 from '../../assets/Page-Under-Construction/construction-worker-builder-006-512.svg'
import BuildingRoadBlock from '../../assets/Page-Under-Construction/roadwork-road-construction-worker-008-512.svg'
import { LanguageRounded, SettingsRounded } from "@mui/icons-material";

export default function UnderConstruction() {
  return (
    <div className="UnderConstruction">
      <img className='image1' src={BuildingSign} alt='Site Under Construction' style={{zIndex: 10}}/>
      
      <img className='image2' src={Builder} alt='Construction Worker' style={{zIndex: 10}}/>
      <SettingsRounded className='image2Prop' style={{zIndex: 9}}/>
      

      <img className='image3' src={Building2} alt='Construction Tool' style={{zIndex: 8}}/>
      <img className='image4' src={BuildingRoadBlock} alt='Construction Tool' style={{zIndex: 8}}/>

      <img className='image5' src={Builder2} alt='Construction Worker' style={{zIndex: 6}}/>
      <LanguageRounded className='imageMainProp' style={{zIndex: 6}}/>
      <div className="ground" style={{zIndex: 5}}> We're Working On It!</div>
    </div>
  );
}
