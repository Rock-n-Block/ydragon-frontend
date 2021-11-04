import React, { PropsWithChildren } from 'react';
import { Table as TableAntd, TableProps } from 'antd';

const Table: React.FC<TableProps<any>> = (props: PropsWithChildren<TableProps<any>>) => {
  const { className, ...otherTableProps } = props;

  return (
    <div className={`table ${className || ''}`}>
      <TableAntd rowClassName="table-row" pagination={false} {...otherTableProps} />
    </div>
  );
};

export default Table;
