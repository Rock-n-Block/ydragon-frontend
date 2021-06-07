import React from 'react';

import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__copyright">© 2020 YDRAGON</div>

          <div className="footer__links">
            <a href="/">Legal</a>
            <a href="/">Privacy Policy</a>
            <a href="/">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
