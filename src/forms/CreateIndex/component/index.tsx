import React, { useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import DangerCircle from '../../../assets/img/icons/icon-danger-circle.svg';
import { Button, Input, RangePicker, Search, TextArea, TokenMini } from '../../../components';
import { IToken } from '../../../components/IndexPage/IndexTable';
import { ISearchToken } from '../../../components/Search';
import { ITokensDiff } from '../../../pages/Admin';
import { coinsApi } from '../../../services/api';

export interface ICreateIndex {
  name: string;
  symbol: string;
  startDate: string;
  endDate: string;
  description: string;
  tokens: Array<ITokensDiff>;
  isLoading?: boolean;
}

const CreateIndex: React.FC<FormikProps<ICreateIndex> & ICreateIndex> = observer(
  ({ setFieldValue, handleChange, handleBlur, values, handleSubmit }) => {
    const [searchTokens, setSearchTokens] = useState<ISearchToken[]>([] as ISearchToken[]);

    const disabledDate = (current: any) => {
      // Can not select days before today and today
      return current && current < moment().startOf('day');
    };
    const weightsSum = values.tokens
      .map((tokenDiff) => +tokenDiff.new_weight)
      .reduce((prevSum, newItem) => prevSum.plus(newItem), new BigNumber(0))
      .toString(10);
    const handleNewTokenNameChange = (tokenName: string) => {
      if (tokenName.length >= 3) {
        coinsApi
          .getCoinsList(tokenName)
          .then(({ data }) => {
            console.log(`tokens with ${tokenName}`, data);
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
      arrayHelper.remove(index);
    };
    const handleAddNewToken = (arrayHelper: FieldArrayRenderProps, pickedItem: ISearchToken) => {
      const isDuplicate = values.tokens.find((token) => token.token.symbol === pickedItem.symbol);
      if (!isDuplicate) {
        arrayHelper.push({
          to_delete: false,
          new_weight: '0',
          pending: true,
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
      }
    };
    // rangepicker
    const onOk = (value: any[] | null) => {
      if (value) {
        setFieldValue('startDate', moment(value[0]).format('X'));
        setFieldValue('endDate', moment(value[1]).format('X'));
      } else {
        setFieldValue('startDate', '');
        setFieldValue('endDate', '');
      }
    };

    const onRangePickerChange = (value: any, dateString: any) => {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    };
    return (
      <Form name="form-create-index" className="form-create-index">
        <div className="form-create-index__inputs">
          <div className="form-create-index__input">
            <p className="form-create-index__input-label">Name</p>
            <Input
              name="name"
              placeholder="Enter index name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="form-create-index__input">
            <p className="form-create-index__input-label">Symbol</p>
            <Input
              name="symbol"
              placeholder="BTC"
              value={values.symbol}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
        <RangePicker
          disabledDate={disabledDate}
          showTime={{
            hideDisabledOptions: true,
          }}
          format="YYYY-MM-DD HH:mm"
          onChange={onRangePickerChange}
          onOk={onOk}
        />
        <TextArea
          autoSize={{ minRows: 2 }}
          placeholder="Enter description"
          className="form-create-index__description"
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FieldArray
          name="tokens"
          render={(arrayHelper) => (
            <div className="form-create-index-items token-weights">
              {values.tokens && values.tokens.length > 0 ? (
                <>
                  <div className="token-weights-items__head">
                    <div className="token-weights-items__head-col">Weight%</div>
                  </div>
                  {values.tokens?.map((tokenDiff, index) => (
                    <>
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
                            value={tokenDiff.new_weight}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                          />
                        </div>

                        <Button
                          styledType="outline"
                          colorScheme="red"
                          className="token-weights-item__remove"
                          onClick={() => handleRemove(arrayHelper, index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </>
                  ))}
                  <div className="token-weights__total">
                    <h3 className="token-weights__total-name">Total weight</h3>
                    <div className="input-border">
                      <span className="input">{weightsSum}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="token-weights-items__empty">
                  <img src={DangerCircle} alt="alert" />
                  <span>Please add tokens to the index</span>
                </div>
              )}

              <Search
                className="token-weights__search"
                data={searchTokens}
                onChange={(e) => handleNewTokenNameChange(e)}
                onPick={(pickedToken: ISearchToken) => handleAddNewToken(arrayHelper, pickedToken)}
              />
            </div>
          )}
        />

        <div className="form-create-index__btn-row">
          <Button
            onClick={() => handleSubmit()}
            disabled={
              values.isLoading ||
              values.tokens.length === 0 ||
              weightsSum !== '100' ||
              values.name === '' ||
              values.symbol === '' ||
              values.startDate === '' ||
              values.endDate === '' ||
              values.description === ''
            }
          >
            Create
          </Button>
        </div>
      </Form>
    );
  },
);

export default CreateIndex;
