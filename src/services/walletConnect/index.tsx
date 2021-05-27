import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import MetamaskService from '../web3';
import { rootStore } from '../../store/store';
// import { userApi } from '../api';

const walletConnectorContext = createContext<any>({
  MetamaskService: {},
  connect: (): void => {},
});

@observer
class Connector extends React.Component<any, any> {
  constructor(props:any) {
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


      rootStore.user.setAddress(address);
      localStorage.yd__metamask = true;

    } catch (err) {
      console.log(err)
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
          disconnect: this.disconnect,
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
