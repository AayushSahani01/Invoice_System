import React, { useEffect } from 'react';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
import { InvoiceData } from '../type';
import { Trash } from 'lucide-react';
import './InvoiceForm.css';

interface InvoiceFormProps {
  onChange: (data: InvoiceData) => void;
  invoiceData: InvoiceData;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onChange, invoiceData }) => {
  const { register, control, handleSubmit, setValue } = useForm<InvoiceData>({ 
    defaultValues: invoiceData,
    mode: 'onChange' // Validate on change
  });
  
  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: 'items' 
  });

  // WATCH all form values in real-time
  const watchedValues = useWatch({ control });

  // Sync to parent whenever form changes
  useEffect(() => {
    // Merge watched values with base invoiceData to keep ID/Dates intact
    const mergedData = {
      ...invoiceData,
      ...watchedValues,
      // Ensure items is always an array
      items: watchedValues.items || invoiceData.items || []
    };
    onChange(mergedData as InvoiceData);
  }, [watchedValues]); // Dependency: runs whenever form changes

  return (
    <form className="invoice-form">
      <label>Invoice Number</label>
      <input 
        {...register('invoiceNumber')} 
        placeholder="INV-001" 
        className="invoice-input uppercase" 
      />
      
      <div className="flex-row gap-4" style={{ display:'flex', gap:'1rem' }}>
        <div style={{ flex:1 }}>
           <label>Issue Date</label>
           <input type="date" {...register('issueDate')} className="invoice-input" />
        </div>
        <div style={{ flex:1 }}>
           <label>Due Date</label>
           <input type="date" {...register('dueDate')} className="invoice-input" />
        </div>
      </div>
      
      <label>Client Name</label>
      <input 
        {...register('clientName')} 
        placeholder="Client Name" 
        className="invoice-input capitalize" 
      />
      
      <label>Client Address</label>
      <input 
        {...register('clientAddress')} 
        placeholder="Client Address" 
        className="invoice-input capitalize" 
      />

      <h3 className="section-subtitle">Item Details</h3>
      
      {fields.map((item, index) => (
        <div key={item.id} className="item-row">
          <input 
            {...register(`items.${index}.description`)} 
            placeholder="Desc" 
            className="item-input description-input" 
          />
          <input 
            type="number" 
            {...register(`items.${index}.quantity`)} 
            placeholder="Qty" 
            className="item-input qty-input" 
          />
          <input 
            type="number" 
            {...register(`items.${index}.unitPrice`)} 
            placeholder="Price" 
            className="item-input price-input" 
          />
          <input 
            type="number" 
            {...register(`items.${index}.taxRate`)} 
            placeholder="Tax" 
            className="item-input tax-input" 
          />
          
          <button 
            type="button" 
            onClick={() => remove(index)} 
            className="remove-btn"
          >
            <Trash size={16} />
          </button>
        </div>
      ))}

      <button 
  type="button" 
  // Add "as any" at the end of the object
  onClick={() => append({ description: '', quantity: 1, unitPrice: 0, taxRate: 0, amount: 0 } as any)} 
  className="add-item-btn"
>
  + Add Item
</button>

      <label style={{ marginTop: '1rem' }}>Notes</label>
      <textarea 
        {...register('notes')} 
        placeholder="Payment terms, bank details, etc." 
        className="notes-textarea" 
      />
    </form>
  );
};

export default InvoiceForm;
