import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* addField(action) {
  try {
    const response = yield axios.post(`/api/field/makefield`, action.payload);
    yield put({ type: 'FETCH_FIELD_LIST', payload: action.payload });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* addFieldSaga() {
  yield takeEvery('SET_FIELD', addField);
}

export default addFieldSaga;
