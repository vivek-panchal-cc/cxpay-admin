import React from "react";

const SectionTransactionDetails = (props) => {
  const {
    transactionId = "",
    date = "",
    amount = "",
    fees = "",
    status = "",
  } = props || {};

  const [w_dt, w_tm] = date ? date.split("|") : [];
  const fixedAmount = amount !== null ? parseFloat(amount).toFixed(2) : "";
  const fixedFees = fees !== null ? parseFloat(fees).toFixed(2) : "";

  return (
    <div className="wcr-innner-wrap wcr-innner-wrap-2 d-flex flex-wrap w-100">
      <div className="w-50-md wcr-transition-info wcr-transition-info-1">
        <table>
          <tbody>
            <tr>
              <td>Transaction ID</td>
              <td>{transactionId}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{w_dt}</td>
            </tr>
            <tr>
              <td>Time</td>
              <td>{w_tm}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-50-md wcr-transition-info wcr-transition-info-2">
        <table>
          <tbody>
            <tr>
              <td>Amount</td>
              <td>{fixedAmount}</td>
            </tr>
            <tr>
              <td>Fees</td>
              <td>{fixedFees}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <span>{status}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionTransactionDetails;
