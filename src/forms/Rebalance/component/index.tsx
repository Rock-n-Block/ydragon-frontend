import React, { ChangeEvent, useState } from 'react';

import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import { Button, Input, Search } from '../../../components';
import { ITokensDiff } from '../../../pages/Admin';
import BigNumber from 'bignumber.js/bignumber';
import { coinsApi } from '../../../services/api';
import { ISearchToken } from '../../../components/Search';

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
    const [newTokenName, setNewTokenName] = useState<string>('');
    const [searchTokens, setSearchTokens] = useState<ISearchToken[]>([] as ISearchToken);
    const weightsSum = values.tokens
      .map((tokenDiff) => +tokenDiff.new_weight)
      .reduce((prevSum, newItem) => prevSum.plus(newItem), new BigNumber(0))
      .toString(10);
    const handleRemove = (arrayHelper: FieldArrayRenderProps, index: number) => {
      if (values.tokens[index].id) {
        setFieldValue(`tokens[${index}].to_delete`, !values.tokens[index].to_delete);
      } else {
        arrayHelper.remove(index);
      }
    };
    const handleNewTokenNameChange = (tokenName: string) => {
      if (tokenName.length >= 3) {
        coinsApi
          .getCoinsList(tokenName)
          .then(({ data }) => {
            console.log(`tokens with ${tokenName}`, data);
          })
          .catch((error) => {
            const { response } = error;
            console.log('search error', response);
          });
      }
    };
    const handleSearchPick = (pickedItem: ISearchToken) => {
      console.log(pickedItem);
    };
    return (
      <Form name="form-rebalance" className="form-rebalance">
        <FieldArray
          name="tokens"
          render={(arrayHelper) => (
            <div className="rebalance-items">
              <div className="rebalance-items__head">
                <div className="rebalance-items__head-col">Weight%</div>
              </div>
              {values.tokens && values.tokens.length > 0 ? (
                values.tokens?.map((tokenDiff, index) => (
                  <div className="rebalance-item" key={`token ${tokenDiff.token.name}`}>
                    <div className="rebalance-item__info">
                      <img
                        src={tokenDiff.token.image}
                        alt=""
                        width="36"
                        height="36"
                        className="rebalance-item__icon"
                      />

                      <div className="rebalance-item__name-wrapper">
                        <div className="rebalance-item__name">{tokenDiff.token.name}</div>
                        <div className="rebalance-item__abbr">{tokenDiff.token.symbol}</div>
                      </div>
                    </div>

                    <div className="rebalance-item__input-wrapper">
                      <Input
                        name={`tokens[${index}].new_weight`}
                        value={tokenDiff.new_weight}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    {!tokenDiff.to_delete ? (
                      <Button
                        styledType="outline"
                        colorScheme="orange"
                        background="gray"
                        borderSize="lg"
                        className="rebalance-item__remove"
                        onClick={() => handleRemove(arrayHelper, index)}
                        disabled={values.tokens.length === 1}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        styledType="outline"
                        colorScheme="orange"
                        background="gray"
                        borderSize="lg"
                        className="rebalance-item__remove"
                        onClick={() => handleRemove(arrayHelper, index)}
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
            </div>
          )}
        />
        <div className="rebalance__total">
          <h3 className="rebalance__total-name">Total weight</h3>
          <div className="input-border">
            <span className="input">{weightsSum}</span>
          </div>
        </div>

        <div className="rebalance-add-token">
          <input
            type="text"
            placeholder="Name token"
            value={newTokenName}
            onChange={()=>handleNewTokenNameChange}
            className="rebalance-add-token__input"
          />
          <Search onChange={(e) => handleNewTokenNameChange(e)} onPick={handleSearchPick} />
          <Button background="white" className="rebalance-add-token__btn">
            Add Token
          </Button>
        </div>

        <div className="rebalance-options-row">
          <div className="rebalance-options-row__title">Rebalance options</div>

          <div className="rebalance-options">
            <div className="rebalance-option">
              <div className="rebalance-option__label">Days</div>
              <div className="rebalance-option__input-wrapper">
                <Input
                  name="days"
                  value={values.days}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="rebalance-option">
              <div className="rebalance-option__label">Hours</div>
              <div className="rebalance-option__input-wrapper">
                <Input
                  name="hours"
                  value={values.hours}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="rebalance-option">
              <div className="rebalance-option__label">Steps</div>
              <div className="rebalance-option__input-wrapper">
                <Input
                  name="steps"
                  value={values.steps}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rebalance-modal__btn-row">
          <Button onClick={handleSubmit}>Start rebalance</Button>
        </div>
      </Form>
    );
  },
);

export default Rebalance;
