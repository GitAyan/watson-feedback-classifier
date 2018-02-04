import React from 'react'
import {NavItem,Button} from 'reactstrap';

//Data used in homepage body.....
export const cardData = {
  homepage: {
    title: "Uncover Data",
    text: `We Analyze your text to extract meta-data from content such as concepts, entities, keywords, categories, relations, 
        semantic roles, and return both overall sentiment and emotion for a document, and targeted sentiment and 
        emotion towards keywords in the text for deeper analysis.`
  },
  feedback:{
    title: "Description",
    text:`Enter your text and we will classify your data into respective categories based on relevance, 
    and emotions based on the keywords from your data`
  }
};

export const logoutbtn = (
  <NavItem className="ml-auto">
    <Button type="submit" outline  id="signoutbtn">
      Sign Out
    </Button>
  </NavItem>
);