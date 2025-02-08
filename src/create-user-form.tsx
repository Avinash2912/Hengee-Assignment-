import { useState, type CSSProperties, type Dispatch, type SetStateAction, type FormEvent } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

interface ValidationErrors {
  length?: boolean;
  spaces?: boolean;
  number?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validatePassword = (value: string): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (value.length < 10 || value.length > 24) errors.length = true;
    if (value.includes(' ')) errors.spaces = true;
    if (!/\d/.test(value)) errors.number = true;
    if (!/[A-Z]/.test(value)) errors.uppercase = true;
    if (!/[a-z]/.test(value)) errors.lowercase = true;

    return errors;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setValidationErrors(validatePassword(value));
    setApiError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!username || Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZGl5YTE3MDRAZ21haWwuY29tIl0sImlzcyI6Imhlbm5nZS1hZG1pc3Npb24tY2hhbGxlbmdlIiwic3ViIjoiY2hhbGxlbmdlIn0.Af2ACO4B5PVm8Y_NwKreoCcVZD4lu11uhE1PVh0NSXQ';
      console.log('Authorization Token:', token);

      const response = await fetch(
        'https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      console.log('API Response Status:', response.status);

      if (response.status === 200) {
        setUserWasCreated(true);
      } else if (response.status === 400) {
        setApiError('Sorry, the entered password is not allowed, please try a different one.');
      } else if (response.status === 401 || response.status === 403) {
        setApiError('Not authenticated to access this resource.');
      } else {
        setApiError('Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Error during API request:', error);
      setApiError('Something went wrong, please try again.');
    }
  };

  return (
    <div style={{ ...formWrapper, maxWidth: '100%', padding: '32px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', color: '#333' }}>
        Create User Account
      </h1>
      
      <form style={{ ...form, gap: '16px' }} onSubmit={handleSubmit}>
        <label style={{ ...formLabel, fontSize: '16px' }} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          style={{ ...formInput, height: '48px', fontSize: '16px' }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label style={{ ...formLabel, fontSize: '16px' }} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          style={{ ...formInput, height: '48px', fontSize: '16px' }}
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />

        {apiError && (
          <div style={{ ...errorMessage, fontSize: '16px', padding: '12px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            {apiError}
          </div>
        )}

        {password && (
          <ul style={{ ...validationList, fontSize: '16px' }}>
            {validationErrors.length === true && <li>Password must be between 10 and 24 characters long</li>}
            {validationErrors.spaces && <li>Password cannot contain spaces</li>}
            {validationErrors.number && <li>Password must contain at least one number</li>}
            {validationErrors.uppercase && <li>Password must contain at least one uppercase letter</li>}
            {validationErrors.lowercase && <li>Password must contain at least one lowercase letter</li>}
          </ul>
        )}

        <button style={{ ...formButton, height: '45px', fontSize: '18px', padding: '0 24px', width: '100%', marginTop: '16px' }} type="submit">
          Create User
        </button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: '300px',
  width: '50%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};

const errorMessage: CSSProperties = {
  color: '#d32f2f',
  fontSize: '14px',
  marginTop: '8px',
};

const validationList: CSSProperties = {
  listStyle: 'none',
  margin: '8px 0',
  padding: 0,
  color: '#d32f2f',
  fontSize: '14px',
};
