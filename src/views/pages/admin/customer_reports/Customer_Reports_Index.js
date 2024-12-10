import React from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CLink,
  CFormGroup,
  CInput,
  CLabel,
  CTooltip,
  CSelect,
  CPopover,
} from "@coreui/react";
import {
  faEye,
  faFileExport,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { reportsService } from "../../../../services/admin/reports.service";
import {
  notify,
  _canAccess,
  history,
  _loginUsersDetails,
  capitalize,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { customersManagementService } from "services/admin/customers_management.service";

class Customer_Reports_Index extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);

    this.state = {
      countryData: [],
      fields: {
        page: 1,
        direction: "desc",
        sort: "account_number",
        name: "",
        filter_user_type: "",
        totalPage: 1,
        per_page: 10,
      },
      perPage: 0,
      customers_list: [],
      _openPopup: false,
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/dashboard");
    }
  }

  componentDidMount() {
    this.getCountry();
    this.getCustomersList();
  }

  getCountry() {
    customersManagementService.getCountry().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
        } else {
          const countryMap = res.data.country_list.reduce((map, country) => {
            map[country.iso] = country.country_name;
            return map;
          }, {});
          this.setState({ countryData: countryMap });
        }
      }
    });
  }

  getCustomersList() {
    reportsService.getCustomersList(this.state.fields).then((res) => {
      if (res.success === false) {
        this.setState({
          totalRecords: res.data?.pagination?.total,
          fields: {
            ...this.state.fields,
          },
          customers_list: res.data.customers,
        });
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.data?.pagination?.total,
          fields: {
            ...this.state.fields,
            totalPage: res?.data?.pagination?.last_page,
          },
          perPage: res?.data?.pagination?.per_page,
          customers_list: res.data.customers,
        });
      }
    });
  }

  pageChange = (newPage) => {
    newPage = newPage === 0 ? 1 : newPage;
    this.setState(
      {
        fields: {
          ...this.state.fields,
          page: newPage,
        },
      },
      () => {
        this.getCustomersList();
      }
    );
  };

  handleColumnSort(fieldName) {
    this.setState(
      {
        fields: {
          ...this.state.fields,
          direction: ["desc"].includes(this.state.fields.direction)
            ? "asc"
            : "desc",
          sort: fieldName,
        },
      },
      () => {
        this.getCustomersList();
      }
    );
  }

  // handleChange(e) {
  //   const { name, value } = e.target;
  //   this.setState({ fields: { ...this.state.fields, [name]: value } });
  // }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState((prevState) => ({
      fields: {
        ...prevState.fields,
        [name]: name === "per_page" ? parseInt(value, 10) : value, // Convert 'per_page' to an integer
      },
    }));
  };

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            page: 1,
            direction: "desc",
            sort: "account_number",
            search: "",
            filter_user_type: "",
            totalPage: 1,
            per_page: 10,
          },
        },
        () => {
          this.getCustomersList(this.state.fields);
        }
      );
    } else {
      this.setState(
        {
          fields: {
            ...this.state.fields,
            page: 1,
          },
        },
        () => {
          this.getCustomersList(this.state.fields);
        }
      );
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({ [inputFieldId]: inputFieldValue });
  };

  handleAllChecked = (event) => {
    let multiactions = this.state.multiaction;
    for (var key in multiactions) {
      multiactions[key] = event.target.checked;
    }
    this.setState({
      multiaction: multiactions,
      allCheckedbox: event.target.checked,
    });
  };

  downloadFile = async () => {
    const { search, filter_user_type } = this.state.fields;
    reportsService
      .downloadCustomerCSV({ search, filter_user_type })
      .then((res) => {
        //  if (res.success) {
        notify.success("Successfully send report logged in user mail");
        // }
      });
  };

  render() {
    const current_user = _loginUsersDetails();

    return (
      <>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Search</CLabel>
                        <CInput
                          id="search"
                          placeholder="Search"
                          name="search"
                          value={this.state.fields.search}
                          onChange={this.handleChange}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Customer Type</CLabel>
                        <CSelect
                          id="name"
                          className={""}
                          placeholder="Customer Type"
                          name="filter_user_type"
                          value={this.state.fields.filter_user_type}
                          onChange={this.handleChange}
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          {/* <option value="">-- Select Type --</option> */}
                          <option value="">All</option>
                          <option value="agent">Agent</option>
                          <option value="business">Business</option>
                          <option value="personal">Personal</option>
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Per Page</CLabel>
                        <CSelect
                          id="per_page"
                          className={""}
                          placeholder="Per Page"
                          name="per_page"
                          value={this.state.fields.per_page}
                          onChange={this.handleChange}
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          {/* <option value="">-- Select Type --</option> */}
                          <option value={10}>10</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={200}>200</option>
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={6}>
                    <CFormGroup row>
                      <CCol xs="12"></CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch("search")}
                        >
                          Search
                        </button>
                      </CCol>
                      <CCol xs="2">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch("reset")}
                        >
                          Clear
                        </button>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Customer Reports</strong>
                <div className="card-header-actions">
                  {_canAccess("customer_reports", "view") && (
                    <CTooltip content={globalConstants.EXPORT_CUSTOMER_DATA}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        onClick={this.downloadFile}
                        to="#"
                      >
                        <FontAwesomeIcon icon={faFileExport} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sr.no</th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("account_number")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Account Number
                            </span>
                            {this.state.fields.sort !== "account_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "account_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "account_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("first_name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Name</span>
                            {this.state.fields.sort !== "first_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "first_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "first_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("email")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Email</span>
                            {this.state.fields.sort !== "email" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "email" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "email" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() => this.handleColumnSort("mobile_number")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Mobile
                            </span>
                            {this.state.fields.sort !== "mobile_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "mobile_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "mobile_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th>
                          Total Topup {`(${globalConstants.CURRENCY_SYMBOL})`}
                        </th>
                        <th>
                          Total Sent {`(${globalConstants.CURRENCY_SYMBOL})`}
                        </th>
                        <th>
                          Total Received{" "}
                          {`(${globalConstants.CURRENCY_SYMBOL})`}
                        </th>

                        <th
                          onClick={() =>
                            this.handleColumnSort("available_balance")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Available Balance{" "}
                              {`(${globalConstants.CURRENCY_SYMBOL})`}
                            </span>
                            {this.state.fields.sort !== "available_balance" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort ===
                                "available_balance" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort ===
                                "available_balance" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("user_type")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Customer Type
                            </span>
                            {this.state.fields.sort !== "user_type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "user_type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "user_type" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("country")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Country
                            </span>
                            {this.state.fields.sort !== "country" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "country" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "country" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {_canAccess("customer_reports", "view") && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.customers_list?.length > 0 ? (
                        this.state.customers_list.map((u, index) => (
                          <tr key={u.account_number}>
                            <td>
                              {this.state.fields.page >= 2
                                ? index +
                                  1 +
                                  this.state.perPage *
                                    (this.state.fields.page - 1)
                                : index + 1}
                            </td>
                            <td>{u.account_number}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                              {/* {"+"}{u.mobile} */}
                              {`+${u.mobile}`}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {u.total_topup &&
                                !isNaN(parseFloat(u.total_topup))
                                  ? `${parseFloat(u.total_topup).toFixed(2)}`
                                  : "0"}
                                {u.total_topup &&
                                !isNaN(parseFloat(u.total_topup)) ? (
                                  <CPopover
                                    header={"Total topup"}
                                    content={
                                      <div>
                                        <table
                                          style={{
                                            border: "1px solid #ccc",
                                            borderCollapse: "collapse",
                                            width: "100%",
                                            marginTop: "8px",
                                          }}
                                        >
                                          <thead
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                            }}
                                          >
                                            <tr>
                                              <th
                                                style={{
                                                  border: "1px solid #ccc",
                                                  padding: "4px",
                                                }}
                                              >
                                                Total Topup via Card
                                              </th>
                                              <th
                                                style={{
                                                  border: "1px solid #ccc",
                                                  padding: "4px",
                                                }}
                                              >
                                                Total Topup via Manual
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  border: "1px solid #ccc",
                                                  padding: "4px",
                                                }}
                                              >
                                                {
                                                  globalConstants.CURRENCY_SYMBOL
                                                }
                                                &nbsp;
                                                {typeof parseFloat(
                                                  u.total_topup_via_card
                                                ) === "number"
                                                  ? parseFloat(
                                                      u.total_topup_via_card
                                                    ).toFixed(2)
                                                  : u.total_topup_via_card}
                                              </td>
                                              <td
                                                style={{
                                                  border: "1px solid #ccc",
                                                  padding: "4px",
                                                }}
                                              >
                                                {
                                                  globalConstants.CURRENCY_SYMBOL
                                                }
                                                &nbsp;
                                                {typeof parseFloat(
                                                  u.total_topup_via_manual
                                                ) === "number"
                                                  ? parseFloat(
                                                      u.total_topup_via_manual
                                                    ).toFixed(2)
                                                  : u.total_topup_via_manual}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    }
                                  >
                                    <FontAwesomeIcon
                                      style={{
                                        marginLeft: "8px",
                                        cursor: "pointer",
                                      }}
                                      icon={faInfoCircle}
                                      // onClick={() => this.handleIconClick(u.id)}
                                    />
                                  </CPopover>
                                ) : null}
                              </div>
                            </td>
                            <td>
                              {u.total_send && !isNaN(parseFloat(u.total_send))
                                ? `${parseFloat(u.total_send).toFixed(2)}`
                                : "0"}
                            </td>
                            <td>
                              {u.total_receive &&
                              !isNaN(parseFloat(u.total_receive))
                                ? `${parseFloat(u.total_receive).toFixed(2)}`
                                : "0"}
                            </td>
                            <td>
                              {/* {globalConstants.CURRENCY_SYMBOL}&nbsp; */}
                              {typeof parseFloat(u.available_balance) ===
                              "number"
                                ? parseFloat(u.available_balance).toFixed(2)
                                : u.available_balance}
                            </td>
                            <td>{capitalize(u.user_type)}</td>
                            <td>
                              {this.state.countryData &&
                              this.state.countryData[u.country]
                                ? this.state.countryData[u.country]
                                : u.country}
                            </td>
                            <td>
                              {_canAccess("customer_reports", "view") && (
                                <CTooltip
                                  content={
                                    globalConstants.VIEW_CUSTOMER_DETAILS
                                  }
                                >
                                  <CLink
                                    className="btn btn-dark btn-block"
                                    aria-current="page"
                                    to={`/admin/customer_reports/detailview/${u.account_number}`}
                                  >
                                    <FontAwesomeIcon icon={faEye} />
                                  </CLink>
                                </CTooltip>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.customers_list?.length > 0 ? (
                    <CPagination
                      activePage={this.state.fields.page}
                      onActivePageChange={this.pageChange}
                      pages={this.state.fields.totalPage}
                      doubleArrows={true}
                      align="end"
                    />
                  ) : null}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Customer_Reports_Index;
