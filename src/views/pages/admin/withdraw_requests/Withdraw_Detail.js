import React from "react";
import { notify } from "../../../../_helpers";
import { pageService } from "../../../../services/admin";
import Fullpage from "./Withdraw_FullPost";
import { withdrawRequestService } from "services/admin/withdraw_request.service";

class Detailview extends React.Component {
  /*********** Define Initial State ****************/

  state = {
    withdraw: {},
    id: this.props.match.params.id, // Getting Id From Url
  };

  /************ Retrieve Api very first time component render to Dom ******************/
  componentDidMount() {
    this.getDetailview();
  }

  /************ Define Function for retrieving Record for display particular post  ******************/
  getDetailview() {
    withdrawRequestService
      .withdrawDetails({ transaction_id: this.state.id })
      .then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          let total_amount = res.data.total_amount;
          res.data.total_amount = total_amount.toFixed(2);
          let amount = res.data.amount;
          res.data.amount = amount.toFixed(2);
          let fees = res.data.fees;
          res.data.fees = fees.toFixed(2);
          this.setState({
            withdraw: res.data,
          });
        }
      });
  }
  /****************************** Render Data To Dom ***************************************/

  render() {
    return <Fullpage withdraw={this.state.withdraw} />;
  }
}
export default Detailview;
