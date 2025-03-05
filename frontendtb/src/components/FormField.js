import React from 'react'
import { Form } from 'react-bootstrap'

function FromField({label,type,placeholder,onChange,value}) {
  return (
    <Form.Group className="mb-3 fw-bold"  >
        <Form.Label>{label}</Form.Label>
        <Form.Control required type={type} value={value} placeholder={placeholder} onChange={onChange} />
      </Form.Group>
  )
}

export default FromField