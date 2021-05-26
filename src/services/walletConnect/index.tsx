import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import MetamaskService from '../web3';
import { rootStore } from '../../store/store';
import { userApi } from '../api';

const walletConnectorContext = createContext<any>({
  MetamaskService: {},
  connect: (): void => {
  },
});

@observer
class Connector extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      provider: new MetamaskService({
        testnet: 'kovan',
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
        const metMsg: any = await userApi.getMsg();// TODO:change on backend endpoints

        const signedMsg = await this.state.provider.signMsg(metMsg.data);

        const login: any = await userApi.login({
          address,
          msg: metMsg.data,
          signedMsg,
        });

        localStorage.yd__token = login.data.key;
        rootStore.user.setAddress(address);
        localStorage.yd__metamask = true;

      } else {
        rootStore.user.setAddress(address);
        localStorage.yd__metamask = true;
      }
      await rootStore.user.getMe();
    } catch (err) {
      rootStore.modals.metamask.setErr(err.message);
      this.disconnect();
    }
  };

  disconnect=()=>{
    rootStore.user.disconnect();
  }

  render() {
    return (
      <walletConnectorContext.Provider
        value={{
          metamaskService: this.state.provider,
          connect: this.connect,
          disconnect: this.disconnect(),
        }}>
        {this.props.children}
      </walletConnectorContext.Provider>
    );
  }
}

export default withRouter(Connector);

export function useWalletConnectorContext(){
  return useContext(walletConnectorContext);
}
