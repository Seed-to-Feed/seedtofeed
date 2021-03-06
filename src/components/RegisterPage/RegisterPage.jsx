import React from 'react';

import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';
import Button from '@material-ui/core/Button';

function RegisterPage() {
  const history = useHistory();

  return (
    <div>
      <RegisterForm />

      <center>
        <Button
          className="submit-buttons"
          size="small"
          onClick={() => {
            history.push('/login');
          }}
        >
          Login Page
        </Button>
      </center>
    </div>
  );
}

export default RegisterPage;
