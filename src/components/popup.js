import React from 'react'

const Popup = ({feature}) => {
    const {title, description, address, url} = feature.properties;
  return (
    <div>
        <h3>{title}</h3>
        <h4>{address}</h4>
        <p>{description}</p>
        <p>{url}</p>
    </div>
  )
}

export default Popup