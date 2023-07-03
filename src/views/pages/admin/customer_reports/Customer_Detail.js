

import React from 'react'
import { notify } from '../../../../_helpers';
import { pageService } from '../../../../services/admin'
import Fullpage from './Customer_FullPost';
import { reportsService } from 'services/admin/reports.service';
class Detailview extends React.Component {

    /*********** Define Initial Satte ****************/

    state = {
        customer: {},
        id: this.props.match.params.id  // Getting Id From Url
    };

    /************ Retrieve Api very first time component render to Dom ******************/
    componentDidMount() {

        this.getDetailview();
    }

    /************ Define Function for retrieving Record for display particular post  ******************/
    getDetailview() {
        reportsService.customerDetails({id:this.state.id}).then(res => {
            console.log(res)
            if (res.status === false) {
                notify.error(res.message);
            } else {
                this.setState({
                    customer: res.data,
                }
                );
            }
        });
    }
    /****************************** Render Data To Dom ***************************************/

    render() {
       
                
                    return <Fullpage customer={this.state.customer}

                    />
                
           

    }
}
export default Detailview;