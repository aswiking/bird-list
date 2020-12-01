import React from 'react';
import {useParams} from 'react-router-dom';

export default function Bird() {

  const { birdID } = useParams();

return <div>
  <p>I am bird {birdID}</p>
</div>
}