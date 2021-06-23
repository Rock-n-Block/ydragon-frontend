import React from 'react';

import './Arrow.scss';

// interface ArrowProps {
//   color: string;
//   direction: string;
//   callbackFC: any;
// }

const Arrow: React.FC = ( color, direction = 'down' ) => {

  return (
    <div className="Arrow">
        {/* {callbackFC} */}
    </div>
  );
};

export default Arrow;
