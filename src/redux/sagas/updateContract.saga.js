import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* updateContract(action){

    console.log('Here is the updated contract:', action.payload);
    
    try {
        const response = yield axios.put(`/api/contract/update_contract/${action.payload.contractID}`, action.payload) // How is this coming in to get both a body to send and params to use???
        yield put({ type: 'FETCH_CONTRACT_LIST', payload: response }) 
        yield put({ type: 'FETCH_CONTRACT_DETAILS', payload: response }) 
    } catch (error) {
        console.log('User get request failed', error);
    }
}

function* updateContractSaga(){
    yield takeEvery('UPDATE_CONTRACT', updateContract);
}

export default updateContractSaga;