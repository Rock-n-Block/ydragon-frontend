import React from 'react';
import { observer } from 'mobx-react-lite';

import bnb from '../../../assets/img/tokens/bnb.svg';
import btc from '../../../assets/img/tokens/btc.svg';
import eth from '../../../assets/img/tokens/eth.svg';
import { useMst } from '../../../store/store';
import { Button, Input, Modal } from '../../index';

import './RebalanceModal.scss';

const RebalanceModal: React.FC = observer(() => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.rebalance.close();
  };
  return (
    <Modal
      isVisible={modals.rebalance.isOpen}
      className="m-rebalance"
      handleCancel={handleClose}
      closeIcon
      width={800}
    >
      <div className="m-rebalance__content">
        <div className="rebalance-modal-wrapper">
          <div className="rebalance-modal">
            <div className="rebalance-modal__close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M18 9A9 9 0 110 9a9 9 0 0118 0zM4.293 13.707a1 1 0 010-1.414L7.586 9 4.293 5.707a1 1 0 011.414-1.414L9 7.586l3.293-3.293a1 1 0 111.414 1.414L10.414 9l3.293 3.293a1 1 0 01-1.414 1.414L9 10.414l-3.293 3.293a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="rebalance-modal__title">Rebalance</div>

            <div className="rebalance-items">
              <div className="rebalance-items__head">
                <div className="rebalance-items__head-col">Weight, %</div>
                <div className="rebalance-items__head-col">Buy</div>
                <div className="rebalance-items__head-col">Sell</div>
              </div>

              <div className="rebalance-item">
                <div className="rebalance-item__info">
                  <img src={btc} alt="" width="36" height="36" className="rebalance-item__icon" />

                  <div className="rebalance-item__name-wrapper">
                    <div className="rebalance-item__name">Bitcoin</div>
                    <div className="rebalance-item__abbr">BTC</div>
                  </div>
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0.0" />
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0" />
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0" />
                </div>

                <Button
                  styledType="outline"
                  colorScheme="orange"
                  background="gray"
                  borderSize="lg"
                  className="rebalance-item__remove"
                >
                  Remove
                </Button>
              </div>
              <div className="rebalance-item">
                <div className="rebalance-item__info">
                  <img src={bnb} alt="" width="36" height="36" className="rebalance-item__icon" />

                  <div className="rebalance-item__name-wrapper">
                    <div className="rebalance-item__name">Binance</div>
                    <div className="rebalance-item__abbr">BNB</div>
                  </div>
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0.0" />
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0" />
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0" />
                </div>

                <Button
                  styledType="outline"
                  colorScheme="orange"
                  background="gray"
                  borderSize="lg"
                  className="rebalance-item__remove"
                >
                  Remove
                </Button>
              </div>
              <div className="rebalance-item">
                <div className="rebalance-item__info">
                  <img src={eth} alt="" width="36" height="36" className="rebalance-item__icon" />

                  <div className="rebalance-item__name-wrapper">
                    <div className="rebalance-item__name">Ethereum</div>
                    <div className="rebalance-item__abbr">ETH</div>
                  </div>
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0.0" />
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0" />
                </div>

                <div className="rebalance-item__input-wrapper">
                  <Input val="0" />
                </div>

                <Button
                  styledType="outline"
                  colorScheme="orange"
                  background="gray"
                  borderSize="lg"
                  className="rebalance-item__remove"
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="rebalance-add-token">
              <input type="text" placeholder="Name token" className="rebalance-add-token__input" />

              <Button
                styledType="outline"
                colorScheme="green"
                background="white"
                borderSize="lg"
                className="rebalance-add-token__btn"
              >
                Add Token
              </Button>
            </div>

            <div className="rebalance-options-row">
              <div className="rebalance-options-row__title">Rebalance options</div>

              <div className="rebalance-option">
                <div className="rebalance-option__label">Days</div>
                <div className="rebalance-option__input-wrapper">
                  <Input val="30" />
                </div>
              </div>

              <div className="rebalance-option">
                <div className="rebalance-option__label">Hours</div>
                <div className="rebalance-option__input-wrapper">
                  <Input val="30" />
                </div>
              </div>
            </div>

            <div className="rebalance-modal__btn-row">
              <Button>Start rebalance</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default RebalanceModal;
