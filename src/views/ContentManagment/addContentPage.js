import React, { useState, useEffect, useRef } from 'react';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { addContent, getContent, updateContent } from './cms.action';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import validator from 'validator';
var slugify = require('slugify')
import { useSelector, useDispatch } from 'react-redux';
import { uploadPlugin } from '../../components/CkEditor/ckEditor'


const AddContentPage = (props) => {

    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState()
    const [status, setStatus] = useState(true)
    const [contentId, setContentId] = useState('')
    let slug = useRef()
    const addContentPageRes = useSelector(state => state.content.addContentRes)
    const getContentRes = useSelector(state => state.content.getContentRes)
    const updateContentRes = useSelector(state => state.content.editContentRes)
    const error = useSelector((state) => state.error)

    const [msg, setMsg] = useState({
        title: '',
        desc: ''
    })
    const [isPathEdit, setIsPathEdit] = useState(false)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
        let path = window.location.pathname.split('/')
        if (path.includes('edit-cms')) {
            setIsPathEdit(true)
            let contentId = props.match.params.contentId
            setContentId(contentId)
            dispatch(getContent(contentId))
        }

    }, [])

    useEffect(() => {
        if (error.error)
            setLoader(false)
    }, [error.error])

    useEffect(() => {
        if (addContentPageRes && Object.keys(addContentPageRes).length > 0) {
            props.history.push('/cms')
        }

    }, [addContentPageRes])

    useEffect(() => {
        if (Object.keys(getContentRes).length > 0) {
            let data = getContentRes.content
            setTitle(data.title)
            setDescription(data.description)
            setStatus(data.status)
            slug.current.value = data.slug
        }
    }, [getContentRes])

    useEffect(() => {
        if (updateContentRes.success && Object.keys(updateContentRes.length > 0)) {
            props.history.push('/cms')
            // setLoader(false)
        }
    }, [updateContentRes])

    const addContentPageHandler = (type) => {
        if (!validator.isEmpty(title) && !validator.isEmpty(description)) {
            setMsg({
                title: '',
                desc: ''
            })

            let payload = {
                title,
                slug: slug.current.value,
                description,
                status
            }
            if (type === 1)
                dispatch(addContent(payload))
            if (type === 2) {
                payload._id = contentId
                dispatch(updateContent(payload))
            }
            setLoader(true)
        }
        else {
            let title = ''
            let desc = ''
            if (validator.isEmpty(title)) {
                title = 'Title Required.'
            }
            if (validator.isEmpty(desc)) {
                desc = 'Description Required.'
            }
            setMsg({ title, desc })
        }

    }

    const onEditorChange = (event, editor) => {
        let editorData = editor.getData();
        setDescription(editorData)
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Row>
                            <Col md="12">
                                <Card className="pb-3 table-big-boy">
                                    <Card.Header>
                                        <Card.Title as="h4">{isPathEdit ? 'Edit Content Page' : 'Add Content Page'}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Title<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={title ? title : ''}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        placeholder="Title"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.title ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.title}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Slug<span className="text-danger"> </span></label>
                                                    <Form.Control
                                                        readOnly
                                                        value={slugify(title,{
                                                            lower: true,
                                                        })}
                                                        placeholder="Slug"
                                                        type="text"
                                                        ref={slug}
                                                    ></Form.Control>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        {/* <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Slug<span className="text-danger"> </span></label>
                                                    <Form.Control
                                                        readOnly
                                                        value={slugify(title)}
                                                        placeholder="Slug"
                                                        type="text"
                                                        ref={slug}
                                                    ></Form.Control>

                                                </Form.Group>
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <CKEditor
                                                    config={{
                                                        extraPlugins: [uploadPlugin]
                                                    }}
                                                    editor={ClassicEditor}
                                                    data={description ? description : ''}
                                                    content={description ? description : ''}
                                                    onChange={(event, editor) => onEditorChange(event, editor)}
                                                />
                                                <span className={msg.desc ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.desc}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <div className='d-flex pt-3'>
                                                        <label className='mr-3'>Status<span className="text-danger"> *</span></label>
                                                        <label className="right-label-radio mr-3 mb-2">Active
                                                            <input name="status" type="radio" checked={status} value={status} onChange={() => setStatus(true)} />
                                                            <span className="checkmark" onChange={() => setStatus(true)}></span>
                                                        </label>
                                                        <label className="right-label-radio mr-3 mb-2">Inactive
                                                            <input name="status" type="radio" checked={!status} value={!status} onChange={() => setStatus(false)} />
                                                            <span className="checkmark" onChange={() => setStatus(false)}></span>
                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                <div className='d-flex justify-content-end align-items-center'>
                                                    <Button
                                                        className="btn-fill pull-right btn-filled mt-3"
                                                        type="submit"
                                                        variant="info"
                                                        onClick={() => addContentPageHandler(isPathEdit ? 2 : 1)}
                                                    >
                                                        {isPathEdit ? 'Update' : 'Add'}
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    )
}



export default AddContentPage;