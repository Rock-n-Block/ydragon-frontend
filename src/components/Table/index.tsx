import React from 'react';
import { Table as TableAntd } from 'antd';

interface TableProps {
  dataSource: any[];
  columns: IColumns[];

  className?: string;
}
export interface IColumns {
  title?: string;
  dataIndex: string;
  key: string;
  render?: any;
}

const StyleInjector = (children: any) => {
  const StyledChildren = () =>
    React.Children.map(children, (child) =>
      React.cloneElement(child, {
        className: `${child.props.className} table-bottom`,
      }),
    );

  return <StyledChildren />;
};

const Table: React.FC<TableProps> = ({ dataSource, columns, className, children }) => {
  return (
    <div className={`table ${className || ''} ${children ? 'table-bottom-unbordered' : ''}`}>
      <TableAntd
        dataSource={dataSource}
        columns={columns}
        rowClassName="table-row"
        pagination={false}
      />
      {children ? StyleInjector(children) : <></>}
    </div>
  );
};

export default Table;
