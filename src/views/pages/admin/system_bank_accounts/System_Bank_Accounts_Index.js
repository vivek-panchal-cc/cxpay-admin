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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  notify,
  history,
  _canAccess,
  capitalize,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { systemBankAccountsServices } from "services/admin/system_bank_accounts.service";

const ActionBar = React.lazy(() =>
  import("../../../../components/admin/ActionBar")
);
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);

class System_Bank_Accounts_Index extends React.Component {
  constructor(props) {
    super(props);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getSystemBankAccountsList = this.getSystemBankAccountsList.bind(this);

    this.state = {
      fields: {
        page: 1,
        sort_dir: "asc",
        sort_field: "account_name",
        search_name: "",
        totalPage: 1,
        operation_type: "system_bank_account_list",
      },
      _openPopup: false,
      system_bank_accounts_list: [],
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/system_bank_accounts");
    }
  }

  componentDidMount() {
    this.getSystemBankAccountsList();
  }

  getSystemBankAccountsList() {
    systemBankAccountsServices
      .systemBankAccountsBulkAction(this.state.fields)
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
          this.setState({ system_bank_accounts_list: [] });
        } else {
          this.setState({
            totalRecords: res.data?.pagination?.total,
            fields: {
              ...this.state.fields,
              totalPage: res.data?.pagination?.last_page,
            },
            system_bank_accounts_list: res.data?.accounts,
          });

          if (res?.data && res?.data?.accounts?.length > 0) {
            let bankAccounts = res?.data?.accounts;
            let multiaction = [];
            for (var key in bankAccounts) {
              multiaction[bankAccounts[key].id] = false;
            }
            this.setState({ multiaction: multiaction });
          } else if (res.data?.accounts?.length === 0) {
            this.setState({ multiaction: [] });
          }
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
        this.getSystemBankAccountsList();
      }
    );
  };

  handleColumnSort(fieldName) {
    this.setState(
      {
        fields: {
          ...this.state.fields,
          sort_dir: ["desc"].includes(this.state.fields.sort_dir)
            ? "asc"
            : "desc",
          sort_field: fieldName,
        },
      },
      () => {
        this.getSystemBankAccountsList();
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
            sort_dir: "asc",
            sort_field: "account_name",
            search_name: "",
            totalPage: 1,
            operation_type: "system_bank_account_list",
          },
          multiaction: [],
          allCheckedbox: false,
        },
        () => {
          this.getSystemBankAccountsList();
        }
      );
    } else {
      this.getSystemBankAccountsList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });

    var postData = {
      id: [this.state.deleteId],
      operation_type: "system_bank_account_delete",
    };

    systemBankAccountsServices
      .systemBankAccountsBulkAction(postData)
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getSystemBankAccountsList();
        }
      });
  }

  bankAccountStatusChangedHandler(id, status) {
    systemBankAccountsServices
      .systemBankAccountsBulkAction({
        id: [id],
        status: status === false ? true : false,
        operation_type: "system_bank_account_status_change",
      })
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getSystemBankAccountsList();
        }
      });
  }

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

  handleCheckChieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
    let allTrue = false;
    if (this.state.multiaction?.length > 0) {
      allTrue = this.state.multiaction.every((element) => element === true);
    }
    this.setState({ allCheckedbox: allTrue });
  };

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  bulkBankAccountStatusChangeHandler(postData) {
    systemBankAccountsServices
      .systemBankAccountsBulkAction(postData)
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getSystemBankAccountsList();
        }
      });
  }

  bulkBankAccountsDeleteHandler(postData) {
    systemBankAccountsServices
      .systemBankAccountsBulkAction(postData)
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getSystemBankAccountsList();
        }
      });
  }

  handleApplyAction = (actionValue = "") => {
    if (actionValue !== "") {
      let appliedActionId = [];
      let selectedIds = this.state.multiaction;
      for (var key in selectedIds) {
        if (selectedIds[key]) {
          appliedActionId.push(key);
        }
      }

      this.resetCheckedBox();
      switch (actionValue) {
        case "active": {
          this.bulkBankAccountStatusChangeHandler({
            id: appliedActionId,
            status: true,
            operation_type: "system_bank_account_status_change",
          });
          break;
        }
        case "deactive": {
          this.bulkBankAccountStatusChangeHandler({
            id: appliedActionId,
            status: false,
            operation_type: "system_bank_account_status_change",
          });
          break;
        }
        default:
          return "";
      }
    }
  };

  render() {
    return (
      <>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>System Bank Accounts</strong>
                <div className="card-header-actions">
                  {_canAccess("system_bank_accounts", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/system_bank_accounts/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
                <CRow>
                  <CCol xl={12} className="p-0">
                    <CCardBody>
                      <CRow style={{ flexWrap: "nowrap" }}>
                        <CCol xl={3}>
                          <CFormGroup
                            row
                            className="flex flex-wrap nowrap mb-0"
                          >
                            <CCol xs="12" className="p-0">
                              <CInput
                                id="search_name"
                                placeholder="Search Account Name"
                                name="search_name"
                                value={this.state.fields.search_name}
                                onChange={this.handleChange}
                                onKeyPress={(event) => {
                                  if (event.key === "Enter") {
                                    this.handleSearch("search_name");
                                  }
                                }}
                              />
                            </CCol>
                          </CFormGroup>
                        </CCol>
                        <CCol xl={9}>
                          <CFormGroup
                            row
                            className="flex flex-wrap nowrap mb-0"
                          >
                            <CCol xs="12">
                              <button
                                className="btn btn-dark btn-md mr-2"
                                onClick={() => this.handleSearch()}
                              >
                                Search
                              </button>
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
                      <CRow></CRow>
                    </CCardBody>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <ActionBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiaction}
                    module_name={"system_bank_accounts"}
                  />
                  <table className="table">
                    <thead>
                      <tr>
                        {_canAccess("system_bank_accounts", "update") && (
                          <th>
                            <input
                              type="checkbox"
                              onClick={this.handleAllChecked}
                              value="checkedall"
                              onChange={(e) => {}}
                              checked={this.state.allCheckedbox}
                            />
                          </th>
                        )}
                        <th>#</th>
                        <th
                          onClick={() => this.handleColumnSort("account_name")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Account Name
                            </span>
                            {this.state.fields.sort_field !==
                              "account_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "account_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "account_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() =>
                            this.handleColumnSort("account_number")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Account Number
                            </span>
                            {this.state.fields.sort_field !==
                              "account_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "account_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "account_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("bank_name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Bank Name
                            </span>
                            {this.state.fields.sort_field !== "bank_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "bank_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "bank_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.fields.sort_field !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {(_canAccess("system_bank_accounts", "update") ||
                          _canAccess("system_bank_accounts", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.system_bank_accounts_list &&
                        this.state.system_bank_accounts_list?.length > 0 &&
                        this.state.system_bank_accounts_list?.map(
                          (u, index) => (
                            <tr key={u.id}>
                              {_canAccess("system_bank_accounts", "update") && (
                                <td>
                                  <CheckBoxes
                                    handleCheckChieldElement={
                                      this.handleCheckChieldElement
                                    }
                                    _id={u.id}
                                    _isChecked={this.state.multiaction[u.id]}
                                  />
                                </td>
                              )}

                              <td>
                                {this.state.fields.page >= 2
                                  ? index +
                                    1 +
                                    10 * (this.state.fields.page - 1)
                                  : index + 1}
                              </td>
                              <td>{u.account_name}</td>
                              <td>{u.account_number}</td>
                              <td>{capitalize(u.bank_name)}</td>

                              <td>
                                {_canAccess(
                                  "system_bank_accounts",
                                  "update"
                                ) ? (
                                  <CLink
                                    onClick={() =>
                                      this.bankAccountStatusChangedHandler(
                                        u.id,
                                        u.status
                                      )
                                    }
                                  >
                                    {u.status === false
                                      ? "Activate"
                                      : "Deactivate"}
                                  </CLink>
                                ) : (
                                  <>
                                    {u.status === false ? "Deactive" : "Active"}
                                  </>
                                )}
                              </td>
                              {(_canAccess("system_bank_accounts", "update") ||
                                _canAccess(
                                  "system_bank_accounts",
                                  "delete"
                                )) && (
                                <>
                                  <td>
                                    <div className="d-flex">
                                      {_canAccess(
                                        "system_bank_accounts",
                                        "update"
                                      ) && (
                                        <CTooltip
                                          content={globalConstants.EDIT_BTN}
                                        >
                                          <CLink
                                            className="btn  btn-md btn-primary"
                                            aria-current="page"
                                            to={`/admin/system_bank_accounts/edit/${u.id}`}
                                          >
                                            <CIcon name="cil-pencil"></CIcon>{" "}
                                          </CLink>
                                        </CTooltip>
                                      )}
                                      &nbsp;
                                      {_canAccess(
                                        "system_bank_accounts",
                                        "delete"
                                      ) && (
                                        <CTooltip
                                          content={globalConstants.DELETE_BTN}
                                        >
                                          <button
                                            className="btn btn-md btn-danger "
                                            onClick={() =>
                                              this.openDeletePopup(u.id)
                                            }
                                          >
                                            <CIcon name="cil-trash"></CIcon>
                                          </button>
                                        </CTooltip>
                                      )}
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          )
                        )}
                      {this.state.system_bank_accounts_list &&
                        this.state.system_bank_accounts_list?.length === 0 && (
                          <tr>
                            <td colSpan="5">No records found</td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                  {this.state.system_bank_accounts_list?.length > 0 && (
                    <CPagination
                      activePage={this.state.fields.page}
                      onActivePageChange={this.pageChange}
                      pages={this.state.fields.totalPage}
                      doubleArrows={true}
                      align="end"
                    />
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CModal
          show={this.state._openPopup}
          onClose={() => {
            this.setState({ _openPopup: !this.state._openPopup });
          }}
          color="danger"
        >
          <CModalHeader closeButton>
            <CModalTitle>Delete System Bank Account</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this record?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteUser()}>
              Delete
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                this.setState({ _openPopup: !this.state._openPopup });
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }
}

export default System_Bank_Accounts_Index;
