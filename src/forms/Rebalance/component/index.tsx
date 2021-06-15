import React from 'react';
import nextId from 'react-id-generator';
import { FieldArray, Form, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import { Button, Input } from '../../../components';
import { ITokensDiff } from '../../../pages/Admin';

export interface IRebalance {
  index: { name: string };
  tokens: Array<ITokensDiff>;
  days: number | string;
  hours: number | string;
  steps: number | string;
  isLoading?: boolean;
}

const Rebalance: React.FC<FormikProps<IRebalance> & IRebalance> = observer(
  ({ handleChange, handleBlur, values, handleSubmit }) => {
    const weightsSum = values.tokens
      .map((tokenDiff) => +tokenDiff.new_weight)
      .reduce((prevSum, newItem) => prevSum + newItem, 0);
    return (
      <Form name="form-rebalance" className="form-rebalance">
        <FieldArray
          name="tokens"
          render={() => (
            <div className="rebalance-items">
              <div className="rebalance-items__head">
                <div className="rebalance-items__head-col">Weight%</div>
              </div>
              {values.tokens && values.tokens.length > 0 ? (
                values.tokens?.map((tokenDiff, index) => (
                  <div className="rebalance-item" key={nextId()}>
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
          <input type="text" placeholder="Name token" className="rebalance-add-token__input" />

          <Button
            styledType="outline"
            colorScheme="green"
            background="white"
            className="rebalance-add-token__btn"
          >
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
