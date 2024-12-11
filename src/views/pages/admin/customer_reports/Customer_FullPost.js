import React from "react";
import "./page.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CCardFooter,
  CLink,
  CTooltip,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "constants/admin/global.constants";
import { CChartDoughnut } from "@coreui/react-chartjs";
import { jsPDF } from "jspdf";
import IconExport from "assets/icons/IconExport";
import { capitalize } from "_helpers";

const Fullpage = (props) => {
  // Prepare data for the doughnut chart
  const transactionData = {
    labels: [
      "Total Sent",
      "Total Received",
      "Total Topup",
      "Via Card",
      "Via Manual",
    ],
    datasets: [
      {
        label: "Transactions",
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#41B883",
          "#ff33c4",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#41B883",
          "#ff33c4",
        ],
        data: [
          parseFloat(props.customer.total_send).toFixed(2) || 0,
          parseFloat(props.customer.total_receive).toFixed(2) || 0,
          parseFloat(props.customer.total_topup).toFixed(2) || 0,
          parseFloat(props.customer.total_topup_via_card).toFixed(2) || 0,
          parseFloat(props.customer.total_topup_via_manual).toFixed(2) || 0,
        ],
      },
    ],
  };

  const exportToPDF = () => {
    const chartElement = document.getElementById("chart-container");

    if (chartElement) {
      const canvasElement = chartElement.querySelector("canvas");

      // Define the desired smaller width and height for the chart inside the PDF
      const chartWidth = 25; // Smaller width for the chart
      const chartHeight = 25; // Smaller height for the chart

      // Create an off-screen canvas with higher resolution
      const scaleFactor = 150; // Increase scale for higher resolution
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set the high resolution for the off-screen canvas
      canvas.width = chartWidth * scaleFactor;
      canvas.height = chartHeight * scaleFactor;

      // Set the background color to white
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with a white background

      // Scale the context to ensure the chart is drawn at the correct size
      ctx.scale(scaleFactor, scaleFactor);

      // Draw the chart onto the off-screen canvas, scaling it
      ctx.drawImage(
        canvasElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height,
        0,
        0,
        chartWidth,
        chartHeight
      );

      // Create a new jsPDF instance
      const pdf = new jsPDF();

      // Add the "Transaction Overview" header at the top of the page, center-aligned, with a larger font size
      const headerText = "Transaction Overview";
      const headerFontSize = 24; // Larger font size for header
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(headerFontSize);

      // Calculate center alignment for the header
      const headerWidth = pdf.getTextWidth(headerText);
      const headerX = (pdf.internal.pageSize.width - headerWidth) / 2; // Center alignment
      pdf.text(headerText, headerX, 20); // Y position for header at the top of the page

      // Add underline by drawing a line below the header
      const underlineY = 20 + 2; // Slightly below the header text
      pdf.setLineWidth(0.5); // Set line width for underline
      pdf.line(headerX, underlineY, headerX + headerWidth, underlineY); // Draw line from start to end of the header

      // Add chart image to the PDF (below the header)
      const chartX = 50; // X position of chart
      const chartY = 40; // Y position of chart (below header)
      pdf.addImage(canvas, "JPEG", chartX, chartY, 110, 100); // Adjust image dimensions

      // Now calculate the Y-position for the transaction details below the chart
      const transactionDetailsStartY = chartY + 100 + 10; // 100 is the height of the chart, 10 is margin

      // Add transaction details starting from the calculated position
      const details = [
        `Total Sent: ${globalConstants.CURRENCY_SYMBOL} ${parseFloat(
          props.customer.total_send
        ).toFixed(2)}`,
        `Total Received: ${globalConstants.CURRENCY_SYMBOL} ${parseFloat(
          props.customer.total_receive
        ).toFixed(2)}`,
        `Total Topup: ${globalConstants.CURRENCY_SYMBOL} ${parseFloat(
          props.customer.total_topup
        ).toFixed(2)}`,
        `Total Topup via Card: ${globalConstants.CURRENCY_SYMBOL} ${parseFloat(
          props.customer.total_topup_via_card
        ).toFixed(2)}`,
        `Total Topup via Manual: ${
          globalConstants.CURRENCY_SYMBOL
        } ${parseFloat(props.customer.total_topup_via_manual).toFixed(2)}`,
      ];

      // Set smaller font size for the transaction details
      pdf.setFontSize(12);

      // Add each transaction detail to the PDF, starting from below the chart
      details.forEach((line, index) => {
        pdf.text(line, 10, transactionDetailsStartY + (index + 1) * 10); // Adjust Y-position for each line below the chart
      });

      // Save the PDF
      pdf.save("transaction-chart.pdf");
    }
  };

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard className="overflow-auto">
              <CCardHeader>
                <strong>Customer Details</strong>
              </CCardHeader>
              <CCardBody>
                <div className="d-flex">
                  <div>
                    <div className="d-flex">
                      <div style={{ paddingRight: "20px" }}>
                        {props.customer.profile_image !== null &&
                          props.customer.profile_image !== undefined && (
                            <>
                              <img
                                style={{ borderRadius: "50px" }}
                                width={75}
                                height={75}
                                src={
                                  props.customer.profile_image
                                    ? props.customer.profile_image
                                    : props.customer.user_type === "business"
                                    ? "/assets/Business-account.png"
                                    : "/assets/Personal.png"
                                }
                                alt="Profile Image"
                              />
                            </>
                          )}
                      </div>
                      <div>
                        <h4 className="mb-0">
                          {props.customer.user_type === "personal" ||
                          props.customer.user_type === "agent"
                            ? props.customer.first_name +
                              " " +
                              props.customer.last_name
                            : props.customer.company_name}
                        </h4>
                        <a href={`mailto:${props.customer.email}`}>
                          {props.customer.email}
                        </a>
                        <p>{`+${props.customer.mobile_number}`}</p>
                      </div>
                    </div>
                    <table cellPadding={12} cellSpacing={12}>
                      <tr>
                        <th>Customer ID:</th>
                        <td>{props.customer.cust_id}</td>
                      </tr>
                      <tr>
                        <th>Account Number:</th>
                        <td>{props.customer.account_number}</td>
                      </tr>
                      <tr>
                        <th>Address:</th>
                        <td>{props.customer.address}</td>
                      </tr>

                      <tr>
                        <th>User Type:</th>
                        <td>{capitalize(props.customer.user_type)}</td>
                      </tr>
                    </table>
                  </div>
                  {parseFloat(props.customer.total_send) ||
                  parseFloat(props.customer.total_receive) ||
                  parseFloat(props.customer.total_topup) ||
                  parseFloat(props.customer.total_topup_via_card) ||
                  parseFloat(props.customer.total_topup_via_manual) ? (
                    <div className="m-auto d-flex align-items-start">
                      <CChartDoughnut
                        id="chart-container"
                        datasets={transactionData.datasets}
                        labels={transactionData.labels}
                        options={{
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                        }}
                        style={{ height: "300px" }}
                      />{" "}
                      <div
                        className="mt-2 export-graph"
                        onClick={exportToPDF}
                        onMouseEnter={(e) =>
                          e.currentTarget
                            .querySelector("svg")
                            .setAttribute("fill", "#0080c4")
                        }
                        onMouseLeave={(e) =>
                          e.currentTarget
                            .querySelector("svg")
                            .setAttribute("fill", "#8B94A3")
                        }
                      >
                        <CTooltip content={globalConstants.EXPORT}>
                          <IconExport fill="#8B94A3" />
                        </CTooltip>
                      </div>
                    </div>
                  ) : null}
                </div>
              </CCardBody>
              <CCardFooter>
                <CLink
                  className="btn btn-danger btn-sm"
                  aria-current="page"
                  to="/admin/customer_reports"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
                </CLink>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default Fullpage;
