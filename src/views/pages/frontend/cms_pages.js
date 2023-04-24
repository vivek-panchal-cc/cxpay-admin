import React from 'react'
import { cmsPagesService } from "../../../services/frontend/cms_pages.service";
import { history } from "../../../_helpers";

// reactstrap components
import {
  Container,
  Row,
  Col,
} from "reactstrap";

class Cms_pages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cms_pages: {}
    }
  }

  componentDidMount() {
    cmsPagesService.getCmsPage(this.props.match.params.cms_slug).then(res => {
      if (res.status === false) {
        history.push('/');
      } else {
        this.setState({ cms_pages: res.data });
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.match.params.cms_slug !== prevProps.match.params.cms_slug) {
      cmsPagesService.getCmsPage(this.props.match.params.cms_slug).then(res => {
        if (res.status === false) {
          history.push('/');
        } else {
          this.setState({ cms_pages: res.data });
        }
      });
    }
  }

  render() {
    return (
      <>
        <div className="section">
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="12">
              <h2 className="title">{this.state.cms_pages.title}</h2>
                {/* {{ this.state.cms_pages.content }} */}
                <div className="post__content" dangerouslySetInnerHTML={{ __html: this.state.cms_pages.content }}></div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Cms_pages
