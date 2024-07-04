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
  CTooltip,
  CSwitch,
  CSelect,
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import $ from "jquery";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import { businessCustomersService } from "../../../../services/admin/business_customers.service";

class Business_Customers_Edit extends React.Component {
  constructor(props) {
    super(props);
    //Identify user has access this page or not

    this.state = {
      fields: {
        user_group_name: "",
        status: true,
        _id: this.props.match.params.id,
      },
      module_permission: {},
      countryData: {},
      cityData: [],
      imageTypeValidation: false,
      imageSizeValidation: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.permssionChange = this.permssionChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (
        _canAccess(
          this.props.module_name,
          this.props.action,
          "/admin/business_customers"
        )
      ) {
        var postData = {
          mobile_number: this.state.fields._id,
        };

        businessCustomersService.getCustomer(postData).then((res) => {
          if (res.status === false) {
            notify.error(res.message);
          } else {
            if (res.data == null) {
              notify.error("Customer not found");
              history.push("/admin/business_customers");
            }

            this.setState({ ...this.state.fields, fields: res.data });

            const country_index = this.state.countryData.country_list.findIndex(
              (e) => e.iso === res.data.country
            );
            const { iso } =
              this.state.countryData.country_list.find(
                (e) => e.iso === res.data.country
              ) || {};
            const statustmp = res.data.status == 0 ? 0 : 1;
            this.setState({
              cityData: [...this.state.countryData.city_list[iso]],
              city: res.data.city,
              country: country_index,
              status: statustmp,
            });
          }
        });
      }
    }, 100);

