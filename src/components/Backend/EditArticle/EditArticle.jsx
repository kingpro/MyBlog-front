import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select, message, DatePicker } from 'antd'
import moment from 'moment';
import style from './EditArticle.less';
import ReactQuill from 'react-quill';
import {modules,formats} from '../../../config/config';
import 'react-quill/dist/quill.snow.css';

const { Option }= Select;
const dateFormat = 'YYYY-MM-DD HH:mm';
class EditArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            tags: [],
            date: new Date(),
            editorHtml: '',
            abstract: ''
        }
    }

    static contextTypes = {
        router: PropTypes.object
    };

    componentDidMount(){
        const { handleGetTags, handleGetArticle } = this.props;
        const id=this.props.location.query.id;
        handleGetTags();
        handleGetArticle(id);
    }

    componentWillReceiveProps(nextProps) {
        const { articleContent } = nextProps;
        if(Object.keys(articleContent).length>0){
            let time = moment(articleContent.date).format('YYYY-MM-DD HH:mm');
            this.setState({
                title: articleContent.title,
                tags: articleContent.tags,
                date: moment(time, 'YYYY-MM-DD HH:mm'),
                editorHtml: articleContent.content
            })
        }

    }


    getTitle = (e) => {
        this.setState({
            title: e.target.value
        })
    };

    handleSelect = (value) => {
        this.setState({
            tags: value
        })
    };

    handleTime = (value, dateString) => {
        this.setState({
            date: dateString
        })
    };

    handleContent = (content, delta, source, editor) => {
        this.setState({
            editorHtml: content,
            abstract: editor.getText()
        });
    };

    saveArticle = () => {
        const { title, tags, date, editorHtml, abstract } = this.state;
        const { handleSubmitArticle } = this.props;
        const auth = JSON.parse(localStorage.getItem('auth'));
        const data={
            title: title,
            tags: tags,
            date: date,
            content: editorHtml,
            abstract:abstract,
            draft: true
        };
        if(auth){
            handleSubmitArticle(data);
            this.clearState();
        } else {
            message.warning('抱歉，您没有权限！');
        }
    };

    submitArticle = () => {
        const { title, tags, date, editorHtml, abstract } = this.state;
        const { handleSubmitArticle } = this.props;
        const auth = JSON.parse(localStorage.getItem('auth'));
        const data={
            title: title,
            tags: tags,
            date: date,
            content: editorHtml,
            abstract:abstract,
            draft: false
        };
        if(auth){
            handleSubmitArticle(data);
            this.clearState();
        } else {
            message.warning('抱歉，您没有权限！');
        }
    };

    clearState = () => {
        return this.context.router.push('/home/newArticle');
    };

    render() {
        const { allTags } = this.props;
        const { title, date, tags } = this.state;
        let children = allTags.map((item)=>{
            return <Option key={item.content}>{item.content}</Option>
        });
        return (
            <div className={style.article}>
                <div className={style.box}>
                    <span>文章标题：</span>
                    <Input
                        placeholder="请输入标题"
                        value={title}
                        style={{ width: '80%' }}
                        onChange={this.getTitle}
                    />
                </div>
                <div className={style.box}>
                    <span>文章标签：</span>
                    <Select
                        mode="multiple"
                        style={{ width: '80%' }}
                        value={tags}
                        placeholder="请选择标签"
                        onChange={this.handleSelect}
                    >
                        {children}
                    </Select>
                </div>
                <div className={style.box}>
                    <span>发布时间：</span>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        defaultValue={moment(new Date(), dateFormat)}
                        value={moment(date, dateFormat)}
                        placeholder="Select Time"
                        onChange={this.handleTime}
                    />
                </div>
                <div className={style.articleBox}>
                    <p>文章详情：</p>
                    <ReactQuill
                        theme='snow'
                        onChange={this.handleContent}
                        value={this.state.editorHtml}
                        modules={modules}
                        formats={formats}
                        style={{ height:300}}
                        placeholder='请输入文章内容'
                    />
                </div>
                <div className={style.btn}>
                    <Button
                        type="primary"
                        style={{ marginRight: 20 }}
                        onClick={this.saveArticle}
                    >
                        保存草稿
                    </Button>
                    <Button
                        type="primary"
                        onClick={this.submitArticle}
                    >
                        提交文章
                    </Button>
                </div>
            </div>

        )
    }
}

export default EditArticle;