import axios from '../../core/axios';

interface ILogin {
  address: string;
  signedMsg: string;
  msg: string;
}

export default {
  login:(data:ILogin)=>axios.post('account/metamask_login',{
    address:data.address,
    signedMsg:data.signedMsg,
    msg:data.msg,
  }),
}
