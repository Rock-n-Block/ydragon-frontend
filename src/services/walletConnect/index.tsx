import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react';
import { accountsApi } from '../api';
import { WalletConnect } from '../walletService';
import { rootStore } from '../../store/store';
import { chainsEnum } from '../../types';
import config from '../../config';

declare global {
  interface Window {
    ethereum: any;
  }
}
const { IS_PRODUCTION } = config;
const walletConnectorContext = createContext<{
  connect: (chainName: chainsEnum, providerName: 'MetaMask' | 'WalletConnect') => void;
  disconnect: () => void;
  walletService: WalletConnect;
}>({
  connect: (): void => {},
  disconnect: (): void => {},
  walletService: new WalletConnect(),
});

@observer
class Connector extends React.Component<
  any,
  {
    provider: WalletConnect;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      provider: new WalletConnect(),
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    if (window.ethereum) {
      if (localStorage.ydr_chainName && localStorage.ydr_providerName) {
        this.connect(localStorage.ydr_chainName, localStorage.ydr_providerName);
      }
    }
  }

  connect = async (chainName: chainsEnum, providerName: 'MetaMask' | 'WalletConnect') => {
    if (window.ethereum) {
      try {
        const isConnected = await this.state.provider.initWalletConnect(
          chainName,
          providerName as any,
        );
        if (isConnected) {
          this.state.provider
            .getAccount()
            .then(async (userAccount: any) => {
              if (rootStore.user.address && userAccount.address !== rootStore.user.address) {
                this.disconnect();
              } else {
                this.state.provider.setAccountAddress(userAccount.address);
                if (!localStorage.ydr_address) {
                  const metMsg: any = await accountsApi.getMsg();
                  const signedMsg = await this.state.provider.connectWallet.signMsg(
                    userAccount.address,
                    metMsg.data,
                  );

                  await accountsApi
                    .login({
                      address: userAccount.address,
                      msg: metMsg.data,
                      signed_msg: signedMsg,
                    })
                    .then(({ data }) => {
                      localStorage.ydr_token = data.key;
                      rootStore.user.setToken(data.key);
                      toast.info('Logged in as admin');
                    })
                    .catch((error) => {
                      const { response } = error;
                      if (
                        response &&
                        response.status === 400 &&
                        response.data.result[0] === 'user is not admin'
                      )
                        toast.info('Logged in as user');
                    });
                }
                localStorage.ydr_chainName = chainName;
                localStorage.ydr_providerName = providerName;
                localStorage.ydr_address = userAccount.address;
                rootStore.user.setAddress(userAccount.address);
              }
            })
            .catch((err: any) => {
              console.error('getAccount wallet connect - get user account err: ', err);
              if (!(err.code && err.code === 6)) {
                this.disconnect();
              }
              toast.error(
                `Wrong Network, please select ${chainName} ${
                  IS_PRODUCTION ? 'mainnet' : 'testnet'
                } network in your wallet and try again`,
              );
            });
        }
      } catch (err) {
        console.error(err);
        this.disconnect();
      }
    }
  };

  disconnect() {
    rootStore.user.disconnect();
    // delete localStorage.ydr_chainName;
    delete localStorage.ydr_providerName;
    delete localStorage.walletconnect;
    delete localStorage.ydr_token;
    delete localStorage.ydr_address;

    this.props.history.push('/');
  }

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
