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
  CInputRadio,
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import {
  notify,
  history,
  _canAccess,
  formatDateFull,
  calculateDuration,
  calculateDurationLeft,
  formatDateByConditional,
  capitalizeWordByWord,
} from "../../../../_helpers/index";
import $ from "jquery";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import { businessCustomersService } from "../../../../services/admin/business_customers.service";
import SectionKycDocument from "components/admin/sections/SectionKycDocument";
import SectionKycDetails from "components/admin/sections/SectionKycDetails";
import "./kycTable.css";
import "assets/css/page.css";
import "assets/css/responsive.css";

class Business_Customers_Edit extends React.Component {
  constructor(props) {
    super(props);
    //Identify user has access this page or not

    this.state = {
      fields: {
        user_group_name: "",
        status: true,
        is_kyc: true,
        admin_approved: true,
        kyc_approved_status: "",
        kyc_document_file: "",
        kyc_document_id: "",
        kyc_document_type: "",
        kyc_expiration_date: null,
        _id: this.props.match.params.id,
      },
      is_kyc_approved_status: "",
      module_permission: {},
      countryData: {},
      cityData: [],
      imageTypeValidation: false,
      imageSizeValidation: false,
      site_logo: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.permssionChange = this.permssionChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleCheckboxChangeKYC = this.handleCheckboxChangeKYC.bind(this);
    this.handleCheckboxChangeIsApproved =
      this.handleCheckboxChangeIsApproved.bind(this);
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
            const kyctmp = res.data.is_kyc === false ? false : true;
            const isApprovedtmp =
              res.data.admin_approved === false ? false : true;
            // const isKycApproved =
            //   res.data.kyc_approved === false ? false : true;
            this.setState({
              cityData: [...this.state.countryData.city_list[iso]],
              city: res.data.city,
              country: country_index,
              status: statustmp,
              is_kyc: kyctmp,
              admin_approved: isApprovedtmp,
              kyc_approved_status: res.data.kyc_approved_status,
              is_kyc_approved_status: res.data.kyc_approved_status,
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

  handleCheckboxChangeKYC(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    const tmpKyc = value ? true : false;

    this.setState({
      [name]: tmpKyc,
    });
  }

  handleRadioChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      fields: {
        ...prevState.fields,
        [name]: value === "true", // Convert value to boolean
      },
    }));
  };

