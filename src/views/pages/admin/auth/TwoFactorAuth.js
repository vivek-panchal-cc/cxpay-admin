// components/TwoFactorAuth.js
import React, { Component, createRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CButton,
  CAlert,
  CContainer,
  CRow,
  CCol,
} from "@coreui/react";
import axios from "axios";

class TwoFactorAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: ["", "", "", "", "", ""],
      message: "",
      success: false,
      loading: false,
    };

    this.inputRefs = Array.from({ length: 6 }, () => createRef());
  }

  handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // only digits
    // if (!value) return;

    const newOtp = [...this.state.otp];
    newOtp[index] = value;
    this.setState({ otp: newOtp, message: "", success: false }, () => {
      // Focus next input
      if (index < 5 && value) {
        this.inputRefs[index + 1].current.focus();
      }
    });
  };

  handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !this.state.otp[index] && index > 0) {
      this.inputRefs[index - 1].current.focus();
    }
  };

  handleVerify = (e) => {
    e.preventDefault();
    const otpValue = this.state.otp.join("");
    const { email } = this.props;

    if (otpValue.length < 6) {
      this.setState({ message: "Please enter complete OTP", success: false });
      return;
    }

    this.setState({ loading: true });

    axios
      .post("/api/auth/verify-otp", { email, otp: otpValue })
      .then((res) => {
        const accessToken = res.data.token;
        localStorage.setItem("accessToken", accessToken);
        this.setState({ message: "OTP Verified. Logged in!", success: true });
        window.location.href = "/dashboard"; // or navigate to your route
      })
      .catch(() => this.setState({ message: "Invalid OTP", success: false }))
      .finally(() => this.setState({ loading: false }));
  };

  render() {
    const { otp, message, success, loading } = this.state;

    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="4">
              <CCard>
                {/* <CCardHeader className="text-center">Enter OTP</CCardHeader> */}
                <CCardBody>
                  <p className="mb-3 text-center">
                    Enter the 6-digit code sent to your email.
                  </p>
                  <CForm
                    onSubmit={this.handleVerify}
                    className="d-flex flex-column align-items-center"
                  >
                    <div className="d-flex" style={{ gap: "10px" }}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => this.handleChange(e, index)}
                          onKeyDown={(e) => this.handleKeyDown(e, index)}
                          ref={this.inputRefs[index]}
                          className="form-control text-center"
                          style={{ width: "40px", fontSize: "20px" }}
                        />
                      ))}
                    </div>
                    <CButton
                      type="submit"
                      color="primary"
                      className="mt-4"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </CButton>
                  </CForm>
                  {message && (
                    <CAlert
                      color={success ? "success" : "danger"}
                      className="mt-3"
                    >
                      {message}
                    </CAlert>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
}

export default TwoFactorAuth;
