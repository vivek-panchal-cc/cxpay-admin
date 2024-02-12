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
    const value = event.target.value;
    const target = event.target;
    const name = target.name;
    const page_list = [...this.state.page_list];
    page_list[index][name] = value;
    this.setState({
      page_list: page_list,
    });
  }

  removeUnderscore(str) {
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
              this.setState({
                page_list: res.data.system_options,
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
      const convertedPayload = this.state.page_list.reduce((acc, item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        acc[key] = value;
        return acc;
      }, {});

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
          {this.state.page_list &&
            this.state.page_list?.length > 0 &&
            this.state.page_list?.map((option, index) => {
              const modifiedString = this.removeUnderscore(
                Object.keys(option)[0]
              );
              const key = Object.keys(option)[0];
              const value = option[key];
              return (
                <CFormGroup>
                  <CLabel htmlFor="nf-name">{modifiedString}</CLabel>
                  <CInput
                    type="text"
                    step="any"
                    id={key}
                    name={key}
                    placeholder="Enter Amount"
                    autoComplete="amount"
                    value={value}
                    onChange={(e) => this.handleChange(e, index)}
                  />
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
