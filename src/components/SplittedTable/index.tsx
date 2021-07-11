import React from 'react';
import nextId from 'react-id-generator';

import TokenMini, { TokenMiniProps } from '../TokenMini';

import './SplittedTable.scss';

interface SplittedTableProps {
  columns: Array<ITableColumn>;
  data: Array<ITableData>;
}

export interface ITableColumn {
  name: string;
  unShow?: boolean;
}
export type ITableData = Array<number | string | TokenMiniProps>;

const SplittedTable: React.FC<SplittedTableProps> = ({ columns, data }) => {
  return (
    <div className="table-splitted">
      <section
        className="table-splitted__header"
        style={{ gridTemplateColumns: `repeat(${columns.length},1fr)` }}
      >
        {columns.map((column) => (
          <React.Fragment key={nextId()}>
            {!column.unShow ? <h3>{column.name}</h3> : <div />}
          </React.Fragment>
        ))}
      </section>
      <section className="table-splitted__body">
        {data.map((dataItem) => (
          <div
            className="table-splitted__row"
            key={nextId()}
            style={{ gridTemplateColumns: `repeat(${columns.length},1fr)` }}
          >
            {dataItem.map((dataCell) => (
              <div className="table-splitted__cell" key={nextId()}>
                {('string' === typeof dataCell) || ('number' === typeof dataCell) ? (
                  <>{dataCell}</>
                ) : (
                  <TokenMini name={dataCell.name} icon={dataCell.icon} symbol={dataCell.symbol} />
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
};

export default SplittedTable;
