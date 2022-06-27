import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';

const PageLayout = ({ children }) => {
  // Page layout wrapper for all pages (includes header, horizontal spacing and child page component)
  return (
    <div className="flex flex-col flex-nowrap items-center w-full min-h-screen">
      <Header />
      <div className="z-0 flex justify-center w-full px-4 pt-24 pb-0 sm:px-8 xl:px-0">
        <div className="flex flex-col flex-nowrap items-center justify-center w-full space-y-6 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.object,
  ]).isRequired,
};

export default PageLayout;