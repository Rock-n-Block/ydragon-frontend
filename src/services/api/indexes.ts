import axios from '../../core/axios';

const instance=axios.create({
  headers:{
    common:{
      token:localStorage.yd_token??'',
    }
  }
})

export default {
  getIndexes:()=>instance.get('indexes/'),
}
