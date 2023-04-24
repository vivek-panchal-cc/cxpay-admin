import React from 'react';
import { CSelect } from '@coreui/react'
import  {userService}  from "../../services/admin/user.service";
import { notify} from '../../_helpers/index';

class UserGroups extends React.Component {

  constructor(props) {
    super(props);
    this.state = {user_gropus:[]}
  }

  handleChange = (event) => {
    this.props.onChange(this.props.id, event.target.value);
  }

  componentDidMount() {
    userService.getUserGroups().then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({ user_gropus: res.data });
      }
    });
  }

  render() {
    return <>
      <CSelect custom name="select" id="select" onChange={this.handleChange} value={this.props.value}>
          <option key='0' value="">-- User Groups --</option>;
          {this.state.user_gropus.map((e, key) => {
            return <option key={key+1} value={e._id}>{e.user_group_name}</option>;
          })}
      </CSelect>
    </>;

  }
}

export default UserGroups;