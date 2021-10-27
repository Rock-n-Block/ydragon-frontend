import axios from '../../core/axios';

interface ILogin {
  address: string;
  signed_msg: string;
  msg: string;
}

export default {
  getMsg: () => axios.get('accounts/get_metamask_message/'),
  login: (data: ILogin) =>
    axios.post('accounts/metamask_login/', {
      address: data.address,
      signed_msg: data.signed_msg,
      msg: data.msg,
    }),
};
