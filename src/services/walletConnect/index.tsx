import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { rootStore } from '../../store/store';
import WalletService, { WALLET_TYPE } from '../web3';
import { accountsApi } from '../api';
// import { userApi } from '../api';

const walletConnectorContext = createContext<any>({
  walletService: {},
  connect: (): void => {},
});

@observer
class Connector extends React.Component<any, any> {
  private static isWalletType(walletType: string): walletType is WALLET_TYPE {
    return (Object.values(WALLET_TYPE) as any[]).includes(walletType);
  }

  constructor(props: any) {
    super(props);

    this.state = {
      provider: new WalletService(),
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    const self = this;
    const walletType = localStorage.getItem('yd_wallet');
    if (walletType && Connector.isWalletType(walletType)) {
      this.connect(walletType);
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

  connect = async (walletType: WALLET_TYPE) => {
    try {
      const { address } = await this.state.provider.connect(walletType);

      if (!localStorage.getItem('yd_address')) {
        const metMsg: any = await accountsApi.getMsg();

        const signedMsg = await this.state.provider.signMsg(metMsg.data);

        const login: any = await accountsApi.login({
          address,
          msg: metMsg.data,
          signed_msg: signedMsg,
        });
        localStorage.setItem('yd_token', login.data.key);
        rootStore.user.setToken(login.data.key);

        localStorage.setItem('yd_wallet', walletType);
        localStorage.setItem('yd_address', address);
        rootStore.user.setAddress(address);
        localStorage.setItem('yd_metamask', 'true');
        // rootStore.user.update({ address });
      } else {
        rootStore.user.setAddress(address);
        const yd_token = localStorage.getItem('yd_token') || '';
        rootStore.user.setToken(yd_token);
        localStorage.setItem('yd_wallet', walletType);
        localStorage.setItem('yd_metamask', 'true');
        // rootStore.user.update({ address });
      }
    } catch (err: any) {
      const { response } = err;
      if (response) {
        if (response.status === 400 && response.data.result[0] === 'user is not admin') {
          localStorage.setItem('yd_isAdmin', 'false');
          const { address } = await this.state.provider.connect(walletType);
          localStorage.setItem('yd_address', address);
          rootStore.user.setAddress(address);
          localStorage.setItem('yd_metamask', 'true');
          localStorage.setItem('yd_wallet', walletType);
          rootStore.user.update({ address });
        } else {
          throw err;
        }
      } else {
        rootStore.modals.metamask.setErr(err.message);
        this.disconnect();
      }
    }
  };

  disconnect = () => {
    rootStore.user.disconnect();
  };

  render() {
    return (
      <walletConnectorContext.Provider
        value={{
          walletService: this.state.provider,
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
