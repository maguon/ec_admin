import Swal from 'sweetalert2';
import {MainPanelActionType} from '../../types';
import {apiHost} from '../../config';

const httpUtil = require('../../utils/HttpUtils');

export const getTodayUserCount = () => async (dispatch) => {
    dispatch({type: MainPanelActionType.setTodayUserCount, payload: {}});
};