import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import NewArticle from '../../components/Backend/NewArticle/NewArticle';
import { request_tags,submit_article, get_article } from '../../action'

function mapStateToProps(state) {
    return {
        allTags: state.tags.tags,
        articleContent: state.article.articleContent
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleGetTags: bindActionCreators(request_tags, dispatch),
        handleSubmitArticle: bindActionCreators(submit_article,dispatch),
        handleGetArticle: bindActionCreators(get_article,dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(NewArticle);