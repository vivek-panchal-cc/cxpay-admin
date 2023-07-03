

import React from 'react'
import { notify } from '../../../../_helpers';
import { pageService } from '../../../../services/admin'
import Fullpage from './Withdraw_FullPost';
import { withdrawRequestService } from 'services/admin/withdraw_request.service';
class Detailview extends React.Component {

    /*********** Define Initial Satte ****************/

    state = {
        withdraw: {},
        id: this.props.match.params.id  // Getting Id From Url
    };

    /************ Retrieve Api very first time component render to Dom ******************/
    componentDidMount() {

        this.getDetailview();
    }

    /************ Define Function for retrieving Record for display particular post  ******************/
    getDetailview() {
      withdrawRequestService.withdrawDetails({transaction_id:this.state.id}).then(res => {
            console.log(res)
            if (res.status === false) {
                notify.error(res.message);
            } else {
                this.setState({
                    withdraw: res.data,
                }
                );
            }
        });
    }
    /****************************** Render Data To Dom ***************************************/

    render() {
       
                
                    return <Fullpage withdraw={this.state.withdraw}

                    />
                
           

    }
}
export default Detailview;