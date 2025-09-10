
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, id, ...props }) => {
  return (
    <div className="relative">
      <input
        id={id}
        className="block px-3 pb-2 pt-5 w-full text-base bg-surface-variant/60 rounded-lg border border-outline appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer text-on-surface"
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute text-base text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
      >
        {label}
      </label>
    </div>
  );
};

export default React.memo(TextInput);
