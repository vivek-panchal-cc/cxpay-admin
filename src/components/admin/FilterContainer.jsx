import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormGroup,
  CInput,
  CLabel,
} from "@coreui/react";
import InputDropdown from "./InputDropdown";
import InputDateRange from "./InputDateRange";

const FilterContainer = ({
  labelSearch = "Name",
  labelStatus = "Status",
  labelDate = "Date",
  labelBtnSearch = "Search",
  labelBtnClear = "Clear",
  hideDateFilter = false,
  hideSearchFilter = false,
  hideStatusFilter = false,
  statusOptions = [],
  handleSearchCallback = () => {},
}) => {
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [dateFils, setDateFils] = useState({
    startDate: "",
    endDate: "",
  });

  const handleSearch = () => {
    const startDate = dateFils.startDate
      ? dateFils.startDate?.toLocaleDateString() || ""
      : "";
    const endDate = dateFils.endDate
      ? dateFils.endDate?.toLocaleDateString() || ""
      : startDate;
    setDateFils({
      startDate: startDate ? new Date(startDate) : "",
      endDate: endDate ? new Date(endDate) : "",
    });
    handleSearchCallback({
      ...(hideSearchFilter ? {} : { search }),
      ...(hideStatusFilter ? {} : { statuses }),
      ...(hideDateFilter ? {} : { startDate, endDate }),
    });
  };

  const handleClear = () => {
    setSearch("");
    setStatuses([]);
    setDateFils({
      startDate: "",
      endDate: "",
    });
    handleSearchCallback({
      ...(hideSearchFilter ? {} : { search: "" }),
      ...(hideStatusFilter ? {} : { statuses: [] }),
      ...(hideDateFilter ? {} : { startDate: "", endDate: "" }),
    });
  };

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardBody>
            <CRow>
              {!hideSearchFilter && (
                <CCol xl={3}>
                  <CFormGroup row>
                    <CCol xs="12">
                      <CLabel htmlFor="name">{labelSearch}</CLabel>
                      <CInput
                        id="name"
                        placeholder="Search Name"
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e?.target?.value || "")}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            handleSearch("search");
                          }
                        }}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
              )}
              {!hideStatusFilter && (
                <CCol xl={3}>
                  <CFormGroup row>
                    <CCol xs="12">
                      <CLabel htmlFor="name">{labelStatus}</CLabel>
                      <InputDropdown
                        id="refund-status-dd"
                        name="status"
                        className="dropdown-check-list"
                        title="Status"
                        dropList={statusOptions}
                        valueList={statuses}
                        onChange={(list) => setStatuses(list || [])}
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
              )}
              {!hideDateFilter && (
                <CCol xl={4}>
                  <CFormGroup row>
                    <CCol xs="10">
                      <CLabel htmlFor="name">{labelDate}</CLabel>
                      <InputDateRange
                        className=""
                        startDate={dateFils.startDate}
                        endDate={dateFils.endDate}
                        onChange={([std, edd]) =>
                          setDateFils({ startDate: std, endDate: edd })
                        }
                      />
                    </CCol>
                  </CFormGroup>
                </CCol>
              )}
            </CRow>
            <CRow>
              <CCol xl={12}>
                <CFormGroup row>
                  <CCol xs="1">
                    <button
                      type="button"
                      className="btn btn-dark btn-md"
                      onClick={handleSearch}
                    >
                      {labelBtnSearch}
                    </button>
                  </CCol>
                  <CCol xs="2">
                    <button
                      type="button"
                      className="btn btn-dark btn-md"
                      onClick={handleClear}
                    >
                      {labelBtnClear}
                    </button>
                  </CCol>
                </CFormGroup>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FilterContainer;
