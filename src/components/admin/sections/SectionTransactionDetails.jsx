import WrapAmount from "components/wrapper/WrapAmount";
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
              <td>
                <WrapAmount value={amount} affix="suffix" />
              </td>
            </tr>
            <tr>
              <td>Fees</td>
              <td>
                <WrapAmount value={fees} affix="suffix" />
              </td>
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
