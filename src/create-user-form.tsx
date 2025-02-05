// import type { CSSProperties, Dispatch, SetStateAction } from 'react';

// interface CreateUserFormProps {
//   setUserWasCreated: Dispatch<SetStateAction<boolean>>;
// }

// function CreateUserForm({}: CreateUserFormProps) {
//   return (
//     <div style={formWrapper}>
//       <form style={form}>
//         {/* make sure the username and password are submitted */}
//         {/* make sure the inputs have the accessible names of their labels */}
//         <label style={formLabel}>Username</label>
//         <input style={formInput} />

//         <label style={formLabel}>Password</label>
//         <input style={formInput} />

//         <button style={formButton}>Create User</button>
//       </form>
//     </div>
//   );
// }

// export { CreateUserForm };

// const formWrapper: CSSProperties = {
//   maxWidth: '500px',
//   width: '80%',
//   backgroundColor: '#efeef5',
//   padding: '24px',
//   borderRadius: '8px',
// };

// const form: CSSProperties = {
//   display: 'flex',
//   flexDirection: 'column',
//   gap: '8px',
// };

// const formLabel: CSSProperties = {
//   fontWeight: 700,
// };

// const formInput: CSSProperties = {
//   outline: 'none',
//   padding: '8px 16px',
//   height: '40px',
//   fontSize: '14px',
//   backgroundColor: '#f8f7fa',
//   border: '1px solid rgba(0, 0, 0, 0.12)',
//   borderRadius: '4px',
// };

// const formButton: CSSProperties = {
//   outline: 'none',
//   borderRadius: '4px',
//   border: '1px solid rgba(0, 0, 0, 0.12)',
//   backgroundColor: '#7135d2',
//   color: 'white',
//   fontSize: '16px',
//   fontWeight: 500,
//   height: '40px',
//   padding: '0 8px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginTop: '8px',
//   alignSelf: 'flex-end',
//   cursor: 'pointer',
// };




import type { CSSProperties, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [passwordCriteria, setPasswordCriteria] = useState<string[]>([]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (password: string) => {
    const criteria: string[] = [];

    if (password.length < 10) {
      criteria.push("Password must be at least 10 characters long");
    }
    if (password.length > 24) {
      criteria.push("Password must be at most 24 characters long");
    }
    if (password.includes(" ")) {
      criteria.push("Password cannot contain spaces");
    }
    if (!/\d/.test(password)) {
      criteria.push("Password must contain at least one number");
    }
    if (!/[A-Z]/.test(password)) {
      criteria.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      criteria.push("Password must contain at least one lowercase letter");
    }

    setPasswordCriteria(criteria);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null);
    setErrors([]);

    if (!username || passwordCriteria.length > 0) {
      if (!username) {
        setErrors(["Username is required"]);
      }
      return;
    }

    try {
      const token = getCookieValue('hennge_admission_challenge_token');

      if (!token) {
        setApiError("Not authenticated to access this resource.");
        return;
      }

      const response = await fetch(
        'https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse JSON error
          console.error("API Error:", errorData); // Log the full error for debugging

        if (response.status === 401 || response.status === 403) {
          setApiError("Not authenticated to access this resource.");
        } else if (response.status === 500 && errorData?.message === "Sorry, the entered password is not allowed, please try a different one.") { // Check if errorData exists and has the message
          setApiError("Sorry, the entered password is not allowed, please try a different one.");
        } else if (response.status === 500) {
          setApiError("Something went wrong, please try again.");
        } else {
          setApiError("Something went wrong, please try again."); // Generic error
        }
        return;
      }

      setUserWasCreated(true);
    } catch (error) {
      console.error("Fetch Error:", error); // Log the fetch error
      setApiError("Something went wrong, please try again.");
    }
  };


  const getCookieValue = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <ul style={{ color: 'red' }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
        {apiError && <p style={{ color: 'red' }}>{apiError}</p>}

        <label style={formLabel} htmlFor="username">Username</label>
        <input
          style={formInput}
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          aria-label="Username"
        />

        <label style={formLabel} htmlFor="password">Password</label>
        <input
          style={formInput}
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          aria-label="Password"
        />

        {passwordCriteria.length > 0 && (
          <ul style={{ color: 'orange' }}>
            {passwordCriteria.map((criteria, index) => (
              <li key={index}>{criteria}</li>
            ))}
          </ul>
        )}

        <button style={formButton} type="submit">Create User</button>
      </form>
    </div>
  );
}

export { CreateUserForm };



const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
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