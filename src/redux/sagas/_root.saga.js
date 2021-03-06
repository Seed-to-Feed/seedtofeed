import { all } from 'redux-saga/effects';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';

import fieldListSaga from './fieldList.saga';
import fieldDetailsSaga from './fieldDetails.saga';
import fieldTransactionsSaga from './fieldTransactions.saga';
import fieldNIRSaga from './fieldNIR.saga';
import cropListSaga from './cropList.saga';

import contractListSaga from './contractList.saga';
import contractStatusSaga from './contractStatus.saga';
import contractShortListSaga from './getContractShortList.saga';

import addFieldSaga from './addField.saga';
import addTransactionSaga from './addTransaction.saga';
import addNIRSaga from './addNIR.saga';
import addContractSaga from './addContract.saga';

import updateFieldSaga from './updateField.saga';
import updateTransactionSaga from './updateTransaction.saga';
import updateContractSaga from './updateContract.saga';
import updateNIRSaga from './updateNIR.saga';

import deleteFieldSaga from './deleteField.saga';
import deleteTransactionSaga from './deleteTransaction.saga';
import deleteContractSaga from './deleteContract.saga';
import deleteNIRSaga from './deleteNIR.saga';

import transactionTypesSaga from './transactionTypes.saga';
import userListSaga from './userList.saga';
import buyerFieldListSaga from './buyerFieldList.saga';

import uploadSaga from './uploadSaga';

import addBuyerSaga from './addBuyer.saga';
import buyerContractListSaga from './buyerContractList.saga';

// The bushelSaga and streamSaga will be used when connected to bushel platform
// import bushelSaga from './bushel.saga';
// import streamSaga from './stream.saga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),

    fieldListSaga(),
    fieldDetailsSaga(),
    fieldTransactionsSaga(),
    fieldNIRSaga(),
    cropListSaga(),

    contractListSaga(),
    contractStatusSaga(),
    contractShortListSaga(),

    addFieldSaga(),
    addTransactionSaga(),
    addNIRSaga(),
    addContractSaga(),

    updateFieldSaga(),
    updateTransactionSaga(),
    updateContractSaga(),
    updateNIRSaga(),

    deleteFieldSaga(),
    deleteTransactionSaga(),
    deleteContractSaga(),
    deleteNIRSaga(),

    transactionTypesSaga(),

    userListSaga(),
    buyerFieldListSaga(),
    addBuyerSaga(),

    uploadSaga(),

    buyerContractListSaga(),

    // bushelSaga(),
    // streamSaga(),
  ]);
}
