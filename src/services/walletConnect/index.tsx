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
      provider: new MetamaskService({}),
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    const self = this;
    if (window.ethereum) {
      if (localStorage.yd_metamask) {
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
  }

  connect = async () => {
    if (window.ethereum) {
      try {
        const { address } = await this.state.provider.connect();

        if (!localStorage.yd_address) {
          const metMsg: any = await accountsApi.getMsg();

          const signedMsg = await this.state.provider.signMsg(metMsg.data);

          const login: any = await accountsApi.login({
            address,
            msg: metMsg.data,
            signed_msg: signedMsg,
          });

          localStorage.yd_token = login.data.key;
          localStorage.yd_address = address;
          rootStore.user.setAddress(address);
          localStorage.yd_metamask = true;
          // rootStore.user.update({ address });
        } else {
          rootStore.user.setAddress(address);
          localStorage.yd_metamask = true;
          // rootStore.user.update({ address });
        }
      } catch (err) {
        const { response } = err;
        if (response) {
          if ((400 === response.status) && ('user is not admin' === response.data.result[0])) {
            localStorage.yd_isAdmin = false;
            const { address } = await this.state.provider.connect();
            localStorage.yd_address = address;
            rootStore.user.setAddress(address);
            localStorage.yd_metamask = true;
            rootStore.user.update({ address });
          } else {
            rootStore.modals.metamask.setErr(err.message);
            this.disconnect();
          }
        } else {
          rootStore.modals.metamask.setErr(err.message);
          this.disconnect();
        }
        console.log(response);
      }
    } else {
      rootStore.modals.metamask.setErr('No Metamask (or other Web3 Provider) installed');
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
