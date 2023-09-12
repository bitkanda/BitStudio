import React, { useState } from 'react';

class SessionHelp {
  constructor()
  {


  }

  static dataState() {
    const [data, setData] = useState([]); 
    return {
      data,
      setData,  
    };
  }
   
    static data = [];  
  
 
  }
 


export default SessionHelp;
 