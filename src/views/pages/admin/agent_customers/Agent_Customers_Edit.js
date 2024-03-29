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
import {
  faArrowLeft,
  faBan,
  faSave,
  faSlash,
} from "@fortawesome/free-solid-svg-icons";
import { agentService } from "../../../../services/admin/agent.service";
import { number } from "prop-types";
import {
  addObjToFormData,
  setLoading,
} from "../../../../_helpers/common-utility";
import "./page.css";
// import { setLoading } from '../../_helpers';

class Agent_Customers_Edit extends React.Component {
  constructor(props) {
    super(props);
    //Identify user has access this page or not

    this.state = {
      fields: {
        _id: this.props.match.params.id,
        user_type: "agent",
        first_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        city: "",
        country_code: "",
        country: "",
        address: "",
        commission_type: "",
        commission_amount: "",
        system_commission_type: "",
        system_commission_amount: "",
        card_commission: [],
        is_kyc: true,
      },
      countryData: {},
      cityData: [],
      collectionData: [],
      collectionType: [],
      updatedCollectionType: [],
      imageTypeValidation: false,
      imageSizeValidation: false,
      newProfileImage: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.permssionChange = this.permssionChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleMergeArrays = this.mergeArrays.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCheckboxChangeKYC = this.handleCheckboxChangeKYC.bind(this);
  }

  componentDidMount() {
    agentService.getCountry().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
          notify.error("Country Not Found");
          history.push("/admin/agent_customers");
        }

        this.setState({ countryData: res.data });
      }
    });

    agentService.getCollectionType().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
          notify.error("Collection Types Not Found");
          history.push("/admin/agent_customers");
        }

        this.setState({ collectionData: res.data });
        let arrayObj = [];
        res?.data?.map((e, i) => {
          let obj = {
            id: e.id,
            status: "",
            type: "",
            amount: "",
            collection_type: e.collection_type,
          };
          arrayObj.push(obj);
        });
        this.setState({ collectionType: arrayObj });
      }
    });

    setTimeout(() => {
      if (
        _canAccess(
          this.props.module_name,
          this.props.action,
          "/admin/agent_customers"
        )
      ) {
        var postData = {
          account_number: this.state.fields._id,
        };

        agentService.getAgentDetails(postData).then((res) => {
          if (res.status === false) {
            notify.error(res.message);
          } else {
            if (res.data == null) {
              notify.error("Agent not found");
              history.push("/admin/agent_customers");
            }

            this.setState({
              ...this.state,
              fields: res.data,
            });

            const country_index = this.state.countryData.country_list.findIndex(
              (e) => e.iso === res.data.country
            );

            const { iso } =
              this.state.countryData.country_list.find(
                (e) => e.iso === res.data.country
              ) || {};
            const statustmp = res.data.status == 0 ? 0 : 1;
            const kyctmp = res.data.is_kyc === false ? false : true;
            this.setState({
              cityData: [...this.state.countryData.city_list[iso]],
              city: res.data.city,
              country: country_index,
              status: statustmp,
              is_kyc: kyctmp,
            });
          }
        });
      }
    }, 700);
  }

  // async componentDidMount() {
  //   setTimeout(async () => {
  //     // Check for permissions
  //     if (
  //       !_canAccess(
  //         this.props.module_name,
  //         this.props.action,
  //         "/admin/agent_customers"
  //       )
  //     ) {
  //       notify.error("You don't have permission to view agent details.");
  //       return;
  //     }
  //     try {
  //       // Fetch country data
  //       const countryRes = await agentService.getCountry();
  //       if (countryRes.status === false) throw new Error(countryRes.message);
  //       if (!countryRes.data) {
  //         notify.error("Country Not Found");
  //         history.push("/admin/agent_customers");
  //         return;
  //       }
  //       if (countryRes?.data) {
  //         this.setState({ countryData: countryRes?.data });
  //       }

  //       // Fetch collection type data
  //       const collectionRes = await agentService.getCollectionType();
  //       if (collectionRes.status === false)
  //         throw new Error(collectionRes.message);
  //       if (!collectionRes.data) {
  //         notify.error("Collection Types Not Found");
  //         history.push("/admin/agent_customers");
  //         return;
  //       }
  //       const collectionArray = collectionRes.data?.map((e) => ({
  //         id: e.id,
  //         status: "",
  //         type: "",
  //         amount: "",
  //         collection_type: e.collection_type,
  //       }));
  //       this.setState({
  //         collectionData: collectionRes.data,
  //         collectionType: collectionArray,
  //       });

  //       // Fetch agent details
  //       const postData = { account_number: this.state.fields._id };
  //       const agentRes = await agentService.getAgentDetails(postData);
  //       if (agentRes.status === false) throw new Error(agentRes.message);
  //       if (!agentRes.data) {
  //         notify.error("Agent not found");
  //         history.push("/admin/agent_customers");
  //         return;
  //       }
  //       const country = this.state.countryData.country_list?.find(
  //         (e) =>
  //           e.country_name.toLowerCase() === agentRes.data.country.toLowerCase()
  //       );
  //       const iso = country?.iso;
  //       const countryIndex = this.state.countryData.country_list?.findIndex(
  //         (e) => e.iso === iso
  //       );
  //       this.setState({
  //         fields: agentRes.data,
  //         // cityData: [...this.state.countryData.city_list[iso]],
  //         cityData:
  //           this.state.countryData.city_list &&
  //           this.state.countryData.city_list[iso]
  //             ? [...this.state.countryData.city_list[iso]]
  //             : [],
  //         city: agentRes.data.city,
  //         country: countryIndex,
  //         status: agentRes.data.status == 0 ? 0 : 1,
  //       });
  //     } catch (error) {
  //       // Handle any unexpected error
  //       notify.error(error.message || "An unexpected error occurred.");
  //     }
  //   }, 700);
  // }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.fields.card_commission !== prevState.fields.card_commission
    ) {
      // if(this.state.collectionType !== prevState.collectionType){
      setTimeout(() => {
        const abc = this.handleMergeArrays(this.state.collectionType);
      }, 1500);
    }
  }
  mergeArrays(arrayObj) {
    const { fields } = this.state;
    const { card_commission } = fields;
    const arr2 = card_commission;
    // Create a mapping of arr2 by id for efficient lookup
    const arr2Map = new Map(arr2.map((item) => [item.id, item]));

    // Merge arr1 with data from arr2 based on id
    const mergedArray = arrayObj.map((item) => {
      const arr2Item = arr2Map.get(item.id);
      if (arr2Item) {
        // If there's a matching item in arr2, update status and amount
        return {
          ...item,
          status: arr2Item.status,
          amount: arr2Item.amount,
          type: arr2Item.type || "",
        };
      }
      return item; // If no matching item, keep the original item from arr1
    });
    this.setState({ updatedCollectionType: mergedArray });
    return mergedArray;
  }

  handleCountryChange(e) {
    // if (e.target.value == '') {
    //   this.setState({ city: '', country: '' });
    // } else {
    setLoading(true);
    const cityCode = this.state.countryData.country_list[e.target.value].iso;
    const tmp = [...this.state.countryData.city_list[cityCode]];
    this.setState({ cityData: tmp, country: e.target.value });
    setLoading(false);
    // }
  }

  handleCityChange(e) {
    this.setState({ city: e.target.value });
    this.setState({
      fields: {
        ...this.state.fields,
        city: e.target.value,
      },
    });
  }

  handleCheckboxChange(event) {
    const target = event.target;
    const tmp = target.checked ? 1 : 0;

    this.setState({
      fields: {
        ...this.state.fields,
        status: tmp,
      },
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

  handleUpload(event) {
    setLoading(true);
    const file = event.target.files[0];
    const filename = event.target.files[0].name;

    if (file && file.name.match(/\.(jpg|jpeg|png)$/)) {
      this.setState({ imageTypeValidation: false });
    }
    if (file && file.size < 5000000) {
      this.setState({ imageSizeValidation: false });
    }

    this.setState({
      newProfileImage: file,
    });
    setLoading(false);
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

  handlePaymentTypeChange(index, event, objField) {
    const target = event.target;
    const value =
      target.type === "checkbox" ? (target.checked ? 1 : 0) : target.value;

    const updatedCardCommission = [...this.state.updatedCollectionType];

    if (target.type === "checkbox") {
      updatedCardCommission[index] = {
        ...updatedCardCommission[index],
        id: parseInt(target.value),
      };
    }
    updatedCardCommission[index] = {
      ...updatedCardCommission[index],
      [objField]: value,
    };
    if (target.type === "checkbox" && value == 0) {
      updatedCardCommission[index] = {
        ...updatedCardCommission[index],
        type: "",
        amount: "",
      };
    }
    this.setState({ updatedCollectionType: updatedCardCommission });
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

  checkIsCardSelected(selectedPaymentType) {
    let $returnVal = false;
    selectedPaymentType.forEach((ele) => {
      if (ele.status == "1") {
        $returnVal = true;
      }
    });
    return $returnVal;
  }

  handleSubmit() {
    if (
      this.state.newProfileImage &&
      !this.state.newProfileImage.name.match(/\.(jpg|jpeg|png)$/)
    ) {
      this.setState({ imageTypeValidation: true });
      return false;
    }

    if (
      this.state.newProfileImage &&
      this.state.newProfileImage.size > 5000000
    ) {
      this.setState({ imageSizeValidation: true });
      return false;
    }
    const newData = this.state.updatedCollectionType.map(
      ({ collection_type, ...rest }) => rest
    );
    this.setState({
      fields: {
        ...this.state.fields,
        card_commission: newData,
      },
    });

    if (this.validator.allValid()) {
      if (!this.checkIsCardSelected(this.state?.updatedCollectionType)) {
        notify.error("Please select atleast one payment type");
        return false;
      }

      let formData = new FormData();
      if (this.state.newProfileImage) {
        formData.append("profile_image", this.state.newProfileImage);
      }
      formData.append("first_name", this.state.fields.first_name);
      formData.append("last_name", this.state.fields.last_name);
      formData.append("account_number", this.state.fields.account_number);
      formData.append("address", this.state.fields.address);
      formData.append("mobile_number", this.state.fields.mobile_number);
      formData.append("country_code", this.state.fields.country_code);

      formData.append(
        "country",
        this.state.countryData.country_list[this.state.country].iso
      );
      formData.append("city", this.state.fields.city);

      formData.append("commission_amount", this.state.fields.commission_amount);
      formData.append("commission_type", this.state.fields.commission_type);

      formData.append(
        "system_commission_amount",
        this.state.fields.system_commission_amount
      );
      formData.append(
        "system_commission_type",
        this.state.fields.system_commission_type
      );

      formData.append("status", this.state.fields.status);
      formData.append("kyc_status", this.state.is_kyc);
      if (this.state.is_kyc === true) {
        formData.append("kyc_approved_status", "approved");
      }
      if (this.state.is_kyc === false) {
        formData.append("kyc_approved_status", "inprogress");
      }
      formData.append("email", this.state.fields.email);

      // formData.append("card_commission", this.state.fields.card_commission);

      if (this.state.fields.newProfileImage) {
        formData.append("profile_image", this.state.fields.newProfileImage);
      }

      for (const key in newData) {
        // if(key == 'card_commission')
        if (newData[key].type != "" && newData[key].amount != "")
          addObjToFormData(newData[key], `card_commission[${key}]`, formData);
      }

      agentService.updateAgent(formData).then((res) => {
        if (res.success === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/agent_customers");
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

  render() {
    var { module_permission, newProfileImage } = this.state;

    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                Edit Agent Customer
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/agent_customers"
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
                  <CLabel htmlFor="nf-name">First Name</CLabel>
                  <CInput
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="Enter First Name "
                    autoComplete="name"
                    value={this.state?.fields?.first_name}
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "first_name",
                      this.state?.fields?.first_name,
                      "required|alpha_space",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Last Name</CLabel>
                  <CInput
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="Enter Last Name "
                    autoComplete="name"
                    value={this.state?.fields?.last_name}
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "last_name",
                      this.state?.fields?.last_name,
                      "required|alpha_space",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Account Number</CLabel>
                  <CInput
                    type="text"
                    id="account_number"
                    name="account_number"
                    placeholder="Enter Account Number "
                    autoComplete="name"
                    value={this.state?.fields?.account_number}
                    onChange={this.handleChange}
                    disabled={true}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "account_number",
                      this.state?.fields?.account_number,
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
                    value={this.state?.fields?.mobile_number}
                    onChange={this.handleChange}
                    disabled={true}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "mobile_number",
                      this.state?.fields?.mobile_number,
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
                    value={this.state?.fields?.email}
                    onChange={this.handleChange}
                    disabled={true}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "email",
                      this.state?.fields?.email,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "email",
                      this.state?.fields?.email,
                      "email",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="nf-name">Country</CLabel>
                  <CSelect
                    custom
                    name="country"
                    id="country"
                    onChange={this.handleCountryChange}
                    value={this.state.country}
                    disabled={true}
                  >
                    <option value="">-- Country --</option>;
                    {this.state?.countryData?.country_list?.map((e, key) => {
                      return (
                        <option key={key} value={key}>
                          {e.country_name}
                        </option>
                      );
                    })}
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "country",
                      this.state?.fields?.country,
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
                    onChange={this.handleCityChange}
                    value={this.state.city}
                  >
                    <option value="">-- city --</option>;
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
                      this.state?.fields?.city,
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
                    autoComplete="address"
                    onChange={this.handleChange}
                    value={this.state?.fields?.address}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "address",
                      this.state?.fields?.address,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Commission Type</CLabel>
                  <CSelect
                    custom
                    name="commission_type"
                    id="commission_type"
                    onChange={this.handleChange}
                    value={this.state?.fields?.commission_type}
                  >
                    <option value={""}>{"Select Commission Type"}</option>
                    <option value={"fixed"}>{"Fixed"}</option>
                    <option value={"percentage"}>{"Percentage"}</option>
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "commission_type",
                      this.state?.fields?.commission_type,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
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
                    value={this.state?.fields?.commission_amount}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "commission_amount",
                      this.state?.fields?.commission_amount?.toString(),
                      "required|numeric|min:0,num|max:6",
                      {
                        className: "text-danger",
                      }
                    )}
                  </CFormText>
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="nf-name">System Commission Type</CLabel>
                  <CSelect
                    custom
                    name="system_commission_type"
                    id="system_commission_type"
                    onChange={this.handleChange}
                    value={this.state?.fields?.system_commission_type}
                  >
                    <option value={""}>{"Select Commission Type"}</option>
                    <option value={"fixed"}>{"Fixed"}</option>
                    <option value={"percentage"}>{"Percentage"}</option>
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "system_commission_type",
                      this.state?.fields?.system_commission_type,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
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
                    value={this.state?.fields?.system_commission_amount}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "system_commission_amount",
                      this.state?.fields?.system_commission_amount?.toString(),
                      "required|numeric|min:0,num|max:6",
                      {
                        className: "text-danger",
                      }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="2">Profile Image</CCol>

                  <CCol sm="2">
                    <img
                      src={
                        newProfileImage
                          ? URL.createObjectURL(newProfileImage)
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
                      id="newProfileImage"
                      name="newProfileImage"
                      placeholder="Browse Logo "
                      autoComplete="newProfileImage "
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
                  </CCol>
                </CFormGroup>

                {/* <CFormGroup row>
                  <CCol md="2">QR Code</CCol>

                  <CCol sm="2">
                    <img
                      src={this.state.fields.qr_code_image}
                      className=""
                      width={100}
                    />
                  </CCol>
                </CFormGroup> */}

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

                <CFormGroup row>
                  <CCol md="1">KYC</CCol>

                  <CCol sm="11">
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
                          //   new Date(this.state.fields.kyc_expiration_date) >
                          //   new Date()
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
                          onChange={this.handleCheckboxChangeKYC}
                        />
                      )}
                    </CFormGroup>
                  </CCol>
                </CFormGroup>

                <CFormGroup className="limits-wrap">
                  <div className="row mb-3 mb-lg-4 limits-heading">
                    <div className="col-md-6 col">
                      <p>Payment Types</p>
                    </div>
                  </div>
                </CFormGroup>
                {this.state?.updatedCollectionType?.map((ele, index) => {
                  return (
                    <CFormGroup row key={ele.id}>
                      {/* <CCol md="1" >
                      <CInput
                      type="checkbox"
                      name="status"
                      id={`${'status'+ele.id}`}
                      value={ele.id}
                      onChange={(e)=>{this.handlePaymentTypeChange(index, e, 'status')}}
                      checked={ele.status}
                      />
                      
                      </CCol> */}

                      <CCol className="customCBWrap">
                        <CInput
                          type="checkbox"
                          name="status"
                          id={`${"status" + ele.id}`}
                          value={ele.id}
                          onChange={(e) => {
                            this.handlePaymentTypeChange(index, e, "status");
                          }}
                          checked={ele.status}
                        />
                        <CLabel
                          type="text"
                          htmlFor={`${"status" + ele.id}`}
                          id={ele.id}
                          value={ele.collection_type}
                        >
                          {ele.collection_type}
                        </CLabel>
                      </CCol>
                      <CCol>
                        <CSelect
                          custom
                          name="type"
                          id={`${"type" + ele.id}`}
                          value={ele.type}
                          onChange={(e) => {
                            this.handlePaymentTypeChange(index, e, "type");
                          }}
                          disabled={ele.status === 1 ? false : true}
                          // id="system_commission_type"
                        >
                          <option value={""}>{"Select Type"}</option>
                          <option value={"fixed"}>{"Fixed"}</option>
                          <option value={"percentage"}>{"Percentage"}</option>
                        </CSelect>
                        <CFormText className="help-block">
                          {ele.status == 1 &&
                            this.validator.message(
                              "type",
                              ele.type,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
                        </CFormText>
                      </CCol>
                      <CCol>
                        <CInput
                          type="number"
                          id={`${"amount" + ele.id}`}
                          name="amount"
                          placeholder="Enter Amount"
                          autoComplete="amount"
                          value={ele.amount}
                          onChange={(e) => {
                            this.handlePaymentTypeChange(index, e, "amount");
                          }}
                          onKeyPress={this.handleKeyPress}
                          disabled={ele.status === 1 ? false : true}
                        />
                        <CFormText className="help-block">
                          {ele.status == 1 &&
                            this.validator.message(
                              "amount",
                              ele.amount.toString(),
                              "required|numeric|min:0,num|max:6",
                              {
                                className: "text-danger",
                              }
                            )}
                        </CFormText>
                      </CCol>
                    </CFormGroup>
                  );
                })}
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
                  to="/admin/agent_customers"
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

export default Agent_Customers_Edit;
