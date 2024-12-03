import React from "react";

class MessagePopup extends React.Component {
    state = {
      showPopup: false
    };
  
    togglePopup = () => {
      this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
    };
  
    render() {
      const { message } = this.props;
      const { showPopup } = this.state;
      return (
        <span
          onMouseEnter={this.togglePopup}
          onMouseLeave={this.togglePopup}
          style={{ cursor: "pointer" }}
        >
          {message.slice(0, 25) + (message?.length > 25 ? "..." : "")}
          {showPopup && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "white",
                border: "1px solid black",
                padding: "0.5em",
                zIndex: 9999
              }}
            >
              {message}
            </div>
          )}
        </span>
      );
    }
  }
  
  export default MessagePopup;