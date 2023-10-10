/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormGroup,
  CInput,
  CLabel,
  CFormText,
  CCardFooter,
  CButton,
  CLink,
  CSwitch,
  CTooltip,
  CTextarea,
  CSelect,
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { pushNotificationService } from "../../../../services/admin/push_notification.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

class Push_Notification_Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        title: "",
        description: "",
        customer_type: "",
        type: "",
        schedule_time: null,
        schedule_time_formated: null,
        account_numbers: null,
      },
      options: [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
      ],
      selectedCustomer: [],
    };
    if (this.props._renderAccess === false) {
      history.push("/admin/notifications");
    }
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleChange(e) {
  //   const { name, value } = e.target;
  //   this.setState({ fields: { ...this.state.fields, [name]: value } });
  // }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } }, () => {
      if (name === "type" && value === "schedule") {
        const currentDateTime = new Date();
        const roundedMinutes =
          Math.ceil(currentDateTime.getMinutes() / 15) * 15; // This rounds to the next 15 minute interval.
        currentDateTime.setMinutes(roundedMinutes);
        this.setState({
          fields: { ...this.state.fields, schedule_time: currentDateTime },
        });
      }
    });
  }

  handleSubmit() {
    if (this.validator.allValid()) {
      let formData = this.state.fields;
      if (this.state.fields.schedule_time) {
        formData.schedule_time = this.convertDatePickerTime(
          this.state.fields.schedule_time
        );
      }
      pushNotificationService.createNotification(formData).then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/notifications");
        }
      });
    } else {
      this.validator.showMessages();
    }
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({
      fields: { ...this.state.fields, [inputFieldId]: inputFieldValue },
    });
  };
  componentDidMount() {
    setTimeout(
      () =>
        _canAccess(
          this.props.module_name,
          this.props.action,
          "/admin/notifications"
        ),
      300
    );
    this.getUserList();
  }

  getUserList() {
    pushNotificationService.getUserList().then((res) => {
      if (res.success === true) {
        let userData = [{ value: "all", label: "All" }];
        res.data.forEach((element) => {
          userData.push({
            value: element.account_number,
            label: element.user_name,
          });
        });
        this.setState({ options: userData });
      }
    });
  }

  convertDatePickerTime(str) {
    var month, day, year, hours, minutes, seconds;
    var date = new Date(str),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    seconds = ("0" + date.getSeconds()).slice(-2);

    var mySQLDate = [date.getFullYear(), month, day].join("-");
    var mySQLTime = [hours, minutes, seconds].join(":");
    return [mySQLDate, mySQLTime].join(" ");
  }

  handledateChange = (date) => {
    this.setState({ fields: { ...this.state.fields, schedule_time: date } });
  };

  selectedCustomerData(customer) {
    if (customer.filter((x) => x.value == "all").length > 0) {
      this.setState({ selectedCustomer: [{ value: "all", label: "All" }] });
    } else {
      let selectedCustomer = [];
      customer.forEach((x) => {
        selectedCustomer.push(x.value);
      });
      this.setState({
        fields: { ...this.state.fields, account_numbers: selectedCustomer },
      });
      this.setState({ selectedCustomer: customer });
    }
  }

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Add Notification</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/notifications"
                    >
                      {" "}
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Title</CLabel>
                  <CInput
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter Title"
                    value={this.state.fields.title}
                    autoComplete="title"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "title",
                      this.state.fields.title,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Description</CLabel>
                  <CTextarea
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter Description"
                    value={this.state.fields.description}
                    autoComplete="description"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "description",
                      this.state.fields.description,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Customer Type</CLabel>
                  <CSelect
                    id="name"
                    placeholder="Customer Type"
                    name="customer_type"
                    value={this.state.fields.customer_type}
                    onChange={this.handleChange}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">-- Select Customer Type --</option>
                    <option value="2">Individual</option>
                    <option value="1">Business</option>
                    <option value="all">All</option>
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "customer_type",
                      this.state.fields.customer_type,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                {this.state.fields.customer_type === "all" && (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor="name">Customers</CLabel>
                      <Select
                        isMulti
                        options={this.state.options}
                        value={this.state.selectedCustomer}
                        onChange={(data) => this.selectedCustomerData(data)}
                      />
                      <CFormText className="help-block">
                        {this.validator.message(
                          "customer_type",
                          this.state.fields.customer_type,
                          "required",
                          { className: "text-danger" }
                        )}
                      </CFormText>
                    </CFormGroup>
                  </>
                )}
                <CFormGroup>
                  <CLabel htmlFor="name">Type</CLabel>
                  <CSelect
                    id="name"
                    placeholder="Type"
                    name="type"
                    value={this.state.fields.type}
                    onChange={this.handleChange}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="instant">Instant</option>
                    <option value="schedule">Schedule</option>
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "type",
                      this.state.fields.type,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                {this.state.fields.type === "schedule" && (
                  <>
                    <CFormGroup>
                      <CLabel htmlFor="name">Schedule Time</CLabel>
                      <DatePicker
                        selected={this.state.fields.schedule_time}
                        onChange={(date) => this.handledateChange(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateCaption=""
                        timeCaption="Time"
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="form-control"
                        minDate={new Date()}
                      />
                      <CFormText className="help-block">
                        {this.validator.message(
                          "schedule_time",
                          this.state.fields.schedule_time,
                          "required",
                          { className: "text-danger" }
                        )}
                      </CFormText>
                    </CFormGroup>
                  </>
                )}
              </CCardBody>
              <CCardFooter>
                <CButton
                  type="button"
                  size="sm"
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Submit
                </CButton>
                &nbsp;
                <CLink
                  className="btn btn-danger btn-sm"
                  aria-current="page"
                  to="/admin/notifications"
                >
                  <FontAwesomeIcon icon={faBan} className="mr-1" />
                  Cancel
                </CLink>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Push_Notification_Add;
