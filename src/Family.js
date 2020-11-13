import React from 'react';

export default function Family(props) {

  const familyName = props.categoryData[0];

  const speciesList = props.categoryData[1].map((bird, index) => {
    return <div key={index}>
      <h3>{bird.common}</h3>
      <h4 className="scientific">{bird.scientific}</h4>
    </div>
  })

return <div>
  <h2>{familyName}</h2>
  {speciesList}

</div>

}