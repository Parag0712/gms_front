"use client"
import { useParams } from 'next/navigation';

const InvoicePage = () => {
  const { id } = useParams();

  // Fetch or retrieve the invoice details based on the project ID
  const invoice = {
    projectId: id,
    user: 'John Doe',
    customer: 'Jane Smith',
    amount: '$500',
  };

  return (
    <div>
      <h1>Invoice for Project {id}</h1>
      <p>User: {invoice.user}</p>
      <p>Customer: {invoice.customer}</p>
      <p>Amount: {invoice.amount}</p>
    </div>
  );
};

export default InvoicePage;
