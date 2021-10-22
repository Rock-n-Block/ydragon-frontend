import React from 'react';

import './SocialLink.scss';

interface ISocialLinkProps {
  icon: string;
  href: string;
  title?: string;
}

const SocialLink: React.FC<ISocialLinkProps> = React.memo(({ icon, href, title }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="social-link_item">
      <img src={icon} alt="link logo" width="16" height="16" />
      {title && <span>{title}</span>}
    </a>
  );
});

export default SocialLink;
