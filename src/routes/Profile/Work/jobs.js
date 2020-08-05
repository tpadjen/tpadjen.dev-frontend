// eslint-disable-next-line no-unused-vars
import React, { lazy } from 'react'
const Vista = lazy(() => import('!babel-loader!@mdx-js/loader!./vista.mdx'))


export default [
  {
    company: 'Mountain Vista High School',
    title: 'Computer Science Teacher',
    location: 'Highlands Ranch, CO',
    start: 'Aug 2009',
    end: 'Present',
    details: Vista,
  }
]