    businessCustomersService.getCountry().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
          notify.error("Country Not Found");
          history.push("/admin/business_customers");
        }

        this.setState({ countryData: res.data });
      }
    });
  }

  handleCountryChange(e) {
    const cityCode = this.state.countryData.country_list[e.target.value].iso;
    const tmp = [...this.state.countryData.city_list[cityCode]];
    this.setState({ cityData: tmp, country: e.target.value });
  }

  handleCityChange(e) {
    const tmp = e.target.value;
    this.setState({ city: e.target.value });
    // const cityCode = this.state.countryData.country_list[e.target.value].iso;
    // const tmp = [...this.state.countryData.city_list[cityCode]];
    // this.setState({ cityData:tmp })
  }

  handleCheckboxChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    const tmp = value ? 1 : 0;

    this.setState({
      [name]: tmp,
      // fields:{[name]: tmp}
    });
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const filename = event.target.files[0].name;

    if (file && file.name.match(/\.(jpg|jpeg|png)$/)) {
      this.setState({ imageTypeValidation: false });
    }
    if (file && file.size < 5000000) {
      this.setState({ imageSizeValidation: false });
    }

    this.setState({
      site_logo: file,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === "status") {
      var fstatus = value === "true" ? false : true;
      this.setState({ fields: { ...this.state.fields, [name]: fstatus } });
    } else {
      this.setState({ fields: { ...this.state.fields, [name]: value } });
    }
  }

  permssionChange(e) {
    const { name, value } = e.target;

    var permission_array = this.state.module_permission;
    var action = name.split("___")[0];
    var permission_val = permission_array[action];
    var trueFlag = 0;
    for (var key in permission_val) {
      if (key === value) {
        permission_val[key] = !permission_val[key];
        if (value !== "view") {
          permission_val["view"] = true;
        }
      }
      if (key !== "view" && permission_val[key] === true) {
        trueFlag = trueFlag + 1;
      }
    }

    if (trueFlag > 0 && value === "view") {
      permission_val["view"] = true;
      e.preventDefault();
      notify.info(
        "View action is required while other module action is selected"
      );
      return;
    }

    if (trueFlag === 0 && value !== "view") {
      //permission_val['view'] = false;
    }
    permission_array[action] = permission_val;
    this.setState({
      module_permission: {
        ...this.state.module_permission,
        [action]: permission_val,
      },
    });
    $(".module_permission").html("");
  }

  handleSubmit() {
    if (
      this.state.site_logo &&
      !this.state.site_logo.name.match(/\.(jpg|jpeg|png)$/)
    ) {
      this.setState({ imageTypeValidation: true });
      return false;
    }

    if (this.state.site_logo && this.state.site_logo.size > 5000000) {
      this.setState({ imageSizeValidation: true });
      return false;
    }

    if (this.validator.allValid()) {
      let formData = new FormData();

      formData.append("company_name", this.state.fields.company_name);
      formData.append("status", this.state.status);
      formData.append("email", this.state.fields.email);
      formData.append("city", this.state.city);
      formData.append(
        "country",
        this.state.countryData.country_list[this.state.country].iso
      );
      formData.append("business_id", this.state.fields.business_id);
      formData.append("business_url", this.state.fields.business_url);
      formData.append("country_code", this.state.fields.country_code);
      formData.append("mobile_number", this.state.fields.mobile_number);
      if (this.state.site_logo) {
        formData.append("profile_image", this.state.site_logo);
      }
      // return
      businessCustomersService.updateCustomer(formData).then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/business_customers");
        }
      });
    } else {
      this.validator.showMessages();
      // if (Object.keys(finalPermission).length === 0) {
      //   $('.module_permission').html('<div class="text-danger">Atleast one module permission has required.</div>');
      // }
    }
  }

  render() {
    var { module_permission } = this.state;

    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                Edit Customer
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/business_customers"
                    >
                      {" "}
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="mr-1"
                      />{" "}
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Account Number</CLabel>
                  <CInput
                    type="text"
                    id="account_number"
                    name="account_number"
                    placeholder="Enter Account Number "
                    autoComplete="name"
                    value={this.state.fields.account_number}
                    onChange={this.handleChange}
                    disabled={true}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "account_number",
                      this.state.fields.account_number,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Customer ID</CLabel>
                  <CInput
                    type="text"
                    id="cust_id"
                    name="cust_id"
                    placeholder="Enter Customer ID "
                    autoComplete="name"
                    value={this.state.fields.cust_id}
                    onChange={this.handleChange}
                    disabled={true}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "cust_id",
                      this.state.fields.cust_id,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Mobile Number</CLabel>
                  <CInput
                    type="text"
                    id="mobile_number"
                    name="mobile_number"
                    placeholder="Enter Mobile Number "
                    autoComplete="name"
                    value={this.state.fields.mobile_number}
                    onChange={this.handleChange}
                    disabled={true}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "mobile_number",
                      this.state.fields.mobile_number,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Company Name</CLabel>
                  <CInput
                    type="text"
                    id="company_name"
                    name="company_name"
                    placeholder="Enter Company Name "
                    autoComplete="name"
                    value={this.state.fields.company_name}
                    onChange={this.handleChange}
                    disabled={false}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "company_name",
                      this.state.fields.company_name,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Email</CLabel>
                  <CInput
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Enter Email "
                    autoComplete="name"
                    value={this.state.fields.email}
                    onChange={this.handleChange}
                    disabled={false}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "email",
                      this.state.fields.email,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "email",
                      this.state.fields.email,
                      "email",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Business ID</CLabel>
                  <CInput
                    type="text"
                    id="business_id"
                    name="business_id"
                    placeholder="Enter Business Id "
                    autoComplete="name"
                    value={this.state.fields.business_id}
                    onChange={this.handleChange}
                    disabled={false}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Business URL</CLabel>
                  <CInput
                    type="text"
                    id="business_url"
                    name="business_url"
                    placeholder="Enter Business URL "
                    autoComplete="name"
                    value={this.state.fields.business_url}
                    onChange={this.handleChange}
                    disabled={false}
                  />
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="nf-name">Country</CLabel>
                  <CSelect
                    custom
                    name="country"
                    id="select"
                    onChange={this.handleCountryChange}
                    value={this.state.country}
                  >
                    {/* <option value="">-- Country --</option>; */}
                    {this.state.countryData &&
                      this.state.countryData?.country_list?.map((e, key) => {
                        return (
                          <option key={key} value={key}>
                            {e.country_name}
                          </option>
                        );
                      })}
                  </CSelect>
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="nf-name">City</CLabel>
                  <CSelect
                    custom
                    name="city"
                    id="select"
                    onChange={this.handleCityChange}
                    value={this.state.city}
                  >
                    {/* <option value="">-- city --</option>; */}
                    {this.state.cityData?.map((e, key) => {
                      return (
                        <option key={key} value={e.city_name}>
                          {e.city_name}
                        </option>
                      );
                    })}
                  </CSelect>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="1">Profile Image</CCol>

                  <CCol sm="2">
                    <img
                      src={
                        this.state.fields.profile_image ||
                        "/avatars/default-avatar.png"
                      }
                      className=""
                      width={100}
                    />
                  </CCol>
                  <CCol sm="5">
                    <CInput
                      type="file"
                      id="site_logo"
                      name="site_logo"
                      placeholder="Browe Logo "
                      autoComplete="site_logo "
                      onChange={this.handleUpload}
                    />
                    {this.state.imageTypeValidation && (
                      <small className="form-text text-muted help-block">
                        <div className="text-danger">
                          Select valid image. (jpg, jpeg or png)
                        </div>
                      </small>
                    )}
                    {this.state.imageSizeValidation && (
                      <small className="form-text text-muted help-block">
                        <div className="text-danger">
                          Image size is grater then 5MB. Please upload image
                          below 5MB.
                        </div>
                      </small>
                    )}
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="1">QR Code</CCol>

                  <CCol sm="11">
                    <img
                      src={this.state.fields.qr_code_image}
                      className=""
                      width={100}
                    />
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="1">Status</CCol>

                  <CCol sm="11">
                    <CFormGroup variant="custom-checkbox" inline>
                      {this.state.fields.status == 1 && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="status"
                          name="status"
                          value={this.state.fields.status}
                          defaultChecked
                          onChange={this.handleCheckboxChange}
                        />
                      )}

                      {this.state.fields.status == 0 && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="status"
                          name="status"
                          value={this.state.fields.status}
                          onChange={this.handleCheckboxChange}
                        />
                      )}
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
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
                  to="/admin/business_customers"
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

export default Business_Customers_Edit;