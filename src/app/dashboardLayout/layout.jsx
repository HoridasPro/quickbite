import React, { Children } from "react";

const DashboardLayout = ({ Children }) => {
  return (
    <div className="grid grid-cols-12 gap-5 min-h-screen">
      <div className="col-span-3 border-r-2">
        <h2>Filters</h2>
      </div>
      <div className="col-span-9 ">{Children}</div>
    </div>
  );
};

export default DashboardLayout;
