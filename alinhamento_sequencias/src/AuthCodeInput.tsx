import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent, FocusEvent } from 'react';
import './styles/AuthCodeInput.css'; // Import the CSS file

const CODE_LENGTH = 15; // Define the number of characters

interface AuthCodeInputProps {
  inputCode: string[];
  onCodeChange: (newCode: string[]) => void;
}

const AuthCodeInput: React.FC<AuthCodeInputProps> = ({ inputCode, onCodeChange }) => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newCode = [...code]; // Use code state instead of inputCode prop
    newCode[index] = value;
    setCode(newCode);
    onCodeChange(newCode);

    // Move focus to the next input
    if (value.length >= 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to the previous input on Backspace
    if (e.key === 'Backspace' && index > 0) {
      if (e.currentTarget.value === '') {
        e.preventDefault();
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedText = e.clipboardData?.getData('text/plain');
    const values = pastedText ? pastedText.split('') : [];

    // Update input values
    setCode((prevCode) => {
      const newCode = [...prevCode];
      values.forEach((value, i) => {
        if (newCode[index + i] !== undefined) {
          newCode[index + i] = value;
        }
      });
      return newCode;
    });

    // Move focus to the next input
    if (index + values.length < inputRefs.current.length) {
      inputRefs.current[index + values.length].focus();
    }
  };

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="auth-code-input">
      {code.map((value, index) => (
        <input
          key={index}
          ref={(ref) => {
            if (ref) {
              inputRefs.current[index] = ref;
            }
          }}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          onFocus={handleInputFocus}
        />
      ))}
    </div>
  );  
};

export default AuthCodeInput;
