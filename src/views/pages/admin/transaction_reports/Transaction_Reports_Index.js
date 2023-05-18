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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip,
  CSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { faEye, faFileDownload, faFileExport, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { agentService } from "../../../../services/admin/agent.service";
import { reportsService } from "../../../../services/admin/reports.service";
import {
  notify,
  _canAccess,
  history,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import moment from "moment";

class Transaction_Reports_Index extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);

    this.state = {
      fields: {
        page: 1,
        direction: "desc",
        sort: "name",
        name: "",
        txn_type: "",
        cr_dr_flag:"",
        totalPage: 1,
      },
      transactions_list: [],
      _openPopup: false,
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/customer_reports");
    }
  }

  componentDidMount() {
    this.getTransactionList();
  }

  getTransactionList() {
    reportsService.getTransactionList(this.state.fields).then((res) => {
      if (res.success === false) {
        this.setState({
          totalRecords: res.data?.pagination?.total,
          fields: {
            ...this.state.fields,
          },
          transactions_list: res.data?.transaction,
        });
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.data.pagination.total,
          fields: {
            ...this.state.fields,
            totalPage: res?.data?.pagination?.last_page,
          },
          transactions_list: res.data.transaction,
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
        this.getTransactionList();
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
        this.getTransactionList();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            page: 1,
            direction: "desc",
            sort: "name",
            search: "",
            txn_type: "",
            cr_dr_flag:"",
            totalPage: 1,
          },
        },
        () => {
          this.getTransactionList(this.state.fields);
        }
      );
    } else {
      this.getTransactionList(this.state.fields);
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
    reportsService.downloadTransactionCSV().then((res) => {
      console.log(res)
    });
}

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
                        <CLabel htmlFor="txn_type">Transaction Type</CLabel>
                        <CSelect
                          id="txn_type"
                          placeholder="Customer Type"
                          name="txn_type"
                          value={this.state.fields.txn_type}
                          onChange={this.handleChange}
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          <option value="">-- Select Type --</option>
                          <option value="WW">Wallet to Wallet </option>
                          <option value="PL">Add Fund (Depoite)</option>
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="cr_dr_flag">Credit Debit Flag</CLabel>
                        <CSelect
                          id="cr_dr_flag"
                          placeholder="Credit Debit Flag"
                          name="cr_dr_flag"
                          value={this.state.fields.cr_dr_flag}
                          onChange={this.handleChange}
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          <option value="">-- Select Type --</option>
                          <option value="C">Credit</option>
                          <option value="D">Debit</option>
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
                <strong>Transaction Reports</strong>
                <div className="card-header-actions">
                  {_canAccess("customer_reports", "download") && (
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
                        <th>#</th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("name")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Name
                            </span>
                            {this.state.fields.sort !== "name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("ref_id")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Transaction ID
                            </span>
                            {this.state.fields.sort !== "ref_id" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "ref_id" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "ref_id" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("txn_type")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Transaction Type</span>
                            {this.state.fields.sort !== "txn_type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "txn_type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "txn_type" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("cr_dr_flag")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Credit Debit Flag</span>
                            {this.state.fields.sort !== "cr_dr_flag" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "cr_dr_flag" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "cr_dr_flag" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("account_number")}>
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

                        
                        <th onClick={() => this.handleColumnSort("txn_amount")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                                 Transaction Amount
                            </span>
                            {this.state.fields.sort !== "txn_amount" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "txn_amount" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "txn_amount" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("narration")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Narration
                            </span>
                            {this.state.fields.sort !== "narration" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "narration" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "narration" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.fields.sort !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("created_at")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Created Date
                            </span>
                            {this.state.fields.sort !== "created_at" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "created_at" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "created_at" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.transactions_list?.length > 0 ? (
                        this.state.transactions_list.map((u, index) => (
                          <tr key={index+1}>
                            <td>{index + 1}</td>
                            <td>{u.name}</td>
                            <td>{u.ref_id}</td>
                            <td>{u.txn_type}</td>
                            <td>{u.cr_dr_flag}</td>
                            <td>{u.account_number}</td>
                            <td>{u.txn_amount}</td>
                            <td>{u.narration}</td>
                            <td>{u.status}</td>
                            <td>{moment(u.created_at).format('LL')}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.transactions_list?.length > 0 ? (
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

export default Transaction_Reports_Index;
