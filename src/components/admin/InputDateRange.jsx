import React, { useEffect, useRef, useState } from "react";
import IconCalender from "assets/icons/IconCalendar";
import ReactDatePicker from "react-datepicker";
import "./RangePicker.css";

const InputDateRange = (props) => {
  const { className = "", onChange = () => {}, startDate, endDate } = props;
  const randomStr = `${Math.round(Math.random() * 1000)}`;

  const fromText = startDate ? startDate?.toLocaleDateString("en-UK") : "From";
  const toText = endDate ? endDate?.toLocaleDateString("en-UK") : "To";

  const dropRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = (data) => {
    const [std, edd] = data || [];
    if (std && edd) setShowCalendar(false);
    onChange(data);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!dropRef.current) return;
      if (!dropRef?.current?.contains(event.target)) setShowCalendar(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropRef]);

  const isToday = (date) => {
    // If a date range is selected, don't highlight today
    if (startDate || endDate) return false;

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className={`position-relative ${className}`} ref={dropRef}>
      <input
        id={`from-date${randomStr}`}
        type="text"
        className="form-control"
        placeholder="From"
        value={`${fromText} - ${toText}`}
        style={{ cursor: "pointer" }}
        onClick={() => setShowCalendar((cs) => !cs)}
        readOnly
      />
      <span
        className="position-absolute"
        style={{ top: "50%", transform: "translateY(-60%)", right: "15px" }}
      >
        <IconCalender style={{ stroke: "#00000080" }} />
      </span>
      {showCalendar && (
        <div className="position-absolute z-1" style={{ zIndex: "1" }}>
          <ReactDatePicker
            className="common-dr-picker"
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={handleChange}
            selectsRange={true}
            inline
            dayClassName={(date) =>
              isToday(date) ? "highlight-today" : undefined
            }
          />
        </div>
      )}
    </div>
  );
};

export default InputDateRange;
