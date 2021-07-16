import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';


function AddNIR() {
  //(field_id, oil, moisture, protein, energy, amino_acids, tested_at)

  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const field_id = params.field_id;

  const transType = useSelector((store) => store.transactionTypesReducer)

  //obtain field status of field NIR that is being added
  const fieldTrans = transType.filter((transaction) => transaction.id === Number(field_id));
  console.log('transaction type is', fieldTrans);

  //gets current date and time.
  const tested_at = new Date();

  const transType = useSelector((store) => store.fieldTransactionsReducer);

  const fieldTrans = transType[0].transaction_type;

  const fieldStatus = transType[0].field_status;




  // If we want a different format, we can use this:
  // const cDay = tested_at.getDate()
  // const cMonth = tested_at.getMonth() + 1
  // const cYear = tested_at.getFullYear()

  const [oil, setOil] = useState('');
  const [moisture, setMoisture] = useState('');
  const [protein, setProtein] = useState('');
  const [energy, setEnergy] = useState('');
  const [amino_acids, setAminoAcids] = useState('');

  function addNIR(event) {
    event.preventDefault();

    dispatch({
      type: 'ADD_NIR',
      payload: {
        field_id: field_id,
        oil: oil,
        moisture: moisture,
        protein: protein,
        energy: energy,
        amino_acids: amino_acids,
        fieldTrans: fieldTrans,
        fieldStatus: fieldStatus,
        tested_at: tested_at,
      },
    });

    history.push(`/field_details/${field_id}`);
  }

  return (
    <Router>
      <h1>Add NIR Analysis</h1>
      <TextField
        variant="outlined"
        label="Oil Level"
        type="number"
        value={oil}
        InputProps={{ inputProps: { min: 0 } }}
        onChange={(event) => setOil(event.target.value)}
        required
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
      />
      <br />
      <br />
      <TextField
        variant="outlined"
        label="Moisture Level"
        type="number"
        value={moisture}
        InputProps={{ inputProps: { min: 0 } }}
        onChange={(event) => setMoisture(event.target.value)}
        required
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
      />
      <br />
      <br />
      <TextField
        variant="outlined"
        label="Protein Level"
        type="number"
        value={protein}
        InputProps={{ inputProps: { min: 0 } }}
        onChange={(event) => setProtein(event.target.value)}
        required
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
      />
      <br />
      <br />
      <TextField
        variant="outlined"
        label="Energy Level"
        type="number"
        value={energy}
        InputProps={{ inputProps: { min: 0 } }}
        onChange={(event) => setEnergy(event.target.value)}
        required
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
      />
      <br />
      <br />
      <TextField
        variant="outlined"
        label="Amino Acid Level"
        type="number"
        value={amino_acids}
        InputProps={{ inputProps: { min: 0 } }}
        onChange={(event) => setAminoAcids(event.target.value)}
        required
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
      />
      <br />
      <br />
      {/* <FormControl size="small">
        <Select
          variant="outlined"
          value={field_status}
          required
          style={{ width: '155px' }}
          onChange={(event) => setFieldStatus(event.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled size="small">
            <em>Field Status</em>
          </MenuItem>
          {fieldStatus?.map((status) => {
            return (
              <MenuItem key={status.id} value={status.id}>
                {status.field_status}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <br />
      <br /> */}
      <Button
        size="small"
        type="button"
        onClick={() => {
          history.push(`/field_details/${field_id}`);
        }}
      >
        Cancel
      </Button>
      {`\u00A0\u00A0\u00A0\u00A0`}
      <Button size="small" type="submit" onClick={(event) => addNIR(event)}>
        Add NIR
      </Button>
    </Router>
  );
}

export default AddNIR;
