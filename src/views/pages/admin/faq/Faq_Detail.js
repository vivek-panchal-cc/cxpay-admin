import React from "react";
import { notify } from "../../../../_helpers";
import FaqFullPost from "./Faq_FullPost";
import { faqService } from "services/admin/faq.service";

class Detailview extends React.Component {
  state = {
    faq: [],
    id: this.props.match.params.id,
  };

  componentDidMount() {
    this.getDetailView();
  }

  getDetailView() {
    faqService.getFaq({ id: +this.state.id }).then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          faq: [res.data],
        });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.faq.map((blog) => {
          return (
            <FaqFullPost
              question={blog.faq_question}
              key={blog.id}
              date={blog.createdAt}
              sequence={blog.sequence}
              answer={blog.faq_answer}
            />
          );
        })}
      </div>
    );
  }
}
export default Detailview;
