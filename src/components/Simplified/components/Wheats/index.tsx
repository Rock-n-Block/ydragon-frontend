import React from 'react';
import './Wheats.scss';
import { DARK, useMst } from '../../../../store/store';

interface IWheatImg {
  background: string,
  profit: boolean,
  wheat: string
}

interface IWheats {
  name: string;
  emoji: string;
  description?: string;
  wheat: IWheatImg[];
}

const Wheat: React.FC<IWheats> = ({
  name,
  emoji,
  description,
  wheat,
}) => {
  const { theme } = useMst();
  const iff = (condition: boolean, then: string, otherwise: string) => {
    return condition ? then : otherwise
  };
  return (
    
      <div className="wheat__item">
              <div className={`wheat__title-wrapper-${ DARK === theme.value ? 'Black' : 'White'}`}>
                <p className="wheat__title">{emoji} {name}</p>
              </div>
              {description ?  
                <p className="wheat__subtitle">{description}</p>
                : null
              }
              <div className="wheat__weats-wrapper">
                {
                  wheat.map(wheatImg =>
                    
                    <div className={`wheat__weats-wrapper-${wheatImg.background === 'normal' ? 'normal' : iff((wheatImg.profit === false),'bad', 'profit')}`}>
                     
                      {wheatImg.profit === true ? <span className="wheat__text">+$</span> : null}
                      <img className="wheat__img" width="25" height="33" src={wheatImg.wheat} alt=" " />
                    </div>
                    )
                }
                    
              </div>
        </div>
  )
}

export default Wheat;