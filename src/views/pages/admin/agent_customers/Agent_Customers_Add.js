import React, { Component } from "react";
import slugify from "react-slugify";
import { _canAccess } from "../../../../_helpers/index";
import { addObjToFormData } from "../../../../_helpers/common-utility";
import "./page.css";
import {
  CButton,
  CSelect,
  CFormGroup,
  CLabel,
  CFormText,
  CInput,
  CCol,
  CLink,
  CSwitch,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CTooltip,
  CRow,
  CTabPane,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CNavItem,
  CNavLink,
  CTabContent,
  CNav,
  CTabs,
  CModal,
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import { pageService } from "../../../../services/admin/page.service";
import { notify, history } from "../../../../_helpers/index";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Editor } from "@tinymce/tinymce-react";
import { globalConstants } from "../../../../constants/admin/global.constants";
import Dropzone from "react-dropzone-uploader";
import { mediaService } from "../../../../services/admin/media.service";
import { authHeaderMutlipart } from "../../../../_helpers/auth-header";
import "react-dropzone-uploader/dist/styles.css";

import "./Draft.css";
import { agentService } from "services/admin/agent.service";

class Agent_Customers_Add extends Component {
  constructor(props) {
    super(props);

    // Define State by vivek
    this.state = {
      fields:{
        user_type:'agent',
        first_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        city: "",
        country_code: "",
        country:"",
        address: "",
        commission_type: "",
        commission_amount: "",
        system_commission_type: "",
        system_commission_amount: "",
        card_commission: [
          // cash = {},
        ]
      },
      countryCityRes:[],
      countryData : [],
      cityData : [],
      collectionData : [],
      imageTypeValidation: false,
      imageSizeValidation: false,
    };

    // Bind Methods for actions by vivek
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handlePaymentTypeChange = this.handlePaymentTypeChange.bind(this);
    this._handleCancelAction = this._handleCancelAction.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    this.getCountryCity();
    this.getCollectionTypes();
    
    setTimeout(() => {
      _canAccess(this.props.module_name, this.props.action, "/admin/agent_customers");
    }, 300);
  }

