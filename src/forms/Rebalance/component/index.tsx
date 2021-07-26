import React, { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import { Button, Input, Search, TokenMini } from '../../../components';
import { IToken } from '../../../components/IndexPage/IndexTable';
import { ISearchToken } from '../../../components/Search';
import { ITokensDiff } from '../../../pages/Admin';
import { coinsApi, indexesApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import DangerCircle from '../../../assets/img/icons/icon-danger-circle.svg';

interface IIndexId {
  indexId: string;
}
export interface IRebalance {
  index: { name: string };
  tokens: Array<ITokensDiff>;
  days: number | string;
  hours: number | string;
  steps: number | string;
  isLoading?: boolean;
}

const Rebalance: React.FC<FormikProps<IRebalance> & IRebalance> = observer(
  ({ setFieldValue, handleChange, handleBlur, values, handleSubmit }) => {
    const { modals } = useMst();
    const { indexId } = useParams<IIndexId>();
    const [searchTokens, setSearchTokens] = useState<ISearchToken[]>([] as ISearchToken[]);
    const [newTokenName, setNewTokenName] = useState<string>('');
    const weightsSum = values.tokens
      .map((tokenDiff) => +tokenDiff.new_weight)
      .reduce((prevSum, newItem) => prevSum.plus(newItem), new BigNumber(0))
      .toString(10);
    const handleNewTokenNameChange = (tokenName: string) => {
      if (tokenName.length >= 3) {
        coinsApi
          .getCoinsList(tokenName)
          .then(({ data }) => {
            setSearchTokens(data);
          })
          .catch((error) => {
            const { response } = error;
            console.log('search error', response);
          });
      } else {
        setSearchTokens([] as ISearchToken[]);
      }
    };
    const handleRemove = (arrayHelper: FieldArrayRenderProps, index: number) => {
      indexesApi
        .removeTokenFromIndex(+indexId, values.tokens[index].id)
        .then(() => {
          if (!values.tokens[index].pending) {
            setFieldValue(`tokens[${index}].to_delete`, !values.tokens[index].to_delete);
            setFieldValue(`tokens[${index}].new_weight`, 0);
          } else {
            arrayHelper.remove(index);
          }
        })
        .catch((error: ProviderRpcError) => {
          const { message } = error;
          modals.info.setMsg('Error', `Remove token error ${message}`, 'error');
        });
    };
    const handleAddBack = (arrayHelper: FieldArrayRenderProps, index: number) => {
      indexesApi
        .addTokenBackToIndex(+indexId, values.tokens[index].id)
        .then(({ data }) => {
          setFieldValue(`tokens[${index}].to_delete`, !values.tokens[index].to_delete);
          setFieldValue(
            `tokens[${index}].new_weight`,
            new BigNumber(data.new_weight).multipliedBy(100),
          );
        })
        .catch((error: ProviderRpcError) => {
          const { message } = error;
          modals.info.setMsg('Error', `Add token back error ${message}`, 'error');
        });
    };
    const handleAddNewToken = (arrayHelper: FieldArrayRenderProps, pickedItem: ISearchToken) => {
      indexesApi
        .addTokenToIndex(+indexId, pickedItem.symbol)
        .then(({ data }) => {
          arrayHelper.push({
            to_delete: false,
            new_weight: '0',
            pending: true,
            id: data.id,
            old_weight: '0',
            diff: 0,
            token: {
              name: pickedItem.name,
              symbol: pickedItem.symbol,
              image: pickedItem.image,
              address: pickedItem.address,
              id: 0,
            } as IToken,
          } as ITokensDiff);
        })
        .catch((error) => {
          const { response } = error;
          console.log('add new token error', response);
        });
    };
    const handleInput = (e: any) => {
      if (+e.target.value < 0) {
        e.target.value = '';
      }
      handleChange(e);
    };
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTokenName(e.target.value);
      handleNewTokenNameChange(e.target.value);
    };
    const handleClear = () => {
      setNewTokenName('');
      handleNewTokenNameChange('');
    };
    return (
      <Form name="form-rebalance" className="form-rebalance">
        <FieldArray
          name="tokens"
          render={(arrayHelper) => (
            <div className="rebalance-items token-weights">
              <div className="token-weights-items__head">
                <div className="token-weights-items__head-col">Weight%</div>
              </div>
              {values.tokens && values.tokens.length > 0 ? (
                values.tokens?.map((tokenDiff, index) => (
                  <div className="token-weights-item" key={`token ${tokenDiff.token.name}`}>
                    <div className="token-weights-item__info">
                      <TokenMini
                        icon={tokenDiff.token.image}
                        name={tokenDiff.token.name}
                        symbol={tokenDiff.token.symbol}
                      />
                    </div>

                    <div className="token-weights-item__input-wrapper">
                      <Input
                        disabled={tokenDiff.to_delete}
                        name={`tokens[${index}].new_weight`}
                        value={tokenDiff.new_weight !== '0' ? tokenDiff.new_weight : ''}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        type="number"
                        placeholder="0"
                        className="token-weights-item__input-token"
                        error={+tokenDiff.new_weight > 100}
                      />
                    </div>

                    {!tokenDiff.to_delete ? (
                      <Button
                        styledType="outline"
                        colorScheme="red"
                        className="token-weights-item__remove"
                        onClick={() => handleRemove(arrayHelper, index)}
                        disabled={values.tokens.length === 1}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        styledType="outline"
                        colorScheme="green"
                        className="token-weights-item__remove"
                        onClick={() => handleAddBack(arrayHelper, index)}
                        disabled={values.tokens.length === 1}
                      >
                        Add back
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <></>
              )}
              <div className="token-weights__total">
                <h3 className="token-weights__total-name">Total weight</h3>
                <div
                  className={`input-border weights-sum${
                    +weightsSum === 0 || +weightsSum === 100 ? '' : '--error'
                  }`}
                >
                  <span className="input">{+weightsSum > 0 ? weightsSum : '0'}</span>
                </div>
              </div>

              <Search
                className="token-weights__search"
                data={searchTokens}
                onChange={(e) => handleSearchChange(e)}
                newTokenName={newTokenName}
                handleClear={handleClear}
                onPick={(pickedToken: ISearchToken) => handleAddNewToken(arrayHelper, pickedToken)}
                // className="token-weights__search"
                // data={searchTokens}
                // onChange={(e) => handleNewTokenNameChange(e)}
                // onPick={(pickedToken: ISearchToken) => handleAddNewToken(arrayHelper, pickedToken)}
              />
            </div>
          )}
        />

        <div className="rebalance-options-row">
          <div className="rebalance-options-row__title">Rebalance options</div>

          <div className="rebalance-options">
            <div className="rebalance-option">
              <div className="rebalance-option__label">Days</div>
              <div className="rebalance-option__input-wrapper">
                <Input
                  name="days"
                  value={values.days}
                  onChange={handleInput}
                  onBlur={handleBlur}
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="rebalance-option">
              <div className="rebalance-option__label">Hours</div>
              <div className="rebalance-option__input-wrapper">
                <Input
                  name="hours"
                  value={values.hours}
                  onChange={handleInput}
                  onBlur={handleBlur}
                  type="number"
                  placeholder="0"
                  className="rebalance-option__input-hours"
                  error={values.hours > 23}
                />
              </div>
            </div>

            <div className="rebalance-option">
              <div className="rebalance-option__label">Steps</div>
              <div className="rebalance-option__input-wrapper">
                <Input
                  name="steps"
                  value={values.steps}
                  onChange={handleInput}
                  onBlur={handleBlur}
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="token-weights-items__empty">
          <img src={DangerCircle} alt="alert" width="20" height="20" />
          <span>
            Do not start rebalance if you don&apos;t have enough tokens on yVault, otherwise your
            index token with a high probability will become forbidden.
          </span>
        </div>

        <div className="rebalance-modal__btn-row">
          <Button onClick={() => handleSubmit()} loading={values.isLoading}>
            Start rebalance
          </Button>
        </div>
      </Form>
    );
  },
);

export default Rebalance;
