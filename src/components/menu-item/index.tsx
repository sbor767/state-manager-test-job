import * as React from 'react'
import { NavLink, Link } from 'react-router-dom'

import './style.css'

export interface Props {
  id: number
  name: string
  isTopMenu?: boolean
}

export default function MenuItem({ id, name, isTopMenu }: Props) {
  const to = `/items/${id}`
  return isTopMenu ? (
    <NavLink to={to} className="MenuItem">{name}</NavLink>
  ) : (
    <Link to={to} className="MenuItem">{name}</Link>
  )
}