  /********** Retrive Data of Country and City  *****************/
  getCountryCity() {
    agentService.getCountry().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({ countryData: res?.data?.country_list });
        this.setState({ countryCityRes: res?.data });
      }
    });
  }

  getCollectionTypes(){
    agentService.getCollectionType().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
          notify.error("Collection Types Not Found");
          history.push("/admin/agent_customers");
        }

        this.setState({ collectionData: res.data });

        res.data.map((ele,index) => {
          this.setState((prevState) => {
            const newState = [...prevState.fields.card_commission];
            newState[index] = {
              id: ele.id,
              status: 0,
              type: "",
              amount: "",
            };
            
            return {
              fields: {
                ...prevState.fields,
                card_commission: newState,
              },
            };
          })
        })
      }
    });
  }

  // Method For Form Field
  handleCountryChange(e) {
    const { value } = e.target;
    const city = value != '' ? this.state?.countryCityRes?.city_list[value] : []
    this.setState({ cityData: city });
    this.setState({
      fields : {
        ...this.state.fields,
        country: value
      }
    });
  }

  // Method For Form Field
  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      fields : {
        ...this.state.fields,
        [name]: value,
      }
    });
  }

  handlePaymentTypeChange(index, event, objField){
    const target = event.target;
    const value = target.type === "checkbox" ? (target.checked ? 1 : 0) : target.value;
    
    const updatedCardCommission = [...this.state.fields.card_commission];
    
    if (target.type === "checkbox") {
      updatedCardCommission[index] = {...updatedCardCommission[index],'id' : parseInt(target.value)};
    }
    updatedCardCommission[index] = {...updatedCardCommission[index],[objField] : value};
    this.setState({
      fields : {
        ...this.state.fields,
        card_commission: updatedCardCommission
      }
    })
    
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
      fields:{
        ...this.state.fields,
        profile_image: file,
      }
    });
    console.log(file);
  }
  // Close  modal box method
  _handleCancelAction() {
    $("#myModal").css("display", "none");
  }

  // Validation Before submit

  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    if (
      this.state.fields.profile_image &&
      !this.state.fields.profile_image.name.match(/\.(jpg|jpeg|png)$/)
    ) {
      this.setState({ imageTypeValidation: true });
      return false;
    }

    if (this.state.fields.profile_image && this.state.fields.profile_image.size > 5000000) {
      this.setState({ imageSizeValidation: true });
      return false;
    } 

    if (this.validator.allValid()) {

      const fields = this.state.fields;
      let formData = new FormData()
      // Iterate through the fields in your state object
      for (const fieldName in fields) {
        if (fields.hasOwnProperty(fieldName)) {
          const fieldValue = fields[fieldName];
          if (fieldName == 'card_commission') {
            
            for (const key in fields) 
            {
              if(key == 'card_commission') 
              addObjToFormData(fields[fieldName], key, formData);
            }
          } else {
            // Append the field and its value to the FormData object
            formData.append(fieldName, fieldValue);
          }
        }
      }

      agentService.createAgent(formData)
      .then((res) => {
          if (!res.success) {
          notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push("/admin/agent_customers");
            event.preventDefault();
          }
        })
    } else {
      this.validator.showMessages();
    }
  }

  handleKeyPress = (event) => {
    // Check if the pressed key is the minus key (key code 45)
    if (event.keyCode === 45 || event.which === 45) {
      event.preventDefault(); // Prevent the minus key from being entered
    }
  }
  // addDefaultSrc(ev) {
  //   ev.target.src = `${process.env.REACT_APP_API_URL + "uploads/default.jpg"}`;
  // }
  // Rendering Html To Dom
  render() {
    console.log(this.state.fields);
    return (
      <CCard>
        <CCardHeader>
          Add Page
          <div className="card-header-actions">
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
          </div>
        </CCardHeader>
        <CCardBody>
          <CFormGroup>
            <CLabel htmlFor="nf-name">First Name</CLabel>
            <CInput
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Enter First Name"
              autoComplete="first_name"
              onChange={this.handleChange}
            />
            <CFormText className="help-block">
              {this.validator.message("first_name", this.state.fields.first_name, "required", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="nf-name">Last Name</CLabel>
            <CInput
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Enter Last Name"
              autoComplete="last_name"
              onChange={this.handleChange}
            />
            <CFormText className="help-block">
              {this.validator.message("last_name", this.state.fields.last_name, "required", {
                className: "text-danger",
              })}
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
              {this.validator.message('email', this.state.fields.email, 'required|email', { 
                className: 'text-danger' 
              })}
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
              onChange={this.handleChange} 
              // onChange={this.handleCountryChange}
              // value={this.state.fields.country}
            >
              <option value="">-- Country Code--</option>;
              {this.state?.countryData?.map((e, key) => {
                  return (
                    <option key={key} value={e.phonecode}>
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
                `required|numeric|min:6|max:7`,
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
              onChange={this.handleCountryChange}
              // value={this.state.fields.country}
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
              {this.validator.message("country", this.state.fields.country, "required", {
                className: "text-danger",
              })}
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
              {this.validator.message("city", this.state.fields.city, "required", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="nf-name">Address</CLabel>
            <CInput
              type="text"
              id="address"
              name="address"
              placeholder="Enter Address"
              autoComplete="address"
              onChange={this.handleChange}
            />
            <CFormText className="help-block">
              {this.validator.message("address", this.state.fields.address, "required", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="nf-name">Commission Type</CLabel>
            <CSelect
              custom
              name="commission_type"
              id="commission_type"
              onChange={this.handleChange}
              // value={this.state.fields.city}
            >
              <option value={''}>{'Select Commission Type'}</option>
              <option value={'fixed'}>{'Fixed'}</option>
              <option value={'percentage'}>{'Percentage'}</option>
            </CSelect>
            <CFormText className="help-block">
              {this.validator.message("commission_type", this.state.fields.commission_type, "required", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="nf-name">Commission Amount</CLabel>
            <CInput
              type="number"
              id="commission_amount"
              name="commission_amount"
              placeholder="Enter Commission Amount"
              autoComplete="commission_amount"
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
            <CFormText className="help-block">
              {this.validator.message("commission_amount", this.state.fields.commission_amount, "required|numeric|max:6", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="nf-name">System Commission Type</CLabel>
            <CSelect
              custom
              name="system_commission_type"
              id="system_commission_type"
              onChange={this.handleChange}
            >
              <option value={''}>{'Select Commission Type'}</option>
              <option value={'fixed'}>{'Fixed'}</option>
              <option value={'percentage'}>{'Percentage'}</option>
            </CSelect>
            <CFormText className="help-block">
              {this.validator.message("system_commission_type", this.state.fields.system_commission_type, "required", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="nf-name">System Commission Amount</CLabel>
            <CInput
              type="number"
              id="system_commission_amount"
              name="system_commission_amount"
              placeholder="Enter System Commission Amount"
              autoComplete="system_commission_amount"
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
            <CFormText className="help-block">
              {this.validator.message("system_commission_amount", this.state.fields.system_commission_amount, "required|numeric|max:6", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>
          <CFormGroup row>
                  <CCol md="2">Profile Image</CCol>

                  <CCol sm="2">
                    <img
                      src={
                        // this.state.fields.profile_image ||
                        "/avatars/default-avatar.png"
                      }
                      className=""
                      width={100}
                    />
                  </CCol>
                  <CCol sm="5">
                    <CInput
                      type="file"
                      id="profile_image"
                      name="profile_image"
                      placeholder="Browe Logo "
                      autoComplete="profile_image "
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
          <CFormGroup className="limits-wrap">
            <div className="row mb-3 mb-lg-4 limits-heading">
              <div className="col-md-6 col">
                <p>Payment Types</p>
              </div>
              
            </div>
          </CFormGroup>
          {this.state?.collectionData?.map((ele,index)=>{
            return (
              <CFormGroup row key={ele.id}>
              
                {/* <CCol md="1">
                 <CInput
                 type="checkbox"
                 name="status"
                 id={`${'status'+ele.id}`}
                 value={ele.id}
                 onChange={(e)=>{this.handlePaymentTypeChange(index, e, 'status')}}
                 
                 />
                 
                </CCol> */}
                <CCol className="customCBWrap">
                <CInput
                 type="checkbox"
                 name="status"
                 id={`${'status'+ele.id}`}
                 value={ele.id}
                 onChange={(e)=>{this.handlePaymentTypeChange(index, e, 'status')}}
                 
                 />
                  <CLabel type="text" id={ele.id} htmlFor={`${'status'+ele.id}`} value={ele.collection_type}>{ele.collection_type}</CLabel>
                </CCol>
                <CCol>
                  <CSelect
                    custom
                    name="type"
                    id={`${'type'+ele.id}`}
                    onChange={(e)=>{this.handlePaymentTypeChange(index, e, 'type')}}
                    disabled={
                      this.state.fields?.card_commission[index]?.status === 1 ? false : true
                    }
                    // id="system_commission_type"
                  >
                    <option value={''}>{'Select Type'}</option>
                    <option value={'fixed'}>{'Fixed'}</option>
                    <option value={'percentage'}>{'Percentage'}</option>
                  </CSelect>
                  <CFormText className="help-block">
                    {
                      this.state.fields?.card_commission[index]?.status == 1 && 
                      this.validator.message(
                        "type", this.state.fields?.card_commission[index]?.type, "required", {
                      className: "text-danger",
                    })}
                  </CFormText>
                  </CCol>
                  <CCol>
                  <CInput
                    type="number"
                    id={`${'amount'+ele.id}`}
                    name="amount"
                    placeholder="Enter Amount"
                    autoComplete="amount"
                    onChange={(e)=>{this.handlePaymentTypeChange(index, e, 'amount')}}
                    onKeyPress={this.handleKeyPress}
                    disabled={
                      this.state.fields?.card_commission[index]?.status === 1 ? false : true
                    }
                  />
                  <CFormText className="help-block">
                    {
                      this.state.fields?.card_commission[index]?.status == 1 && 
                      this.validator.message(
                        "amount", this.state.fields?.card_commission[index]?.amount, "required|numeric|max:6", {
                      className: "text-danger",
                    })}
                  </CFormText>
                  </CCol>
              </CFormGroup>
            )
          })}
          
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
            to="/admin/agent_customers"
          >
            {" "}
            <FontAwesomeIcon icon={faBan} className="mr-1" /> Cancel
          </CLink>
        </CCardFooter>
      </CCard>
    );
  }
}
// Export out Class component
export default Agent_Customers_Add;
