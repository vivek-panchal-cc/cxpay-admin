import React from "react";
import { NumericFormat } from "react-number-format";
import { globalConstants } from "constants/admin/global.constants";

/**
 * Wrap amount to add currency_symbol affix and comma or dot seperator
 * @param value, toFixed, affix
 * @returns Formatted amount
 */
const WrapAmount = ({ value, toFixed = 2, affix = "prefix", ...props }) => {
  return (
    <NumericFormat
      value={value}
      thousandsGroupStyle="lakh"
      displayType="text"
      decimalScale={toFixed}
      fixedDecimalScale
      thousandSeparator
      allowNegative
      {...(affix === "prefix"
        ? { prefix: `${globalConstants.CURRENCY_SYMBOL} ` }
        : {})}
      {...(affix === "suffix"
        ? { suffix: ` ${globalConstants.CURRENCY_SYMBOL}` }
        : {})}
      {...props}
    />
  );
};

export default WrapAmount;
