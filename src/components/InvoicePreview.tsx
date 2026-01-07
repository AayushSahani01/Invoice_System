import React from 'react';
import { CompanyData, InvoiceDetailed, Totals } from '../type';

interface InvoicePreviewProps {
  companyData: CompanyData;
  invoiceData: InvoiceDetailed;
  totals: Totals;

}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ companyData, invoiceData, totals }) => {
  return (
    <div className="border border-gray-300 p-6 mt-4 min-h-screen w-full bg-white shadow-2xl " id="invoice-preview">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold">{companyData.name}</h2>
          <p>{companyData.address}</p>
          <p className=" font-medium">GST: {companyData.gst}</p>
        </div>
        {companyData.logo && <img src={companyData.logo} alt="Logo" className="w-fit h-16" />}
      </div>
      <hr className="my-4" />
      <div className="flex justify-between">
        <div className='pl-4 font-medium'>
          <h3 className='font-bold'>Bill To:</h3>
          <p>{invoiceData.clientName}</p>
          <p className='text-slate-700'>{invoiceData.clientAddress}</p>
        </div>
        <div>
          <p className='font-medium'>Invoice no: {invoiceData.invoiceNumber}</p>
          <p>Date: {invoiceData.issueDate}</p>
          <p>Due: {invoiceData.dueDate}</p>
        </div>
      </div>
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Description</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Tax %</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-center">{item.unitPrice}</td>
              <td className="border p-2 text-center">{item.taxRate}</td>   
              <td className="border p-2 font-bold text-center">{(item.quantity * item.unitPrice * (1 + item.taxRate / 100)) .toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right mt-4">
        <p className="font-bold">Invoice Summary:</p>
        <p>Subtotal: {totals.subtotal}  </p>
        <p>Tax: {totals.taxAmount} </p>
        <p>Discount: {totals.discount} </p>
        <p className="font-bold text-blue-500 border-b pb-3">Total: {totals.total}</p>
      </div>
      {companyData.signature &&
      <h1 className='font-medium mt-2'>Signature :<img src={companyData.signature} alt="Signature" className="w-32 mt-4" /></h1> }
      <p className="mt-4 text-slate-500 text-center text-sm"><b className='text-red-400'> </b>{invoiceData.notes}</p>
    </div>
  );
};

export default InvoicePreview;