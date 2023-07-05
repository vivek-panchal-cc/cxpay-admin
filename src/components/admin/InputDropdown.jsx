import React, { useCallback, useEffect, useRef, useState } from "react";

const InputDropdown = (props) => {
  const {
    id = "",
    className = "",
    title = "",
    valueList = [],
    dropList = [],
    onChange = () => {},
  } = props;
  const randomStr = `${Math.round(Math.random() * 1000)}`;

  const dropRef = useRef(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    function handleclickOutside(event) {
      if (!dropRef.current) return;
      if (!dropRef?.current?.contains(event.target)) setToggle(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [dropRef]);

  const handleChange = useCallback(
    (e) => {
      const checked = e?.target?.checked;
      const value = e?.target?.value;
      let updatedList = [...valueList];
      if (checked) updatedList.push(value);
      else updatedList.splice(valueList.indexOf(value), 1);
      if (onChange) onChange(updatedList);
    },
    [valueList]
  );

  return (
    <div id={id || `drop${randomStr}`} className={`${className}`}>
      <span className="anchor" onClick={(e) => setToggle((cs) => !cs)}>
        {title}
      </span>
      {toggle ? (
        <ul className="status-items" ref={dropRef}>
          {dropList && dropList.length > 0
            ? dropList.map((item, index) => {
                const isChecked = valueList?.includes(item?.status);
                return (
                  <li key={item?.status || index}>
                    <input
                      id={item?.status}
                      type="checkbox"
                      className="position-absolute"
                      value={item?.status}
                      onChange={handleChange}
                      checked={isChecked}
                    />
                    <label htmlFor={item?.status}>
                      <span className="checkmark"></span>
                      {item?.title}
                    </label>
                  </li>
                );
              })
            : null}
        </ul>
      ) : null}
    </div>
  );
};

export default InputDropdown;
