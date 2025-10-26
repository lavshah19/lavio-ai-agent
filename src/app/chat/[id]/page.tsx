import { promises } from 'dns'
import React from 'react'

const SingleChat = async({params}:{params:Promise<{id:string}>}) => {
    const {id}= await params;
  return (
    <div>SingleChat{id}</div>

  )
}

export default SingleChat