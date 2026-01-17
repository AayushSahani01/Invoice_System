import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CompanyData } from '../type';
import './CompanyForm.css';

interface CompanyFormProps {
  companyData: CompanyData;
  onChange: (data: CompanyData) => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ companyData, onChange }) => {
  const { register, getValues, setValue } = useForm<CompanyData>({
    defaultValues: companyData
  });

  // Sync text fields if parent data changes (e.g., loading from local storage)
  useEffect(() => {
    setValue('name', companyData.name);
    setValue('address', companyData.address);
    setValue('gst', companyData.gst);
  }, [companyData, setValue]);

  // Handle Image Upload (Logo or Signature)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'signature') => {
    // CRITICAL FIX: Stop this event from triggering the form's main onChange
    e.stopPropagation(); 

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // Combine the NEW image with the EXISTING data
        const updatedData = {
          ...companyData,       // Keep existing data (including the OTHER image)
          ...getValues(),       // Get latest text inputs just in case
          [field]: base64String // Update ONLY the specific image field
        };

        onChange(updatedData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Text Updates
  const handleTextChange = () => {
    // Slight delay to ensure react-hook-form state is ready
    setTimeout(() => {
      const currentTextValues = getValues();
      
      onChange({
        ...companyData,           // Keep existing images (logo & signature)
        name: currentTextValues.name,
        address: currentTextValues.address,
        gst: currentTextValues.gst,
      });
    }, 0);
  };

  return (
    <div className="company-form">
      <form className="company-form" onChange={handleTextChange}>
        
        <label>Company Name</label>
        <input {...register('name')} placeholder="e.g. Acme Corp" className="form-input" />
        
        <label>Address</label>
        <input {...register('address')} placeholder="123 Business Rd" className="form-input" />
        
        <label>GST / Tax ID</label>
        <input {...register('gst')} placeholder="GSTIN123456" className="form-input" />
        
        <div className="file-input-group">
          <label className="file-label">
            {companyData.logo ? "✓ Change Logo" : "Upload Logo"}
            <input 
              type="file" 
              accept="image/*" 
              className="file-input-field"
              // Pass the event 'e' to the handler so we can stop propagation
              onChange={(e) => handleImageChange(e, 'logo')} 
            />
          </label>
          
          <label className="file-label">
            {companyData.signature ? "✓ Change Signature" : "Upload Signature"}
            <input 
              type="file" 
              accept="image/*" 
              className="file-input-field" 
              // Pass the event 'e' to the handler so we can stop propagation
              onChange={(e) => handleImageChange(e, 'signature')}
            />
          </label>
        </div>

      </form>
    </div>
  );
};

export default CompanyForm;
