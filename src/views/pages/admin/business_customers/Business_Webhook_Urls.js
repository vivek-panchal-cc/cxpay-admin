import React, { Component } from "react";
import {
  CButton,
  CInput,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormGroup,
  CLabel,
  CCardFooter,
  CCardHeader,
} from "@coreui/react";
import { ulid } from "ulid";
import { faBan, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { businessCustomersService } from "services/admin/business_customers.service";
import { notify } from "_helpers";

class Business_Webhook_Urls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_number: props.urls.merchant_account_number,
      webhookUrls: props.urls.url?.length
        ? props.urls.url.map((item) => ({
            id: item.id,
            uuid: item.uuid || ulid(),
            callback_url: item.callback_url || "",
            error: "",
          }))
        : [
            {
              id: "",
              uuid: ulid(),
              callback_url: "",
              error: "",
            },
          ],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.urls.url !== this.props.urls.url) {
      this.setState({
        account_number: this.props.urls.merchant_account_number,
        webhookUrls: this.props.urls.url?.length
          ? this.props.urls.url.map((item) => ({
              id: item.id,
              uuid: item.uuid || ulid(),
              callback_url: item.callback_url || "",
              error: "",
            }))
          : [
              {
                id: "",
                uuid: ulid(),
                callback_url: "",
                error: "",
              },
            ],
      });
    }
  }

  validateWebhookURL = (url) => {
    if (!url.trim()) return "Webhook URL is required.";
    if (!/^https:\/\//.test(url))
      return "Webhook URL must start with 'https://'.";
    if (!/^(https:\/\/[^\s/$.?#].[^\s]*)$/.test(url))
      return "Invalid webhook URL format.";
    if (url?.length > 255)
      return "Webhook URL should not exceed 255 characters.";
    if (/\s/.test(url)) return "Webhook URL should not contain spaces.";
    if (/^https:\/\/(localhost|192\.168\.)/.test(url))
      return "Local/private IPs are not allowed.";
    return "";
  };

  handleChange = (index, field, value) => {
    const updatedUrls = [...this.state.webhookUrls];
    updatedUrls[index][field] = value;
    updatedUrls[index].error = "";
    this.setState({ webhookUrls: updatedUrls });
  };

  handleAdd = () => {
    this.setState((prevState) => ({
      webhookUrls: [
        ...prevState.webhookUrls,
        {
          uuid: ulid(),
          callback_url: "",
          error: "",
        },
      ],
    }));
  };

  handleDelete = async (index, webhook) => {
    if (webhook.id) {
      let postData = {
        id: webhook.id,
        merchant_account_number: this.state.account_number,
        operation_type: "delete_merchant_callback_url",
      };
      businessCustomersService.webHookOperations(postData).then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          const updatedUrls = [...this.state.webhookUrls];
          updatedUrls.splice(index, 1);
          this.setState({ webhookUrls: updatedUrls });
        }
      });
    } else {
      // Directly remove from state if no ID (not saved yet)
      const updatedUrls = [...this.state.webhookUrls];
      updatedUrls.splice(index, 1);
      this.setState({ webhookUrls: updatedUrls });
    }
  };

  handleSubmit = () => {
    let isValid = true;
    const updatedUrls = this.state.webhookUrls.map((webhook) => {
      const error = this.validateWebhookURL(webhook.callback_url);
      if (error) isValid = false;
      return { ...webhook, error };
    });

    this.setState({ webhookUrls: updatedUrls });

    if (!isValid) {
      return;
    }

    // Prepare request data
    const updateData = this.state.webhookUrls.map((webhook) => {
      return webhook.id
        ? {
            id: webhook.id,
            uuid: webhook.uuid,
            callback_url: webhook.callback_url,
          }
        : {
            uuid: webhook.uuid,
            callback_url: webhook.callback_url,
          };
    });

    const postData = {
      update_data: updateData,
      merchant_account_number: this.state.account_number, // Pass from props
      operation_type: "update_merchant_callback_url",
    };

    businessCustomersService.webHookOperations(postData).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.props.webHookOperations({
          merchant_account_number: this.state.account_number,
          operation_type: "list_merchant_callback_url",
        });
        this.props.handleClose();
      }
    });
  };

  render() {
    return (
      <CCard className="shadow-lg">
        <div className="d-flex justify-content-end mt-3 mr-3">
          <CButton
            color="primary"
            onClick={this.handleAdd}
            className="rounded-pill shadow"
          >
            + Webhook
          </CButton>
        </div>
        <CCardBody className="webhook-urls">
          <ul>
            <li>
              The URL is required and must be a valid HTTPS link (e.g.,
              https://example.com/callback).
            </li>
            <li>
              It should not exceed 255 characters, contain spaces, or use
              local/private IPs (http://localhost or http://192.168.x.x).
            </li>
          </ul>

          {this.state.webhookUrls.map((webhook, index) => (
            <CRow key={index} className="mb-3 align-items-center">
              <CCol md={5} sm={12}>
                <CFormGroup>
                  <CLabel>Webhook Secret</CLabel>
                  <CInput
                    type="text"
                    value={webhook.uuid}
                    readOnly
                    className="p-2 rounded shadow-sm border-0 bg-light"
                  />
                </CFormGroup>
              </CCol>
              <CCol md={5} sm={12}>
                <CFormGroup>
                  <CLabel>Your Webhook URL</CLabel>
                  <CInput
                    type="text"
                    value={webhook.callback_url}
                    onChange={(e) =>
                      this.handleChange(index, "callback_url", e.target.value)
                    }
                    className={`p-2 rounded shadow-sm border ${
                      webhook.error ? "border-danger" : ""
                    }`}
                  />
                  {webhook.error && (
                    <small className="text-danger">{webhook.error}</small>
                  )}
                </CFormGroup>
              </CCol>
              <CCol md={2} sm={12} className="text-center">
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => this.handleDelete(index, webhook)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </CButton>
              </CCol>
            </CRow>
          ))}
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
          <CButton
            className="btn btn-danger btn-sm"
            aria-current="page"
            onClick={() => {
              this.props.webHookOperations({
                merchant_account_number: this.state.account_number,
                operation_type: "list_merchant_callback_url",
              });
              this.props.handleClose();
            }}
          >
            <FontAwesomeIcon icon={faBan} className="mr-1" />
            Cancel
          </CButton>
        </CCardFooter>
      </CCard>
    );
  }
}

export default Business_Webhook_Urls;
