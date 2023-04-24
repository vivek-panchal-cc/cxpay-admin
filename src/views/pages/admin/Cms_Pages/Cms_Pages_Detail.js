

import React from 'react'
import { notify } from '../../../../_helpers';
import { pageService } from '../../../../services/admin'
import Fullpage from './Cms_Pages_FullPost';
class Detailview extends React.Component {

    /*********** Define Initial Satte ****************/

    state = {
        pages: [],
        id: this.props.match.params.id  // Getting Id From Url
    };

    /************ Retrieve Api very first time component render to Dom ******************/
    componentDidMount() {

        this.getDetailview();
    }

    /************ Define Function for retrieving Record for display particular post  ******************/
    getDetailview() {
        pageService.detailview(this.state.id).then(res => {

            if (res.status === false) {
                notify.error(res.message);
            } else {
                this.setState({
                    pages: [res.result],
                }
                );
            }
        });
    }
    /****************************** Render Data To Dom ***************************************/

    render() {
        return (
            <div>

                {this.state.pages.map(blog => {
                    return <Fullpage title={blog.title}
                        key={blog._id}
                        date={blog.createdAt}
                        body={blog.content}
                        desc={blog.meta_desc}
                        meta_title={blog.meta_title}

                    />
                })}
            </div>
        )

    }
}
export default Detailview;