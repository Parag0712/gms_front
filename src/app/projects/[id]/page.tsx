"use client"
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React from 'react'

type Props = {}

const page = (props: Props) => {
    const { id } = useParams();
  return (
    <div>
        
        <Link href={`/projects/${id}/customer`}>
            View Customer
        </Link>
        <Link href={`/projects/${id}/invoice`}>
            View Invoice
        </Link>
    </div>
  )
}

export default page;
