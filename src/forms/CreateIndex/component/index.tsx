import React, { useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import DangerCircle from '../../../assets/img/icons/icon-danger-circle.svg';
import { Button, Input, RangePicker, Search, TextArea, TokenMini } from '../../../components';
// import { InputNumber } from '../../../components/Input';
import { IToken } from '../../../components/IndexPage/IndexTable';
import { ISearchToken } from '../../../components/Search';
import { ITokensDiff } from '../../../pages/Admin';
import { coinsApi } from '../../../services/api';
import { EventValue } from 'rc-picker/lib/interface';

export interface ICreateIndex {
  name: string;
  symbol: string;
  dateRange: [EventValue<any>, EventValue<any>] | null;
  description: string;
  tokens: Array<ITokensDiff>;
  isLoading?: boolean;
}

const CreateIndex: React.FC<FormikProps<ICreateIndex> & ICreateIndex> = observer(
  ({ setFieldValue, handleChange, handleBlur, values, handleSubmit }) => {
    const [searchTokens, setSearchTokens] = useState<ISearchToken[]>([] as ISearchToken[]);
    const [validation, setValidation] = useState<any>({
      name: true,
      symbol: true,
    });
    const onBlurHandler = (value: string) => {
      switch (value) {
        case 'name':
          if (!values.name) {
            setValidation((prevState: any) => ({
              ...prevState,
              name: false,
            }));
          }
          break;
        case 'symbol':
          if (!values.symbol) {
            setValidation((prevState: any) => ({
              ...prevState,
              symbol: false,
            }));
          }
          break;
        default:
          break;
      }
    };

    const onChangeHandler = (e: any, value: string) => {
      switch (value) {
        case 'name':
          setValidation((prevState: any) => ({
            ...prevState,
            name: true,
          }));
          break;
        case 'symbol':
          setValidation((prevState: any) => ({
            ...prevState,
            symbol: true,
          }));
          break;
        default:
          break;
      }
      handleChange(e);
    };
    const onTokenInputHandler = (e: any) => {
      if (+e.target.value < 0) {
        e.target.value = '';
      }
      handleChange(e);
    };
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
        if (moment().diff(value[0]) > 0) {
          if (value[1]) {
            if (moment().diff(value[1]) > 0) {
              // TODO: обсудить количество добавленных минут перед деплоем
              setFieldValue('dateRange', [moment().add(3, 'minutes'), '']);
            } else {
              setFieldValue('dateRange', [moment().add(3, 'minutes'), value[1]]);
            }
          }
        } else {
          setFieldValue('dateRange', [value[0], value[1]]);
        }
      } else {
        setFieldValue('dateRange', ['', '']);
      }
    };

    /*  const onRangePickerChange = (value: any, dateString: any) => {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    }; */
    return (
      <Form name="form-create-index" className="form-create-index">
        <div className="form-create-index__inputs">
          <div className="form-create-index__input">
            <p className="form-create-index__input-label">Name</p>
            <Input
              name="name"
              placeholder="Enter index name"
              value={values.name}
              onChange={(e) => onChangeHandler(e, 'name')}
              onBlur={() => onBlurHandler('name')}
              className="form-create-index__input-name"
              error={!validation.name}
            />
          </div>
          <div className="form-create-index__input">
            <p className="form-create-index__input-label">Symbol</p>
            <Input
              name="symbol"
              placeholder="BTC"
              value={values.symbol}
              onChange={(e) => onChangeHandler(e, 'symbol')}
              onBlur={() => onBlurHandler('symbol')}
              className="form-create-index__input-symbol"
              error={!validation.symbol}
            />
          </div>
        </div>
        <RangePicker
          value={values.dateRange}
          disabledDate={disabledDate}
          showTime={{
            hideDisabledOptions: true,
          }}
          format="DD.MM.YY HH:mm"
          onOk={onOk}
        />
        <TextArea
          autoSize={{ minRows: 2 }}
          placeholder="Please enter description, you can't do it later"
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
                            value={tokenDiff.new_weight === '0' ? '' : tokenDiff.new_weight}
                            onChange={(e) => onTokenInputHandler(e)}
                            onBlur={handleBlur}
                            placeholder="0"
                            type="number"
                            className="token-weights-item__input-token"
                            error={+tokenDiff.new_weight > 100}
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
                    <div
                      className={`input-border weights-sum${
                        +weightsSum === 0 || +weightsSum === 100 ? '' : '--error'
                      }`}
                    >
                      <span className="input">{+weightsSum > 0 ? weightsSum : '0'}</span>
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
              values.tokens.length === 0 ||
              weightsSum !== '100' ||
              values.name === '' ||
              values.symbol === '' ||
              values.dateRange === null ||
              values.dateRange[0] === '' ||
              values.dateRange[1] === ''
            }
            loading={values.isLoading}
          >
            Create
          </Button>
        </div>
      </Form>
    );
  },
);

export default CreateIndex;