  handleCheckboxChangeIsApproved(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    const tmpIsApproved = value ? true : false;

    this.setState({
      [name]: tmpIsApproved,
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

  // handleChange(e) {
  //   const { name, value } = e.target;
  //   if (name === "status") {
  //     var fstatus = value === "true" ? false : true;
  //     this.setState({ fields: { ...this.state.fields, [name]: fstatus } });
  //   } else {
  //     this.setState({ fields: { ...this.state.fields, [name]: value } });
  //   }
  // }

  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "daily_request_limit") {
      // Remove any non-digit characters
      const sanitizedValue = value.replace(/[^0-9]/g, "");

      // Take only the first two digits
      const firstTwoDigits = sanitizedValue.substring(0, 2);

      this.setState({
        fields: { ...this.state.fields, [name]: firstTwoDigits },
      });
    } else {
      // For other fields, proceed with the generic handling
      if (name === "status") {
        const fstatus = value === "true" ? false : true;
        this.setState({
          fields: { ...this.state.fields, [name]: fstatus },
        });
      } else {
        this.setState({
          fields: { ...this.state.fields, [name]: value },
        });
      }
    }
  };

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
      formData.append("kyc_status", this.state.is_kyc);
      formData.append("admin_approved", this.state.admin_approved);
      formData.append(
        "kyc_approved_status",
        this.state.fields.kyc_approved_status
      );
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
      formData.append(
        "daily_add_fund_limit",
        this.state.fields.daily_add_fund_limit
      );
      formData.append(
        "daily_wallet_transfer_limit",
        this.state.fields.daily_wallet_transfer_limit
      );
      formData.append(
        "daily_withdraw_limit",
        this.state.fields.daily_withdraw_limit
      );
      formData.append(
        "monthly_add_fund_limit",
        this.state.fields.monthly_add_fund_limit
      );
      formData.append(
        "monthly_wallet_transfer_limit",
        this.state.fields.monthly_wallet_transfer_limit
      );
      formData.append(
        "monthly_withdraw_limit",
        this.state.fields.monthly_withdraw_limit
      );
      formData.append(
        "daily_request_limit",
        this.state.fields.daily_request_limit
      );

      // return
      businessCustomersService.updateCustomer(formData).then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/business_customers");
          // history.goBack();
        }
      });
    } else {
      this.validator.showMessages();
      // if (Object.keys(finalPermission).length === 0) {
      //   $('.module_permission').html('<div class="text-danger">Atleast one module permission has required.</div>');
      // }
    }
  }

  handleClearProfilePic = () => {
    this.setState({
      fields: { ...this.state.fields, profile_image: null },
      site_logo: null,
    });
  };

  // handleKycDocument = (file) => {
  //   if (file) {
  //     try {
  //       // Fetch the file as a Blob
  //       fetch(file)
  //         .then((response) => response.blob())
  //         .then((blob) => {
  //           const blobUrl = URL.createObjectURL(blob);
  //           const downloadLink = document.createElement("a");
  //           downloadLink.href = blobUrl;
  //           const filename = file.substring(file.lastIndexOf("/") + 1);
  //           downloadLink.setAttribute("download", filename);
  //           downloadLink.click();
  //           URL.revokeObjectURL(blobUrl);
  //         })
  //         .catch((error) => {
  //           console.log("Error fetching file:", error);
  //         });
  //     } catch (error) {
  //       console.log("Error downloading file:", error);
  //     }
  //   }
  // };

  handleKycDocument = (file) => {
    if (file) {
      window.open(file, "_blank");
    }
  };

  render() {
    var { module_permission, site_logo } = this.state;

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
                      // to="/admin/business_customers"
                      onClick={() => {
                        history.goBack();
                      }}
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
                <CRow>
                  <CCol className="col-md-4 col flex-wrap">
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
                  </CCol>
                  <CCol className="col-md-4 col flex-wrap">
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">Balance</CLabel>
                      <CInput
                        type="text"
                        id="available_balance"
                        name="available_balance"
                        placeholder="Enter Balance"
                        autoComplete="name"
                        value={this.state.fields.available_balance}
                        onChange={this.handleChange}
                        disabled={true}
                      />
                      <CFormText className="help-block">
                        {this.validator.message(
                          "available_balance",
                          this.state.fields.available_balance,
                          "required",
                          { className: "text-danger" }
                        )}
                      </CFormText>
                    </CFormGroup>
                  </CCol>
                  <CCol className="col-md-4 col flex-wrap">
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">Reserved Amount</CLabel>
                      <CInput
                        type="text"
                        id="reserved_amount"
                        name="reserved_amount"
                        placeholder="Enter Reserved Amount"
                        autoComplete="name"
                        value={this.state.fields.reserved_amount}
                        onChange={this.handleChange}
                        disabled={true}
                      />
                      <CFormText className="help-block">
                        {this.validator.message(
                          "reserved_amount",
                          this.state.fields.reserved_amount,
                          "required",
                          { className: "text-danger" }
                        )}
                      </CFormText>
                    </CFormGroup>
                  </CCol>
                </CRow>

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
                  <CLabel htmlFor="nf-name">
                    Chamber of Commerce{" "}
                    <span className="smaller-note">
                      (not older than 2 months)
                    </span>
                  </CLabel>
                  <CInput
                    type="text"
                    id="business_id"
                    name="business_id"
                    placeholder="Enter Chamber of Commerce"
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
                        site_logo
                          ? URL.createObjectURL(site_logo)
                          : this.state.fields.profile_image ||
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
                      placeholder="Browse Logo "
                      autoComplete="site_logo "
                      onChange={this.handleUpload}
                      style={{ border: "none" }}
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
                          Image size is greater than 5MB. Please upload image
                          below 5MB.
                        </div>
                      </small>
                    )}
                    {false && (
                      <CCol>
                        <CButton
                          type="button"
                          size="sm"
                          color="secondary"
                          onClick={this.handleClearProfilePic}
                        >
                          Clear
                        </CButton>
                      </CCol>
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
                  <CCol md="2">Status</CCol>

                  <CCol sm="10" style={{ paddingLeft: "10px" }}>
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

                {this.state.fields.kyc_type?.toLowerCase() === "manual" && (
                  <CFormGroup className="limits-wrap d-flex flex-wrap">
                    <CCol md="2" className="pl-0">
                      KYC Approved
                    </CCol>
                    <CCol sm="10" className="pl-0">
                      <CFormGroup variant="custom-checkbox" inline>
                        <CFormGroup
                          check
                          className="radio"
                          style={{ marginLeft: "20px", marginBottom: "10px" }}
                        >
                          <CInputRadio
                            className="form-check-input"
                            id="approveRadio"
                            name="kyc_approved_status"
                            value={"approved"}
                            checked={
                              this.state.fields.kyc_approved_status ===
                              "approved"
                            }
                            onChange={this.handleChange}
                            disabled={
                              this.state.is_kyc_approved_status === "approved"
                            }
                          />
                          <CLabel
                            check
                            className="form-check-label"
                            htmlFor="approveRadio"
                          >
                            Approve
                          </CLabel>
                        </CFormGroup>
                        <CFormGroup
                          check
                          className="radio"
                          style={{ marginLeft: "35px", marginBottom: "10px" }}
                        >
                          <CInputRadio
                            className="form-check-input"
                            id="rejectRadio"
                            name="kyc_approved_status"
                            value={"rejected"}
                            checked={
                              this.state.fields.kyc_approved_status ===
                              "rejected"
                            }
                            onChange={this.handleChange}
                            disabled={
                              this.state.is_kyc_approved_status === "approved"
                            }
                          />
                          <CLabel
                            check
                            className="form-check-label"
                            htmlFor="rejectRadio"
                          >
                            Reject
                          </CLabel>
                        </CFormGroup>
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                )}

                {this.state.fields.kyc_type?.toLowerCase() === "manual" &&
                  this.state.fields.kyc_document_type && (
                    <div
                      className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper kyc-approved-border"
                      style={{ marginBottom: "20px" }}
                    >
                      <div
                        className={`kyc-innner-wrap d-flex flex-wrap w-100 ${
                          this.state.fields.kyc_document_file
                            ? "kyc-document-innner-wrap-3"
                            : "kyc-wbr-innner-wrap-3"
                        }`}
                      >
                        <SectionKycDetails
                          detailsHeading="Document Details"
                          details={[
                            {
                              key: "Document Type",
                              value: capitalizeWordByWord(
                                this.state.fields.kyc_document_type
                              ),
                            },
                            {
                              key: "Document Id",
                              value: this.state.fields.kyc_document_id,
                            },
                            {
                              key: "Expiry Date",
                              value: formatDateByConditional(
                                this.state.fields.kyc_expiration_date,
                                true
                              ),
                            },
                          ]}
                        />
                        {this.state.fields.kyc_document_file && (
                          <SectionKycDocument
                            documentHeading="Document"
                            receipt={
                              this.state.fields.kyc_document_file || null
                            }
                            handleClickReceipt={this.handleKycDocument}
                          />
                        )}
                      </div>
                    </div>
                  )}

                {/* {this.state.fields.kyc_approved_status?.toLowerCase() === "approved" && ( */}
                  <CFormGroup className="limits-wrap d-flex flex-wrap">
                    <CCol md="2" className="pl-0">
                      KYC
                    </CCol>

                    <CCol sm="10" className="pl-0">
                      <CFormGroup variant="custom-checkbox" inline>
                        {this.state.fields.is_kyc === true && (
                          <CSwitch
                            className="mr-1"
                            color="primary"
                            id="is_kyc"
                            name="is_kyc"
                            value={this.state.fields.is_kyc}
                            defaultChecked
                            // disabled={
                            //   this.state.fields.kyc_expiration_date === null ||
                            //   this.state.fields.kyc_approved_status?.toLowerCase() ===
                            //     "pending" ||
                            //   this.state.fields.kyc_approved_status?.toLowerCase() ===
                            //     "inprogress"
                            // }
                            onChange={this.handleCheckboxChangeKYC}
                          />
                        )}

                        {this.state.fields.is_kyc === false && (
                          <CSwitch
                            className="mr-1"
                            color="primary"
                            id="is_kyc"
                            name="is_kyc"
                            value={this.state.fields.is_kyc}
                            // disabled={
                            //   this.state.fields.kyc_expiration_date === null ||
                            //   this.state.fields.kyc_approved_status?.toLowerCase() ===
                            //     "pending" ||
                            //   this.state.fields.kyc_approved_status?.toLowerCase() ===
                            //     "inprogress"
                            // }
                            onChange={this.handleCheckboxChangeKYC}
                          />
                        )}
                      </CFormGroup>
                      {this.state.fields.kyc_expiration_date === null && (
                        <CLabel
                          className="text-danger"
                          style={{ contain: "content", fontSize: "12px" }}
                        >
                          The customer has not completed the KYC process.
                        </CLabel>
                      )}
                    </CCol>
                  </CFormGroup>
                {/* )} */}

                {this.state.fields.kyc_type?.toLowerCase() === "system" &&
                  this.state.fields.is_kyc && (
                    <table className="kyc-table">
                      <thead>
                        <tr>
                          <th>KYC</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.fields.kyc_completion_date && (
                          <tr>
                            <td>Completion on</td>
                            <td>
                              {formatDateFull(
                                this.state.fields.kyc_completion_date
                              )}
                            </td>
                          </tr>
                        )}
                        {this.state.fields.kyc_renew_date && (
                          <tr>
                            <td>Renewed on</td>
                            <td>
                              {formatDateFull(this.state.fields.kyc_renew_date)}
                            </td>
                          </tr>
                        )}
                        {this.state.fields.kyc_expiration_date && (
                          <tr>
                            <td>Expiration on</td>
                            <td>
                              {formatDateFull(
                                this.state.fields.kyc_expiration_date
                              )}
                              {this.state.fields.kyc_renew_date && (
                                <span>
                                  {" (Duration: "}
                                  {calculateDuration(
                                    this.state.fields.kyc_renew_date,
                                    this.state.fields.kyc_expiration_date
                                  )}
                                  {")"}
                                </span>
                              )}
                            </td>
                          </tr>
                        )}
                        {this.state.fields.kyc_transaction_id && (
                          <tr>
                            <td>Transaction Id</td>
                            <td>{this.state.fields.kyc_transaction_id}</td>
                          </tr>
                        )}
                        {this.state.fields.status && (
                          <tr>
                            <td>Status</td>
                            <td>
                              {this.state.fields.status === "1" ? (
                                <span className="success-green">Success</span>
                              ) : (
                                <span className="text-danger">Decline</span>
                              )}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td>Attempted Count</td>
                          <td>{this.state.fields.kyc_attempt_count}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                <CFormGroup className="limits-wrap d-flex flex-wrap">
                  <CCol md="2" className="pl-0">
                    Is Business Approved?
                  </CCol>

                  <CCol sm="10" className="pl-0">
                    <CFormGroup variant="custom-checkbox" inline>
                      {this.state.fields.admin_approved === true && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="admin_approved"
                          name="admin_approved"
                          value={this.state.fields.admin_approved}
                          defaultChecked
                          onChange={this.handleCheckboxChangeIsApproved}
                        />
                      )}

                      {this.state.fields.admin_approved === false && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="admin_approved"
                          name="admin_approved"
                          value={this.state.fields.admin_approved}
                          onChange={this.handleCheckboxChangeIsApproved}
                        />
                      )}
                    </CFormGroup>
                  </CCol>
                </CFormGroup>

                <CFormGroup className="limits-wrap">
                  <div className="row mb-3 mb-lg-4 limits-heading">
                    <div className="col-md-6 col">
                      <p>Daily Limits</p>
                    </div>
                    <div className="col-sm-6 col">
                      <p>Monthly Limits</p>
                    </div>
                  </div>
                  <CRow className="mb-3">
                    <CCol className="col-md-6 col d-flex flex-wrap">
                      <CLabel
                        htmlFor="daily_add_fund"
                        className="col-form-label"
                      >
                        Add Fund Limit
                      </CLabel>

                      <CCol className="limit-ip-col">
                        <CInput
                          type="text"
                          id="daily_add_fund"
                          name="daily_add_fund_limit"
                          placeholder="Enter Add Fund Limit"
                          value={this.state.fields.daily_add_fund_limit}
                          onChange={this.handleChange}
                        />
                        <CFormText className="help-block">
                          {this.validator.message(
                            "daily_add_fund_limit",
                            this.state.fields.daily_add_fund_limit,
                            "required",
                            { className: "text-danger" }
                          )}
                        </CFormText>
                      </CCol>
                    </CCol>
                    <CCol className="col-md-6 col col d-flex flex-wrap">
                      <CLabel
                        htmlFor="monthly_add_fund"
                        className="col-form-label"
                      >
                        Add Fund Limit
                      </CLabel>
                      <CCol className="limit-ip-col">
                        <CInput
                          type="text"
                          id="monthly_add_fund"
                          name="monthly_add_fund_limit"
                          placeholder="Enter Add Fund Limit"
                          value={this.state.fields.monthly_add_fund_limit}
                          onChange={this.handleChange}
                          disabled={false}
                        />
                        <CFormText className="help-block">
                          {this.validator.message(
                            "monthly_add_fund_limit",
                            this.state.fields.monthly_add_fund_limit,
                            "required",
                            { className: "text-danger" }
                          )}
                        </CFormText>
                      </CCol>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol className="col-sm-6 col d-flex flex-wrap">
                      <CLabel
                        htmlFor="daily_wallet_transfer"
                        className="col-form-label"
                      >
                        Wallet Transfer Limit
                      </CLabel>
                      <CCol className="limit-ip-col">
                        <CInput
                          type="text"
                          id="daily_wallet_transfer"
                          name="daily_wallet_transfer_limit"
                          placeholder="Enter Wallet Transfer Limit"
                          value={this.state.fields.daily_wallet_transfer_limit}
                          onChange={this.handleChange}
                          disabled={false}
                        />
                        <CFormText className="help-block">
                          {this.validator.message(
                            "daily_wallet_transfer_limit",
                            this.state.fields.daily_wallet_transfer_limit,
                            "required",
                            { className: "text-danger" }
                          )}
                        </CFormText>
                      </CCol>
                    </CCol>
                    <CCol className="col-sm-6 col d-flex flex-wrap">
                      <CLabel
                        htmlFor="monthly_wallet_transfer"
                        className="col-form-label"
                      >
                        Wallet Transfer Limit
                      </CLabel>
                      <CCol className="limit-ip-col">
                        <CInput
                          type="text"
                          id="monthly_wallet_transfer_limit"
                          name="monthly_wallet_transfer_limit"
                          placeholder="Enter Wallet Transfer Limit"
                          value={
                            this.state.fields.monthly_wallet_transfer_limit
                          }
                          onChange={this.handleChange}
                          disabled={false}
                        />
                        <CFormText className="help-block">
                          {this.validator.message(
                            "monthly_wallet_transfer_limit",
                            this.state.fields.monthly_wallet_transfer_limit,
                            "required",
                            { className: "text-danger" }
                          )}
                        </CFormText>
                      </CCol>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol className="col-sm-6 col d-flex flex-wrap">
                      <CLabel
                        htmlFor="daily_withdraw_limit"
                        className="col-form-label"
                      >
                        Withdraw Limit
                      </CLabel>
                      <CCol className="limit-ip-col">
                        <CInput
                          type="text"
                          id="daily_withdraw_limit"
                          name="daily_withdraw_limit"
                          placeholder="Enter Withdraw Limit"
                          value={this.state.fields.daily_withdraw_limit}
                          onChange={this.handleChange}
                          disabled={false}
                        />
                        <CFormText className="help-block">
                          {this.validator.message(
                            "daily_withdraw_limit",
                            this.state.fields.daily_withdraw_limit,
                            "required",
                            { className: "text-danger" }
                          )}
                        </CFormText>
                      </CCol>
                    </CCol>
                    <CCol className="col-sm-6 col d-flex flex-wrap">
                      <CLabel
                        htmlFor="monthly_withdraw"
                        className="col-form-label"
                      >
                        Withdraw Limit
                      </CLabel>
                      <CCol className="limit-ip-col">
                        <CInput
                          type="text"
                          id="monthly_withdraw_limit"
                          name="monthly_withdraw_limit"
                          placeholder="Enter Withdraw Limit"
                          value={this.state.fields.monthly_withdraw_limit}
                          onChange={this.handleChange}
                          disabled={false}
                        />
                        <CFormText className="help-block">
                          {this.validator.message(
                            "monthly_withdraw_limit",
                            this.state.fields.monthly_withdraw_limit,
                            "required",
                            { className: "text-danger" }
                          )}
                        </CFormText>
                      </CCol>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol className="col-sm-6 col d-flex flex-wrap">
                      <CLabel
                        htmlFor="daily_request"
                        className="col-form-label"
                      >
                        Request Limit
                      </CLabel>
                      <CCol className="limit-ip-col">
                        <CInput
                          type="text"
                          id="daily_request_limit"
                          name="daily_request_limit"
                          placeholder="Enter Request Limit"
                          value={this.state.fields.daily_request_limit}
                          onChange={this.handleChange}
                          disabled={false}
                        />
                        <CFormText className="help-block">
                          {this.validator.message(
                            "daily_request_limit",
                            this.state.fields.daily_request_limit,
                            "required",
                            { className: "text-danger" }
                          )}
                        </CFormText>
                      </CCol>
                    </CCol>
                  </CRow>
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
                  // to="/admin/business_customers"
                  onClick={() => {
                    history.goBack();
                  }}
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
