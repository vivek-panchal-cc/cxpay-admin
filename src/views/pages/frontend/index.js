import React from 'react'


// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      password: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    document.body.classList.add("landing-page");
    document.body.classList.remove("landing-page");
  }

  handleChange(e) {
    if (this.state.activeTab !== e) {
      this.setState({ activeTab: e });
    }
  }

  render() {
    return (
      <>
        <div className="section text-center">
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="8">
                <h2 className="title">Let's talk product</h2>
                <h5 className="description">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
                </h5>
                <br />
                <Button
                  className="btn-round"
                  color="info"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  See Details
                </Button>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col md="3">
                <div className="info">
                  <div className="icon icon-info">
                    <i className="nc-icon nc-album-2" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Lorem Ipsum</h4>
                    <p className="description">
                      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                    </p>
                    <Button className="btn-link" color="info" href="#pablo">
                      See more
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md="3">
                <div className="info">
                  <div className="icon icon-info">
                    <i className="nc-icon nc-bulb-63" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Lorem Ipsum</h4>
                    <p>
                      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                    </p>
                    <Button className="btn-link" color="info" href="#pablo">
                      See more
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md="3">
                <div className="info">
                  <div className="icon icon-info">
                    <i className="nc-icon nc-chart-bar-32" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Lorem Ipsum</h4>
                    <p>
                      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                    </p>
                    <Button className="btn-link" color="info" href="#pablo">
                      See more
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md="3">
                <div className="info">
                  <div className="icon icon-info">
                    <i className="nc-icon nc-sun-fog-29" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Lorem Ipsum</h4>
                    <p>
                      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for
                      those interested
                    </p>
                    <Button className="btn-link" color="info" href="#pablo">
                      See more
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Index
