import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { rootStore } from '../../store/store';
import { accountsApi } from '../api';
import MetamaskService from '../web3';
// import { userApi } from '../api';

const walletConnectorContext = createContext<any>({
  metamaskService: {},
  connect: (): void => {},
});

@observer
class Connector extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      provider: new MetamaskService({
        testnet: 'bnbt',
      }),
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    const self = this;
    if (localStorage.yd_metamsk) {
      this.connect();
    }
    this.state.provider.chainChangedObs.subscribe({
      next(err: string) {
        rootStore.modals.metamask.setErr(err);
      },
    });

    this.state.provider.accountChangedObs.subscribe({
      next() {
        self.disconnect();
      },
    });
  }

  connect = async () => {
    try {
      const { address } = await this.state.provider.connect();

      if (!localStorage.yd_token) {
        const metMsg: any = await accountsApi.getMsg();

        const signedMsg = await this.state.provider.signMsg(metMsg.data);

        const login: any = await accountsApi.login({
          address,
          msg: metMsg.data,
          signed_msg: signedMsg,
        });

        localStorage.yd_token = login.data.key;
        rootStore.user.setAddress(address);
        localStorage.yd_metamask = true;
      } else {
        rootStore.user.setAddress(address);
        localStorage.yd_metamask = true;
      }
    } catch (err) {
      const { response } = err;
      /* if(response.status===400&&response.data.result[0]==='user is not admin'){
        localStorage.yd_isAdmin = false;
        const { address } = await this.state.provider.connect();
        rootStore.user.setAddress(address);
        localStorage.yd_metamask = true;
      }else{ */
      rootStore.modals.metamask.setErr(err.message);
      this.disconnect();
      // }
      console.log(response);
    }
  };

  disconnect = () => {
    rootStore.user.disconnect();
  };

  render() {
    return (
      <walletConnectorContext.Provider
        value={{
          metamaskService: this.state.provider,
          connect: this.connect,
          disconnect: this.disconnect,
        }}
      >
        {this.props.children}
      </walletConnectorContext.Provider>
    );
  }
}

export default withRouter(Connector);

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}
