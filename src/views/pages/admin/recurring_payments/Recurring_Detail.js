import React from "react";
import { notify } from "../../../../_helpers";
// import Fullpage from "./Customer_FullPost";
import { paymentsService } from "services/admin/payments.service";
import RecurringFullPost from "./Recurring_Full_Post";

class DetailView extends React.Component {
  /*********** Define Initial Satte ****************/

  state = {
    recurring_details: {},
    recurring_payment_id: this.props.match.params.id, // Getting Id From Url
  };

  /************ Retrieve Api very first time component render to Dom ******************/
  componentDidMount() {
    this.getDetailView();
  }

  /************ Define Function for retrieving Record for display particular post  ******************/
  getDetailView() {
    paymentsService.recurringDetails({ recurring_payment_id: this.state.recurring_payment_id }).then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          recurring_details: res.data,
        });
      }
    });
  }
  /****************************** Render Data To Dom ***************************************/

  render() {
    return <RecurringFullPost recurring_details={this.state.recurring_details} />;    
  }
}
export default DetailView;
