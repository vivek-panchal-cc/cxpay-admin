import React from "react";

const SectionDetails = (props) => {
  const { detailsHeading = "", details = [{ key: "", value: "" }] } =
    props || {};

  return (
    <div className="wr-bdatail-tbl pe-md-4">
      <div className="font-16-quick  w-100 pb-2 dark_blue font-600">
        {detailsHeading}
      </div>
      <table>
        <tbody>
          {details?.map(({ key = "", value = "" }, index) => (
            <tr key={key?.trim() || index}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectionDetails;
