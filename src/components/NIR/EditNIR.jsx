import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, TextField } from '@material-ui/core';

function EditNIR() {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const fieldNIR = useSelector((store) => store.fieldNIRReducer);

  const NIRID = params.NIRID;
  const field_id = params.fieldID;

  const transType = useSelector((store) => store.fieldTransactionsReducer);

  const fieldTrans = transType[0].transaction_type;
  const fieldStatus = transType[0].field_status;

  useEffect(() => {
    dispatch({
      type: 'FETCH_FIELD_NIR',
      payload: field_id,
    });
  }, []);

  const NIR_index = fieldNIR.findIndex((NIR) => NIR.id === Number(NIRID));
  const NIR_to_edit = fieldNIR[NIR_index];

  const [oil, setOil] = useState(NIR_to_edit.oil);
  const [moisture, setMoisture] = useState(NIR_to_edit.moisture);
  const [protein, setProtein] = useState(NIR_to_edit.protein);
  const [energy, setEnergy] = useState(NIR_to_edit.energy);
  const [amino_acids, setAminoAcids] = useState(NIR_to_edit.amino_acids);

  function button() {
    event.preventDefault();

    dispatch({
      type: 'UPDATE_NIR',
      payload: {
        field_id: field_id,
        NIRID: NIRID,
        oil: oil,
        moisture: moisture,
        protein: protein,
        energy: energy,
        amino_acids: amino_acids,
        fieldTrans: fieldTrans,
        fieldStatus: fieldStatus,
      },
    });

    history.push(`/field_details/${field_id}`);
  }

  return (
    <center>
      <Router>
        <h1>Edit NIR Analysis</h1>

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
        />
        <br />
        <br />
        <Button
          className="form-cancel"
          size="small"
          type="button"
          onClick={() => {
            history.push(`/field_details/${field_id}`);
          }}
        >
          Cancel
        </Button>
        {`\u00A0\u00A0\u00A0\u00A0`}
        <Button
          className="form-submit"
          size="small"
          type="submit"
          onClick={(event) => button(event)}
        >
          Update
        </Button>
      </Router>
    </center>
  );
}

export default EditNIR;
