import React from 'react'




class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      submitted: false
    };
  }

  componentDidMount() {
    if (this.props.location.state !== undefined && this.props.location.state !== null) {
      window.history.replaceState('page', '');
      setTimeout(() => {
        window.location.reload();
      }, 700);

    }
  }
  render() {
    return (
      <>
        Welcome to Dashboard
      </>
    );
  }
}

export default Dashboard
