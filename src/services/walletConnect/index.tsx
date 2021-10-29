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
      provider: new MetamaskService(),
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    const self = this;
    if (window.ethereum) {
      if (localStorage.getItem('yd_metamask')) {
        this.connect();
      }
      this.state.provider.chainChangedObs.subscribe({
        next(err: string) {
          if (err) {
            self.disconnect();
            rootStore.modals.metamask.setErr(err);
          } else {
            window.location.reload();
          }
        },
      });

      this.state.provider.accountChangedObs.subscribe({
        next() {
          self.disconnect();
        },
      });
      this.state.provider.disconnectObs.subscribe({
        next(reason: string) {
          console.log('disconnect', reason);
        },
      });
    }
  }

  connect = async () => {
    if (window.ethereum) {
      try {
        const { address } = await this.state.provider.connect();

        if (!localStorage.getItem('yd_address')) {
          const metMsg: any = await accountsApi.getMsg();

          const signedMsg = await this.state.provider.signMsg(metMsg.data);

          const login: any = await accountsApi.login({
            address,
            msg: metMsg.data,
            signed_msg: signedMsg,
          });

          localStorage.setItem('yd_token', login.data.key);
          localStorage.setItem('yd_address', address);
          rootStore.user.setAddress(address);
          localStorage.setItem('yd_metamask', 'true');
          // rootStore.user.update({ address });
        } else {
          rootStore.user.setAddress(address);
          localStorage.setItem('yd_metamask', 'true');
          // rootStore.user.update({ address });
        }
      } catch (err: any) {
        const { response } = err;
        if (response) {
          if (response.status === 400 && response.data.result[0] === 'user is not admin') {
            localStorage.setItem('yd_isAdmin', 'false');
            const { address } = await this.state.provider.connect();
            localStorage.setItem('yd_address', address);
            rootStore.user.setAddress(address);
            localStorage.setItem('yd_metamask', 'true');
            rootStore.user.update({ address });
          } else {
            rootStore.modals.metamask.setErr(err.message);
            this.disconnect();
          }
        } else {
          rootStore.modals.metamask.setErr(err.message);
          this.disconnect();
        }
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
