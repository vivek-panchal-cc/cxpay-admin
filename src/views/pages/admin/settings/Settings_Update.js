import React, { Component } from "react";
import $ from "jquery";

import {
  CButton,
  CFormGroup,
  CLabel,
  CInput,
  CLink,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CTooltip,
  CSelect,
  CFormText,
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import { settingsService } from "../../../../services/admin/settings.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

class Settings_Update extends Component {
  constructor(props) {
    super(props);

    /************  Define iniitla State by  ***********************/
    this.state = {
      name: "",
      initialValue: "",
      status: false,
      page_list: [],
    };

    /************************* Bind Methods for actions  **************************/

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this._handleCancelAction = this._handleCancelAction.bind(this);
  }

  /*************** * Bind Method For Form Editor **********************/
  handleEditorChange = (content, editor) => {
    this.setState({
      initialValue: content,
    });
  };

  /************************ Define  Method For Form Field **************************/
  handleChange(event, index) {
    const { name, value, type } = event.target;
    const page_list = [...this.state.page_list];

    if (type === "radio") {
      // Update the value of the selected radio button
      page_list[index].value = value;
    } else if (type === "checkbox") {
      // Update the array of checked values for checkboxes
      const checkedValue = event.target.value;
      const isChecked = event.target.checked;
      let updatedValues = [...page_list[index].value];

      // Copy existing values
      if (isChecked) {
        updatedValues.push(checkedValue);
      } else {
        updatedValues = page_list[index].value.filter(
          (val) => val !== checkedValue
        );
      }

      page_list[index].value = updatedValues;
    } else {
      // Update the value of other input types
      page_list[index].value = value;
    }

    this.setState({ page_list });
  }

  // removeUnderscore(str) {
  //   return str
  //     .split("_")
  //     .map((word) => {
  //       const capitalizedWord =
  //         word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  //       return capitalizedWord;
  //     })
  //     .join(" ");
  // }

  removeUnderscore(str) {
    const specialCases = {
      SWIFT_CODE: "Account Name",
      // Add more special cases here if needed
    };

    // Check if the str exists in specialCases, if yes, return its value
    if (specialCases.hasOwnProperty(str)) {
      return specialCases[str];
    }

    // Otherwise, capitalize and replace underscores as before
    return str
      .split("_")
      .map((word) => {
        const capitalizedWord =
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        return capitalizedWord;
      })
      .join(" ");
  }

  // Close  modal box method
  _handleCancelAction() {
    $("#myModal").css("display", "none");
  }

  /********** Retrieve Data very first time render to dom  ************************/
  componentDidMount() {
    setTimeout(() => {
      if (
        _canAccess(this.props.module_name, this.props.action, "/admin/settings")
      ) {
        settingsService.getSettings().then((res) => {
          if (res.status_code === false) {
            notify.error(res.message);
            history.push("/admin/settings");
          } else {
            if (res.data == null) {
              notify.error("Page not found");
              history.push("/admin/settings");
            } else {
              // Map the initial value of checkboxes to an array
              const updatedPageList = res.data.system_options.map((option) => {
                if (option.field_type === "checkbox") {
                  const initialValue = option.value.split(",");
                  return { ...option, value: initialValue };
                }
                return option;
              });
              this.setState({
                page_list: updatedPageList,
              });
            }
          }
        });
      }
    }, 300);
  }

  // Submit Button Handler For Create Page
  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    if (this.validator.allValid()) {
      const convertedPayload = {};
      let isValid = true;

      // Iterate over each system option and add it to the payload
      this.state.page_list.forEach((option) => {
        convertedPayload[option.system_option_name] = option.value;

        // Perform additional validation based on field_validation property
        if (option.field_validation === "number") {
          if (
            isNaN(option.value) ||
            option.value === "" ||
            !/^\d+$/.test(option.value)
          ) {
            notify.error(`${option.field_title} must be a number`);
            // this.validator.showMessageFor(option.system_option_name, {
            //   type: "required",
            //   message: `${option.field_title} must be a number`,
            // });
            isValid = false;
          }
        } else if (option.field_validation === "email") {
          if (!/^\S+@\S+\.\S+$/.test(option.value)) {
            notify.error(`${option.field_title} must be a valid email address`);
            // this.validator.showMessageFor(option.system_option_name, {
            //   type: "required",
            //   message: `${option.field_title} must be a valid email address`,
            // });
            isValid = false;
          }
        }
      });

      if (isValid) {
        settingsService.updateSettings(convertedPayload).then((res) => {
          if (res.status === "error") {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push("/admin/settings");
            event.preventDefault();
          }
        });
      } else {
        this.validator.showMessages();
      }
    } else {
      this.validator.showMessages();
    }
  }

  // Rendering Html To Dom
  render() {
    return (
      <CCard>
        <CCardHeader>
          Settings
          <div className="card-header-actions">
            <CTooltip content={globalConstants.BACK_MSG}>
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/dashboard"
              >
                {" "}
                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
              </CLink>
            </CTooltip>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* Iterate over each system option */}
          {this.state.page_list.map((option, index) => (
            <CFormGroup key={index}>
              <CLabel htmlFor={option.system_option_name}>
                {option.field_title}
              </CLabel>
              {/* Render different input fields based on field type */}
              {option.field_type === "text" && (
                <div>
                  <CInput
                    type="text"
                    id={option.system_option_name}
                    name={option.system_option_name}
                    value={option.value}
                    onChange={(e) => this.handleChange(e, index)}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      option.system_option_name,
                      option.value,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </CFormText>
                </div>
              )}
              {option.field_type === "radio" && (
                <div>
                  {Object.entries(option.field_options).map(([key, value]) => (
                    <div key={key}>
                      <input
                        type="radio"
                        id={`${option.system_option_name}_${key}`}
                        name={option.system_option_name}
                        value={key}
                        checked={option.value === key}
                        onChange={(e) => this.handleChange(e, index)}
                      />
                      <label
                        style={{ marginLeft: "5px" }}
                        htmlFor={`${option.system_option_name}_${key}`}
                      >
                        {value}
                      </label>
                    </div>
                  ))}
                  <CFormText className="help-block">
                    {this.validator.message(
                      option.system_option_name,
                      option.value,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </CFormText>
                </div>
              )}
              {option.field_type === "checkbox" && (
                <div>
                  {Object.entries(option.field_options).map(([key, value]) => (
                    <div key={key}>
                      <input
                        type="checkbox"
                        id={`${option.system_option_name}_${key}`}
                        name={option.system_option_name}
                        value={key}
                        checked={option.value?.includes(key)}
                        onChange={(e) => this.handleChange(e, index)}
                      />
                      <label
                        style={{ marginLeft: "5px" }}
                        htmlFor={`${option.system_option_name}_${key}`}
                      >
                        {value}
                      </label>
                    </div>
                  ))}
                  <CFormText className="help-block">
                    {this.validator.message(
                      option.system_option_name,
                      option.value,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </CFormText>
                </div>
              )}
              {option.field_type === "select" && (
                <div>
                  <CSelect
                    id={option.system_option_name}
                    name={option.system_option_name}
                    value={option.value}
                    onChange={(e) => this.handleChange(e, index)}
                  >
                    {Object.entries(option.field_options).map(
                      ([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      )
                    )}
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      option.system_option_name,
                      option.value,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </CFormText>
                </div>
              )}
            </CFormGroup>
          ))}
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
            to="/admin/dashboard"
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
export default Settings_Update;
