import React, { PropsWithChildren } from 'react';
import { Table as TableAntd, TableProps } from 'antd';

const StyleInjector = (children: any) => {
  const StyledChildren = () =>
    React.Children.map(children, (child) =>
      React.cloneElement(child, {
        className: `${child.props.className} table-bottom`,
      }),
    );

  return <StyledChildren />;
};

const Table: React.FC<TableProps<any>> = (props: PropsWithChildren<TableProps<any>>) => {
  const { children, className, ...otherTableProps } = props;

  return (
    <div className={`table ${className || ''} ${children ? 'table-bottom-unbordered' : ''}`}>
      <TableAntd rowClassName="table-row" pagination={false} {...otherTableProps} />
      {children ? StyleInjector(children) : <></>}
    </div>
  );
};

export default Table;
