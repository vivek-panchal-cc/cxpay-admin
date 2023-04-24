import React from "react";
import { CFooter } from "@coreui/react";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <span className="ml-1">
          2023 &copy;{" "}
          <a
            href="https://communicationcrafts.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            communicationcrafts.com
          </a>
        </span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <a
          href="https://communicationcrafts.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          communicationcrafts.com
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
