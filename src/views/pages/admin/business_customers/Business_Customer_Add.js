import React, { Component } from "react";
import { _canAccess } from "../../../../_helpers/index";
import {
    addObjToFormData,
    capitalize,
} from "../../../../_helpers/common-utility";
import {
    CButton,
    CSelect,
    CFormGroup,
    CLabel,
    CFormText,
    CInput,
    CCol,
    CLink,
    CCardHeader,
    CCard,
    CCardBody,
    CCardFooter,
    CTooltip,
    CInputGroup,
    CInputGroupText,
    CInputGroupPrepend,
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import { notify, history } from "../../../../_helpers/index";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSave,
    faBan,
    faArrowLeft,
    faEyeSlash,
    faEye,
    faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { businessCustomersService } from "services/admin/business_customers.service";
import "react-dropzone-uploader/dist/styles.css";
import "../agent_customers/page.css";
import "../agent_customers/Draft.css";
import "./kycTable.css"

class Business_Customer_Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                business_id: "",
                business_category_id: "",
                user_type: "business",
                company_name: "",
                email: "",
                mobile_number: "",
                city: "",
                country_code: "",
                country: "",
                address: "",
                password: "",
                confirm_password: "",
            },
            category_list: [],
            countryCityRes: [],
            countryData: [],
            cityData: [],
            timeZone: "",
            collectionData: [],
            imageTypeValidation: false,
            imageSizeValidation: false,
            showPassword: false,
            showConfirmPassword: false,
            errorPassword: "",
            errorConfirmPassword: "",
        };

        // Bind Methods for actions by vivek
        this.validator = new SimpleReactValidator({ autoForceUpdate: this });
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this._handleCancelAction = this._handleCancelAction.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.clearImage = this.clearImage.bind(this);
        this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
        this.toggleConfirmPasswordVisibility =
            this.toggleConfirmPasswordVisibility.bind(this);
    }

    componentDidMount() {
        this.getCountryCity();
        this.getCategory();
    }

    getCategory() {
        businessCustomersService.businessCategory().then((res) => {
            if (!res.success) {
                // notify.error(res.message);
                this.setState({ category_list: [] });
            } else {
                this.setState({
                    category_list: res.data?.category,
                });
            }
        });
    }

    /********** Retrive Data of Country and City  *****************/
    getCountryCity() {
        businessCustomersService.getCountry().then((res) => {
            if (res.status === false) {
                notify.error(res.message);
            } else {
                const countryList = res?.data?.country_list || [];
                this.setState({
                    countryData: countryList?.filter(
                        (country) => country.is_signup_country
                    ),
                });
                this.setState({ countryCityRes: res?.data });
            }
        });
    }

    // Method For Form Field
    handleCountryChange(e) {
        const { value } = e.target;
        const selectedOption = e.target.options[e.target.selectedIndex];
        const dataValue = selectedOption.getAttribute("data-iso");

        const timeZoneSet =
            value != "" ? this.state?.countryCityRes?.country_list : [];
        const timeZoneObject = timeZoneSet.find((item) => item.iso === dataValue);
        const timeZone = timeZoneObject
            ? timeZoneObject.time_zone
            : Intl.DateTimeFormat().resolvedOptions().timeZone;

        const city =
            value != "" ? this.state?.countryCityRes?.city_list[dataValue] : [];
        this.setState({ cityData: city, timeZone: timeZone });
        this.setState({
            fields: {
                ...this.state.fields,
                country: dataValue,
                country_code: value,
            },
        });
    }

    // Method For Form Field
    handleChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        if (name === "password") {
            let errorMessage = "";
            if (value.length < 8 || value.length > 16) {
                errorMessage = "Password must be 8 to 16 characters long";
            }

            // Check for at least one lowercase letter
            else if (!/[a-z]/.test(value)) {
                errorMessage = "Password must contain at least one lowercase letter";
            }

            // Check for at least one uppercase letter
            else if (!/[A-Z]/.test(value)) {
                errorMessage = "Password must contain at least one uppercase letter";
            }

            // Check for at least one numeric character
            else if (!/\d/.test(value)) {
                errorMessage = "Password must contain at least one numeric character";
            }

            // Check for at least one special character
            else if (!/[@$!%*?&#_]/.test(value)) {
                errorMessage =
                    "Password must contain at least one special character (@, $, !, %, *, ?, &, #, _)";
            }

            // Check for spaces
            else if (/\s/.test(value)) {
                errorMessage = "Spaces are not allowed in the password";
            }

            // Check for the word 'password'
            else if (/password/i.test(value)) {
                errorMessage = "The word 'password' is not allowed in the password";
            }

            // If there's an error, set the error message and prevent form submission
            if (errorMessage) {
                this.setState({
                    errorPassword: errorMessage,
                });
                return false; // Prevent form submission when validation fails
            }

            // If no error, clear the error message and set the password
            this.setState({
                errorPassword: null, // Clear any existing error messages
                fields: { ...this.state.fields, password: value },
            });
        }
        if (name === "confirm_password") {
            let errorConfirmPassword = "";

            if (
                errorConfirmPassword !== null &&
                this.state.fields.password !== value
            ) {
                errorConfirmPassword = "Password and Confirm Password should be same";
            } else {
                errorConfirmPassword = null; // Clear any existing error messages
            }

            if (errorConfirmPassword) {
                this.setState({
                    errorConfirmPassword: errorConfirmPassword,
                });
                return false;
            }
            this.setState({
                errorConfirmPassword: null,
                fields: {
                    ...this.state.fields,
                    confirm_password: value,
                },
            });
        }
        this.setState({
            fields: {
                ...this.state.fields,
                [name]: value,
            },
        });
    }

    //   handlePasswordChange = () => {
    //     const { password } = this.state.fields;
    //     let errorMessage = "";

    //     // Check length
    //     if (password.length < 8 || password.length > 16) {
    //       errorMessage = "Password must be 8 to 16 characters long";
    //     }

    //     // Check for at least one lowercase letter
    //     else if (!/[a-z]/.test(password)) {
    //       errorMessage = "Password must contain at least one lowercase letter";
    //     }

    //     // Check for at least one uppercase letter
    //     else if (!/[A-Z]/.test(password)) {
    //       errorMessage = "Password must contain at least one uppercase letter";
    //     }

    //     // Check for at least one numeric character
    //     else if (!/\d/.test(password)) {
    //       errorMessage = "Password must contain at least one numeric character";
    //     }

    //     // Check for at least one special character
    //     else if (!/[@$!%*?&#_]/.test(password)) {
    //       errorMessage =
    //         "Password must contain at least one special character (@, $, !, %, *, ?, &, #, _)";
    //     }

    //     // Check for spaces
    //     else if (/\s/.test(password)) {
    //       errorMessage = "Spaces are not allowed in the password";
    //     }

    //     // Check for the word 'password'
    //     else if (/password/i.test(password)) {
    //       errorMessage = "The word 'password' is not allowed in the password";
    //     }

    //     // If there's an error, set the error message and prevent form submission
    //     if (errorMessage) {
    //       this.setState({
    //         errorPassword: errorMessage,
    //       });
    //       return false; // Prevent form submission when validation fails
    //     }

    //     // If no error, clear the error message and set the password
    //     this.setState({
    //       errorPassword: "", // Clear any existing error messages
    //       fields: { ...this.state.fields, password: password },
    //     });

    //     return true;
    //   };

    handleUpload(event) {
        const file = event.target.files[0];

        if (file && file.name.match(/\.(jpg|jpeg|png)$/)) {
            this.setState({ imageTypeValidation: false });
        }
        if (file && file.size < 5000000) {
            this.setState({ imageSizeValidation: false });
        }

        this.setState({
            fields: {
                ...this.state.fields,
                profile_image: file,
            },
        });
    }

    clearImage() {
        this.setState({
            fields: { ...this.state.fields, profile_image: null },
        });
    }

    // Close  modal box method
    _handleCancelAction() {
        $("#myModal").css("display", "none");
    }

    // Validation Before submit
    checkIsCardSelected(selectedPaymentType) {
        let $returnVal = false;
        selectedPaymentType.forEach((ele) => {
            if (ele.status == "1") {
                $returnVal = true;
            }
        });
        return $returnVal;
    }

    handleSubmit(event) {
        this.checkValidation(event);
    }

    checkValidation(event) {
        // const isPasswordValid = this.handlePasswordChange();
        // if (!isPasswordValid) {
        //   // If password validation fails, do not submit the form
        //   return;
        // }
        if (
            this.state.fields.profile_image &&
            !this.state.fields.profile_image.name.match(/\.(jpg|jpeg|png)$/)
        ) {
            this.setState({ imageTypeValidation: true });
            return false;
        }

        if (
            this.state.fields.profile_image &&
            this.state.fields.profile_image.size > 5000000
        ) {
            this.setState({ imageSizeValidation: true });
            return false;
        }

        // if (!this.state.fields.confirm_password) {
        //   let errorConfirmPassword = "";
        //   if (this.state.fields.password !== this.state.fields.confirm_password) {
        //     errorConfirmPassword = "Password and Confirm Password should be same";
        //   }
        //   if (errorConfirmPassword) {
        //     this.setState({
        //       errorConfirmPassword: errorConfirmPassword,
        //     });
        //     return false;
        //   }
        //   this.setState({
        //     errorConfirmPassword: "", // Clear any existing error messages
        //     fields: {
        //       ...this.state.fields,
        //       confirm_password: this.state.fields.confirm_password,
        //     },
        //   });
        // }

        if (this.state.fields.password !== this.state.fields.confirm_password) {
            notify.error("Password and Confirm Password should be same");
            return;
        }

        if (
            this.validator.allValid() &&
            !this.state.errorPassword &&
            !this.state.errorConfirmPassword
        ) {
            const fields = this.state.fields;
            let formData = new FormData();
            // Iterate through the fields in your state object
            for (const fieldName in fields) {
                if (
                    fields.hasOwnProperty(fieldName) &&
                    fields[fieldName] !== undefined
                ) {
                    const fieldValue = fields[fieldName];
                    // If it's a file (profile_image), append it as a file
                    if (fieldValue instanceof File) {
                        formData.append(fieldName, fieldValue, fieldValue.name);
                    } else {
                        formData.append(fieldName, fieldValue);
                    }
                }
            }
            formData.append("new_pin", "12312");
            formData.append("confirm_pin", "12312");

            businessCustomersService
                .createBusinessUser(formData, this.state.timeZone)
                .then((res) => {
                    if (!res.success) {
                        if (typeof res.message == "string") {
                            notify.error(res.message);
                        } else {
                            Object.keys(res.message).forEach((element) => {
                                if (
                                    res.message[element] &&
                                    typeof res.message[element] != "string"
                                ) {
                                    res?.message[element].forEach((error) => {
                                        notify.error(error);
                                    });
                                }
                            });
                        }
                    } else {
                        notify.success(res.message);
                        history.push("/admin/business_customers");
                        event.preventDefault();
                    }
                });
        } else {
            this.validator.showMessages();
        }
    }

    handleKeyPress = (event) => {
        // Check if the pressed key is the minus key (key code 45)
        if (event.keyCode === 45 || event.which === 45) {
            event.preventDefault(); // Prevent the minus key from being entered
        }
    };

    togglePasswordVisibility() {
        this.setState({ showPassword: !this.state.showPassword });
    }
    toggleConfirmPasswordVisibility() {
        this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
    }

    render() {
        return (
            <CCard>
                <CCardHeader>
                    Add Business Customer
                    <div className="card-header-actions">
                        <CTooltip content={globalConstants.BACK_MSG}>
                            <CLink
                                className="btn btn-danger btn-sm"
                                aria-current="page"
                                to="/admin/business_customers"
                            >
                                {" "}
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
                            </CLink>
                        </CTooltip>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CFormGroup>
                        <CLabel htmlFor="nf-name">Company Name</CLabel>
                        <CInput
                            type="text"
                            id="company_name"
                            name="company_name"
                            placeholder="Enter Company Name"
                            autoComplete="company_name"
                            onChange={this.handleChange}
                        />
                        <CFormText className="help-block">
                            {this.validator.message(
                                "company_name",
                                this.state.fields.company_name,
                                "required|alpha_space",
                                {
                                    className: "text-danger",
                                }
                            )}
                        </CFormText>
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel htmlFor="nf-email">Email</CLabel>
                        <CInput
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Email "
                            autoComplete="email"
                            onChange={this.handleChange}
                        />
                        <CFormText className="help-block">
                            {this.validator.message(
                                "email",
                                this.state.fields.email,
                                "required|email",
                                {
                                    className: "text-danger",
                                }
                            )}
                        </CFormText>
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel htmlFor="nf-name">
                            Chamber of Commerce{" "}
                            <span className="smaller-note">(not older than 2 months)</span>
                        </CLabel>
                        <CInput
                            type="text"
                            id="business_id"
                            name="business_id"
                            placeholder="Enter Chamber of Commerce"
                            autoComplete="name"
                            onChange={this.handleChange}
                        />
                        <CFormText className="help-block">
                            {this.validator.message(
                                "business_id",
                                this.state.fields.business_id,
                                "required",
                                {
                                    className: "text-danger",
                                }
                            )}
                        </CFormText>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="nf-name">Business Category</CLabel>
                        <CSelect
                            custom
                            name="business_category_id"
                            id="select"
                            onChange={this.handleChange}
                        >
                            <option value="">-- Enter Business Category --</option>;
                            {this.state.category_list?.map((ct, key) => {
                                return (
                                    <option key={key} value={ct.id}>
                                        {capitalize(ct.name)}
                                    </option>
                                );
                            })}
                        </CSelect>
                        <CFormText className="help-block">
                            {this.validator.message(
                                "business_category_id",
                                this.state.fields.business_category_id,
                                "required",
                                {
                                    className: "text-danger",
                                }
                            )}
                        </CFormText>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="nf-name">Mobile Number</CLabel>
                        <div className="phone_with_ccode">
                            <div className="con_selectWrap">
                                <CSelect
                                    custom
                                    name="country_code"
                                    id="select"
                                    // onChange={this.handleChange}
                                    onChange={this.handleCountryChange}
                                // value={this.state.fields.country}
                                >
                                    <option value="">-- Country Code--</option>;
                                    {this.state?.countryData?.map((e, key) => {
                                        return (
                                            <option key={key} value={e.phonecode} data-iso={e.iso}>
                                                {e.phonecode} {e.country_name}
                                            </option>
                                        );
                                    })}
                                </CSelect>
                                <CFormText className="help-block">
                                    {this.validator.message(
                                        "country_code",
                                        this.state.fields.country_code,
                                        `required`,
                                        { className: "text-danger" }
                                    )}
                                </CFormText>
                            </div>
                            <div className="phone_num_wrap">
                                <CInput
                                    type="number"
                                    id="mobile_number"
                                    name="mobile_number"
                                    placeholder="Enter Mobile Number "
                                    autoComplete="name"
                                    value={this.state.fields.mobile_number}
                                    onChange={this.handleChange}
                                    onKeyPress={this.handleKeyPress}
                                />
                                <CFormText className="help-block">
                                    {this.validator.message(
                                        "mobile_number",
                                        this.state.fields.mobile_number,
                                        `required|numeric|min:6|max:7|regex:^[0-9]*$`,
                                        { className: "text-danger" }
                                    )}
                                </CFormText>
                            </div>
                        </div>
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel htmlFor="nf-name">Country</CLabel>
                        <CSelect
                            custom
                            name="country"
                            id="country"
                            // onChange={this.handleCountryChange}
                            value={this.state.fields.country}
                            disabled={true}
                        >
                            <option value="">-- Country --</option>;
                            {this.state?.countryData?.map((e, key) => {
                                return (
                                    <option key={key} value={e.iso}>
                                        {e.country_name}
                                    </option>
                                );
                            })}
                        </CSelect>
                        <CFormText className="help-block">
                            {this.validator.message(
                                "country",
                                this.state.fields.country,
                                "required",
                                {
                                    className: "text-danger",
                                }
                            )}
                        </CFormText>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="nf-name">City</CLabel>
                        <CSelect
                            custom
                            name="city"
                            id="city"
                            onChange={this.handleChange}
                        // onChange={this.handleCityChange}
                        // value={this.state.fields.city}
                        >
                            <option value="">-- City --</option>;
                            {this.state?.cityData?.map((e, key) => {
                                return (
                                    <option key={key} value={e.city_name}>
                                        {e.city_name}
                                    </option>
                                );
                            })}
                        </CSelect>
                        <CFormText className="help-block">
                            {this.validator.message(
                                "city",
                                this.state.fields.city,
                                "required",
                                {
                                    className: "text-danger",
                                }
                            )}
                        </CFormText>
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel htmlFor="nf-name">Address</CLabel>
                        <CInput
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Enter Address"
                            autoComplete="off"
                            onChange={this.handleChange}
                        />
                        <CFormText className="help-block">
                            {this.validator.message(
                                "address",
                                this.state.fields.address,
                                "required",
                                {
                                    className: "text-danger",
                                }
                            )}
                        </CFormText>
                    </CFormGroup>

                    <CFormGroup row>
                        <CCol md="2">Profile Image</CCol>

                        <CCol
                            sm="2"
                            style={{ position: "relative" }}
                            onClick={this.clearImage}
                        >
                            <img
                                src={
                                    this.state.fields.profile_image
                                        ? URL.createObjectURL(this.state.fields.profile_image)
                                        : "/avatars/default-avatar.png"
                                }
                                className=""
                                width={100}
                            />
                            {this.state.fields.profile_image && (
                                <button
                                    type="button"
                                    className="btn"
                                    style={{
                                        position: "absolute",
                                        top: "-10px",
                                        right: "-15px",
                                        padding: "0px 5px",
                                        fontSize: "12px",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                    }}
                                >
                                    <FontAwesomeIcon icon={faWindowClose} />
                                </button>
                            )}
                        </CCol>
                        <CCol sm="5">
                            <CInput
                                type="file"
                                id="profile_image"
                                name="profile_image"
                                placeholder="Browse Logo "
                                autoComplete="profile_image "
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
                                        Image size is greater than 5MB. Please upload image below
                                        5MB.
                                    </div>
                                </small>
                            )}
                        </CCol>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="nf-name">Password</CLabel>
                        <CInputGroup>
                            <CInput
                                type={this.state.showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter Password"
                                autoComplete="new-password"
                                onChange={this.handleChange}
                            />
                            <CInputGroupPrepend>
                                <CInputGroupText onClick={this.togglePasswordVisibility}>
                                    <FontAwesomeIcon
                                        icon={this.state.showPassword ? faEyeSlash : faEye}
                                    />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                        </CInputGroup>
                        <CFormText className="help-block">
                            {!this.state.errorPassword &&
                                this.validator.message(
                                    "password",
                                    this.state.fields.password,
                                    "required",
                                    {
                                        className: "text-danger",
                                    }
                                )}

                            {/* Render the custom error message if errorPassword is set */}
                            {this.state.errorPassword && (
                                <div className="text-danger">{this.state.errorPassword}</div>
                            )}
                        </CFormText>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="nf-name">Confirm Password</CLabel>
                        <CInputGroup>
                            <CInput
                                type={this.state.showConfirmPassword ? "text" : "password"}
                                id="confirm_password"
                                name="confirm_password"
                                placeholder="Enter Confirm Password "
                                autoComplete="confirm_password"
                                onChange={this.handleChange}
                            />
                            <CInputGroupPrepend>
                                <CInputGroupText onClick={this.toggleConfirmPasswordVisibility}>
                                    <FontAwesomeIcon
                                        icon={this.state.showConfirmPassword ? faEyeSlash : faEye}
                                    />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                        </CInputGroup>
                        <CFormText className="help-block">
                            {!this.state.errorConfirmPassword &&
                                this.validator.message(
                                    "confirm_password",
                                    this.state.fields.confirm_password,
                                    "required",
                                    {
                                        className: "text-danger",
                                    }
                                )}

                            {/* Render the custom error message if errorConfirmPassword is set */}
                            {this.state.errorConfirmPassword && (
                                <div className="text-danger">
                                    {this.state.errorConfirmPassword}
                                </div>
                            )}
                        </CFormText>
                        <CFormText className="help-block confirm_password"></CFormText>
                    </CFormGroup>
                </CCardBody>

                <CCardFooter>
                    <CButton
                        type="button"
                        size="sm"
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        {" "}
                        <FontAwesomeIcon icon={faSave} className="mr-1" /> Submit
                    </CButton>
                    &nbsp;
                    <CLink
                        className="btn btn-danger btn-sm"
                        aria-current="page"
                        to="/admin/business_customers"
                    >
                        {" "}
                        <FontAwesomeIcon icon={faBan} className="mr-1" /> Cancel
                    </CLink>
                </CCardFooter>
            </CCard>
        );
    }
}

export default Business_Customer_Add;
