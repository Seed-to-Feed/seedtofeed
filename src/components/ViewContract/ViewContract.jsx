import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

function ViewContract({ fieldID }) {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const contracts = useSelector((store) => store.contractListReducer); // Currently we only have contract list in server and planned reducer. Must create a specific view now.
  console.log('here is the contract list:', contracts);

  const contractID = params.contractID;
  console.log('here is the contract ID:', contractID);






  const user = useSelector((store) => store.user);





  useEffect(() => {
    if (user.farmer === true) {
      dispatch({
        type: 'FETCH_CONTRACT_LIST',
      });
    }
    if (user.buyer === true) {
      dispatch({
        type: 'FETCH_BUYER_CONTRACT_LIST',
      });
    }
  }, [user]);

  // const foundContract = contracts?.find((contract) => {
  //   console.log(contract);
  //   return contract.contractID === Number(params.contractID);
  // });
  // console.log('the fieldID for the contract', fieldID);
  // console.log('the userID for the contract', user.id);
  const foundContracts = contracts.filter((contract) => contract.userID === user.id);
  // console.log('We have some contracts', foundContracts);
  const currentContract = foundContracts[foundContracts.length - 1];
  // console.log('the current contract', currentContract);

  if (foundContracts.length === 0) {
    return (
      <h3>No Contracts for this field</h3>

      // <center>
  
      //   <h1>Contract Details</h1>
  
      //   <Grid container spacing={3}>
      //     <Grid item xs={4} />
  
      //     <Grid item>
  
      //       <h4>Contract Handler: {contracts[0]?.contract_handler}</h4>
      //       <TableContainer component={Paper}>
      //         <Table size='small'>
      //           <TableHead>
      //             <TableRow>
      //               <TableCell align='right'>
      //                 <br />
      //                 Contract ID:
      //                 <br />
      //                 Grower:
      //                 <br />
      //                 Commodity:
      //                 <br />
      //                 Status:
      //                 <br />
      //                 Contract Quantity:
      //                 <br />
      //                 Quantity Fulfilled:
      //                 <br />
      //                 Container S/N:
      //                 <br />
      //                 Price:
      //                 <br />
      //                 <br />
      //               </TableCell>
      //               <TableCell>
      //                 <br />
      //                 {contracts[0]?.contractID}
      //                 <br />
      //                 {contracts[0]?.first_name} {contracts[0]?.last_name}
      //                 <br />
      //                 {contracts[0]?.crop_type}
      //                 <br />
      //                 {contracts[0]?.name}
      //                 <br />
      //                 {contracts[0]?.contract_quantity}
      //                 <br />
      //                 {contracts[0]?.quantity_fulfilled}
      //                 <br />
      //                 {contracts[0]?.container_serial}
      //                 <br />
      //                 {contracts[0]?.price}
      //                 <br />
      //                 <br />
      //               </TableCell>
      //             </TableRow>
      //           </TableHead>
      //         </Table>
      //       </TableContainer>
      //     </Grid>
      //     <Grid item>
      //       <h4>NIR Quality Expectations: {contracts[0]?.bushel_uid}</h4>
      //       <TableContainer component={Paper}>
      //         <Table size='small'>
      //           <TableHead>
      //             <TableRow>
      //               <TableCell align='right'>
      //                 <br />
      //                 Amino Acid:
      //                 <br />
      //                 Energy:
      //                 <br />
      //                 Protein:
      //                 <br />
      //                 Oil:
      //                 <br />
      //                 Moisture:
      //                 <br />
      //                 <br />
      //                 <br />
      //                 <br />
      //                 <br />
      //               </TableCell>
      //               <TableCell>
      //                 <br />
      //                 {contracts[0]?.amino_acids}%
      //                 <br />
      //                 {contracts[0]?.energy}%
      //                 <br />
      //                 {contracts[0]?.protein}%
      //                 <br />
      //                 {contracts[0]?.oil}%
      //                 <br />
      //                 {contracts[0]?.moisture}%
      //                 <br />
      //                 <br />
      //                 <br />
      //                 <br />
      //                 <br />
      //               </TableCell>
      //             </TableRow>
      //           </TableHead>
      //         </Table>
      //       </TableContainer>
      //     </Grid>
      //     <Grid item xs={4} />
      //   </Grid>
      //   <div className='back-button'>
      //     <Button onClick={() => history.goBack()}>⬅ Go Back</Button>
      //   </div>
      // </center>
    );
  
  } else {
    return (
      <center>
      
      <h1>Contract Details</h1>
      
          <Grid container spacing={3}>
          <Grid item xs={4} />
  
          <Grid item>
            <h4>Contract Handler: {currentContract.contract_handler}</h4>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell align='right'>
                      <br />
                      Contract ID:
                      <br />
                      Grower:
                      <br />
                      Commodity:
                      <br />
                      Status:
                      <br />
                      Contract Quantity:
                      <br />
                      Quantity Fulfilled:
                      <br />
                      Container S/N:
                      <br />
                      Price:
                      <br />
                      <br />
                    </TableCell>
                    <TableCell>
                      <br />
                      {currentContract.contractID}
                      <br />
                      {currentContract.first_name} {currentContract.last_name}
                      <br />
                      {currentContract.crop_type}
                      <br />
                      {currentContract.name}
                      <br />
                      {currentContract.contract_quantity}
                      <br />
                      {currentContract.quantity_fulfilled}
                      <br />
                      {currentContract.container_serial}
                      <br />
                      {currentContract.price}
                      <br />
                      <br />
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item>
            <h4>NIR Quality Expectations: {currentContract.bushel_uid}</h4>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell align='right'>
                      <br />
                      Amino Acid:
                      <br />
                      Energy:
                      <br />
                      Protein:
                      <br />
                      Oil:
                      <br />
                      Moisture:
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                    </TableCell>
                    <TableCell>
                      <br />
                      {currentContract.amino_acids}%
                      <br />
                      {currentContract.energy}%
                      <br />
                      {currentContract.protein}%
                      <br />
                      {currentContract.oil}%
                      <br />
                      {currentContract.moisture}%
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={4} />
        </Grid>

      <div className='back-button'>
        <Button onClick={() => history.goBack()}>⬅ Go Back</Button>
      </div>
    </center>

    );
    
  }
  

}

export default ViewContract;
