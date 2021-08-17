import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { rootStore } from '../../store/store';
import { accountsApi } from '../api';
import WalletService, { WALLET_TYPE } from '../web3';
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
    const walletType = sessionStorage.getItem('yd_wallet');
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

      try {
        if (!sessionStorage.getItem('yd_address')) {
          const metMsg: any = await accountsApi.getMsg();

          const signedMsg = await this.state.provider.signMsg(metMsg.data);
          console.log(signedMsg);

          const login: any = await accountsApi.login({
            address,
            msg: metMsg.data,
            signed_msg: signedMsg,
          });

          sessionStorage.setItem('yd_token', login.data.key);
          sessionStorage.setItem('yd_address', address);
          rootStore.user.setAddress(address);
          sessionStorage.setItem('yd_wallet', walletType);
          // rootStore.user.update({ address });
        } else {
          rootStore.user.setAddress(address);
          sessionStorage.setItem('yd_wallet', walletType);
          // rootStore.user.update({ address });
        }
      } catch (err) {
        const { response } = err;
        if (
          response &&
          response.status === 400 &&
          response.data.result[0] === 'user is not admin'
        ) {
          sessionStorage.setItem('yd_isAdmin', 'false');
          sessionStorage.setItem('yd_address', address);
          rootStore.user.setAddress(address);
          sessionStorage.setItem('yd_wallet', walletType);
          rootStore.user.update({ address });
        } else {
          throw err;
        }
      }
    } catch (err) {
      rootStore.modals.metamask.setErr(err.message);
      this.disconnect();
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
