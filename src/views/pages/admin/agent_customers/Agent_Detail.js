import React from "react";
import { formatDate, formatDateFullWithTimeStamp, formatMobileNumber, notify } from "../../../../_helpers";
import { agentService } from "../../../../services/admin/agent.service";
import Fullpage from "./Cms_Pages_FullPost";
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
  CCardFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
  faEye,
  faArrowLeft,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import { _canAccess, _loginUsersDetails } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { reportsService } from "../../../../services/admin/reports.service";
class Agent_Detail extends React.Component {
  /*********** Define Initial Satte ****************/
  constructor(props) {
    super(props);
    this.pageChange = this.pageChange.bind(this);
    this.state = {
      fields: {
        page: 1,
        account_number: this.props.match.params.id,
        sort_dir: "desc",
        sort_field: "created_at",
        search: "",
        totalPage: 1,
      },
      agent_recharges: [],
      // id: this.props.match.params.id, // Getting Id From Url
    };
  }

  /************ Retrieve Api very first time component render to Dom ******************/
  componentDidMount() {
    this.getDetailView();
  }

  /************ Define Function for retrieving Record for display particular post  ******************/
  getDetailView() {
    agentService.detailview(this.state.fields).then((res) => {
      if (!res.success) {
        // notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.data.pagination.total,
          fields: {
            ...this.state.fields,
            totalPage: res.data.pagination.last_page,
          },
          agent_recharges: res.data.agent_recharges,
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
        this.getDetailView();
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
        this.getDetailView();
      }
    );
  }

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            page: 1,
            account_number: this.props.match.params.id,
            search: "",
            sort_field: "created_at",
            sort_dir: "DESC",
            totalPage: 1,
          },
        },
        () => {
          this.getDetailView();
        }
      );
    } else {
      this.getDetailView();
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, search: value } });
  };

  downloadFile = async () => {
    const { search, account_number } = this.state.fields;
    reportsService.downloadAgentCSV({ search, account_number }).then((res) => {
      notify.success("Successfully send report logged in user mail");
    });
  };

  /****************************** Render Data To Dom ***************************************/

  render() {
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
                          id="name"
                          placeholder="Search Name or Mobile Number"
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
                </CRow>
                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch()}
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

                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1"></CCol>
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
                Recharge Details
                <div className="card-header-actions">
                  {_canAccess("agent_customers", "view") && (
                    <CTooltip content={globalConstants.EXPORT_AGENT_DATA}>
                      <CLink
                        className={`btn btn-dark btn-block ${
                          this.state.agent_recharges.length === 0
                            ? "disabled"
                            : ""
                        }`}
                        aria-current="page"
                        onClick={
                          this.state.agent_recharges.length > 0
                            ? this.downloadFile
                            : null
                        }
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
                  {/* <MultiActionBar
                            onClick={this.handleApplyAction}
                            checkBoxData={this.state.multiaction}
                            module_name={"agent_customers"}
                        /> */}
                  <table className="table">
                    <thead>
                      <tr>
                        {/* <th>
                                <input
                                    type="checkbox"
                                    // onClick={this.handleAllChecked}
                                    value="checkedall"
                                    onChange={(e) => {}}
                                    // checked={this.state.allCheckedbox}
                                />
                                </th> */}
                        <th>#</th>
                        <th onClick={() => this.handleColumnSort("name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Name</span>
                            {this.state.fields.sort_field !== "name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() => this.handleColumnSort("mobile_number")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Mobile Number
                            </span>
                            {this.state.fields.sort_field !==
                              "mobile_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "mobile_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "mobile_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Topup Amount
                            </span>
                          </span>
                        </th>

                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Topup Type
                            </span>
                          </span>
                        </th>

                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Agent Commission
                            </span>
                          </span>
                        </th>

                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              System Commission
                            </span>
                          </span>
                        </th>

                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Card Commission
                            </span>
                          </span>
                        </th>

                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Recharge Date
                            </span>
                          </span>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.agent_recharges?.length > 0 &&
                        this.state.agent_recharges.map((u, index) => (
                          <tr key={index}>
                            <td>{this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}</td>
                            <td>{u.name}</td>
                            <td>{formatMobileNumber(u.mobile_number)}</td>                            
                            <td>{parseFloat(u.topup_amount)?.toFixed(2)}</td>
                            <td>{u.topup_type}</td>
                            <td>
                              {parseFloat(u.agent_commission)?.toFixed(2)}
                            </td>
                            <td>
                              {parseFloat(u.system_commission)?.toFixed(2)}
                            </td>
                            <td>{parseFloat(u.card_commission)?.toFixed(2)}</td>
                            <td>{formatDateFullWithTimeStamp(u.recharge_date) || "-"}</td>
                          </tr>
                        ))}
                      {this.state.agent_recharges?.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state.agent_recharges?.length > 0 && (
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
              <CCardFooter>
                <CTooltip content={globalConstants.BACK_MSG}>
                  <CLink
                    className="btn btn-danger btn-sm"
                    aria-current="page"
                    to="/admin/agent_customers"
                  >
                    {" "}
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
                  </CLink>
                </CTooltip>
              </CCardFooter>
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
            <CModalTitle>Delete Agent</CModalTitle>
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
export default Agent_Detail;
