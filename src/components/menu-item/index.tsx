import * as React from 'react'
import { NavLink } from 'react-router-dom'

import './style.css'

export interface Props {
  id: number,
  name: string
}

export default function MenuItem({ id, name }: Props) {
  return <NavLink to={`/items/${id}`} className="MenuItem">
    {name}
  </NavLink>
}