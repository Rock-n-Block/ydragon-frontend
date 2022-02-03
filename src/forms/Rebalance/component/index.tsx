import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import DangerCircle from '../../../assets/img/icons/icon-danger-circle.svg';
import { Button, Input, Search, TokenMini } from '../../../components';
import { IToken } from '../../../components/IndexPage/IndexTable';
import { ISearchToken } from '../../../components/Search';
import { ITokensDiff } from '../../../pages/Admin';
import { coinsApi } from '../../../services/api';

// interface IIndexId {
//   indexId: string;
// }
export interface IRebalance {
  tokens: Array<ITokensDiff>;
  isLoading?: boolean;
}

const Rebalance: React.FC<FormikProps<IRebalance> & IRebalance> = observer(
  ({ handleChange, handleBlur, values, handleSubmit }) => {
    // const { indexId } = useParams<IIndexId>();
    const [searchTokens, setSearchTokens] = useState<ISearchToken[]>([] as ISearchToken[]);
    const [newTokenName, setNewTokenName] = useState<string>('');
    const weightsSum = useMemo(
      () =>
        values.tokens
          .map((tokenDiff) => +tokenDiff.new_weight)
          .reduce((prevSum, newItem) => prevSum.plus(newItem), new BigNumber(0))
          .toString(10),
      [values.tokens],
    );
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(true);
    const handleNewTokenNameChange = (tokenName: string) => {
      if (tokenName.length >= 3) {
        coinsApi
          .getCoinsList(tokenName)
          .then(({ data }) => {
            setSearchTokens(data);
          })
          .catch((error) => {
            const { response } = error;
            console.error('search error', response);
          });
      } else {
        setSearchTokens([] as ISearchToken[]);
      }
    };
    const handleRemove = (arrayHelper: FieldArrayRenderProps, index: number) => {
      arrayHelper.remove(index);
    };
    // const handleAddBack = (arrayHelper: FieldArrayRenderProps, index: number) => {
    //   indexesApi
    //     .addTokenBackToIndex(+indexId, values.tokens[index].id)
    //     .then(({ data }) => {
    //       setFieldValue(`tokens[${index}].to_delete`, !values.tokens[index].to_delete);
    //       setFieldValue(
    //         `tokens[${index}].new_weight`,
    //         new BigNumber(data.new_weight).multipliedBy(100),
    //       );
    //     })
    //     .catch((error: ProviderRpcError) => {
    //       const { message } = error;
    //       toast.error(`Add token back error ${message}`);
    //     });
    // };
    const handleAddNewToken = (arrayHelper: FieldArrayRenderProps, pickedItem: ISearchToken) => {
      const isUnique = !values.tokens.find((item: any) => item.token.name === pickedItem.name);
      if (isUnique) {
        const newId = values.tokens[values.tokens.length - 1].id + 1;
        arrayHelper.push({
          to_delete: false,
          new_weight: '0',
          pending: true,
          id: newId,
          old_weight: '0',
          diff: 0,
          token: {
            name: pickedItem.name,
            symbol: pickedItem.symbol,
            image: pickedItem.image,
            address: pickedItem.address,
            id: newId,
          } as IToken,
        } as ITokensDiff);
      }
    };
    const handleChangeInput = (e: any) => {
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
    useEffect(() => {
      if (+weightsSum === 100) {
        setIsBtnDisabled(false);
      } else setIsBtnDisabled(true);
    }, [weightsSum]);

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
                        onChange={handleChangeInput}
                        onBlur={handleBlur}
                        type="number"
                        placeholder="0"
                        className="token-weights-item__input-token"
                        error={+tokenDiff.new_weight > 100}
                      />
                    </div>

                    <Button
                      styledType="outline"
                      colorScheme="red"
                      className="token-weights-item__remove"
                      onClick={() => handleRemove(arrayHelper, index)}
                      disabled={values.tokens.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <></>
              )}
              <div className="token-weights__total">
                <h3 className="token-weights__total-name">Total weight</h3>
                <div className={`input-border weights-sum${!isBtnDisabled ? '' : '--error'}`}>
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
              />
            </div>
          )}
        />

        <div className="token-weights-items__empty">
          <img src={DangerCircle} alt="alert" width="20" height="20" />
          <span>
            Do not start rebalance if you don&apos;t have enough tokens on yVault, otherwise your
            index token with a high probability will become forbidden.
          </span>
        </div>

        <div className="rebalance-modal__btn-row">
          <Button
            disabled={isBtnDisabled}
            onClick={() => handleSubmit()}
            loading={values.isLoading}
          >
            Start rebalance
          </Button>
        </div>
      </Form>
    );
  },
);

export default Rebalance;
