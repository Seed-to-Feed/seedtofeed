import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Card, TextField } from '@material-ui/core';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [farmer, setFarmer] = useState(true);

  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
        farmer: farmer,
        buyer: !farmer,
        first_name: firstName,
        last_name: lastName,
      },
    });
  }; // end registerUser

  return (
    <center>
      <Card className="formPanel">
        <form>
          <h2>Register User</h2>
          {errors.registrationMessage && (
            <h1 className="alert" role="alert">
              {errors.registrationMessage}
            </h1>
          )}
          <br />
          <TextField
            variant="outlined"
            label="Email Address"
            type="text"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            type="text"
            label="First Name"
            value={firstName}
            required
            onChange={(event) => setFirstName(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            type="text"
            label="Last Name"
            value={lastName}
            required
            onChange={(event) => setLastName(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
          />
          <h3>
            <center>
              <label>
                I'm a Farmer :
                <input
                  type="radio"
                  id="radio1"
                  name="radio-btn"
                  checked={farmer}
                  onChange={(event) => setFarmer(true)}
                />
              </label>
              {`\u00A0\u00A0\u00A0\u00A0`}
              <label>
                I'm a Buyer :
                <input
                  type="radio"
                  id="radio2"
                  name="radio-btn"
                  checked={!farmer}
                  onChange={(event) => setFarmer(false)}
                />
              </label>
            </center>
          </h3>
          <Button
            className="submit-buttons"
            size="small"
            onClick={(event) => registerUser(event)}
          >
            Register
          </Button>
        </form>
      </Card>
    </center>
  );
}

export default RegisterForm;
