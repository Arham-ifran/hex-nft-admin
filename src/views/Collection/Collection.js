import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeCollection, getCollections, getCollection, updateSettings } from './Collection.action';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import collectionDefaultImg from '../../assets/img/placeholder.jpg'
import userDefaultImg from '../../assets/img/placeholder.jpg'
import { ipfsToUrl } from 'utils/functions';
var CryptoJS = require("crypto-js");

const Collection = (props) => {
    const [collection, setCollection] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [nftModal, setNftModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [nfts, setNfts] = useState(null)
    const [nft, setNft] = useState(null)
    const [loader, setLoader] = useState(true)
    const [notableDrop, setNotableDrop] = useState(false)
    const [permissions, setPermissions] = useState({})
    const [switched, setSwitched] = useState(false)


    useEffect(() => {
        window.scroll(0, 0)
        props.getCollection(window.location.pathname.split('/')[3])
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
            props.getRole(role)
        }
    }, [])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
            props.beforeRole()
        }
    }, [props.getRoleRes])

    useEffect(() => {
        if (props.collection.getAuth) {
            const { collection, nfts, pagination } = props.collection.collection
            setCollection(collection)
            setNotableDrop(collection.isNotableDrop)
            setPagination(pagination)
            setNfts(nfts)
            setLoader(false)
        }
    }, [props.collection.getAuth])

    useEffect(() => {
        if (collection) {
            setLoader(false)
        }
    }, [collection])

    useEffect(() => {
        if (nfts) {
            setLoader(false)
        }
    }, [nfts])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    useEffect(() => {
        if (props.collection.upsertAuth && Object.keys(props.collection.collection)) {
            setLoader(false)
            props.beforeCollection()
        }
    }, [props.collection.upsertAuth])

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getCollection(window.location.pathname.split('/')[3], qs)
    }

    // set modal type
    const setModal = (type = 0, nftId = null) => {
        setNftModal(!nftModal)
        setModalType(type)
        setLoader(false)
        if (type === 3 && nftId)
            getNft(nftId)
    }

    const getNft = async (nftId) => {
        setLoader(true)
        const nftData = await nfts.find((elem) => String(elem._id) === String(nftId))
        if (nftData)
            setNft({ ...nftData })
        setLoader(false)
    }

    useEffect(() => {
        if (notableDrop !== undefined && collection && switched) {
            let payload = {
                _id: collection._id,
                isNotableDrop: notableDrop
            }
            props.updateSettings(payload)
            setSwitched(false)
            setLoader(true)
        }
    }, [notableDrop, switched])

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Row>
                            <Col sm="12">
                                <Card className="pb-5 table-big-boy">
                                    {/* <Card.Header>
                                        <Card.Header className="pl-0">
                                            <Card.Title as="h4">Images</Card.Title>
                                        </Card.Header>
                                    </Card.Header> */}
                                    <Card.Body>
                                        <Row>
                                            <Col sm={12}>
                                                <div className="collection-vew-block mb-5">
                                                    <div className="banner-holder position-relative">
                                                        <img className="img-holder img-fluid" src={collection.banner ? collection.banner : userDefaultImg} />
                                                        <div className="logo-holder">
                                                            <img className="img-fluid" src={collection.logo ? collection.logo : userDefaultImg} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Form.Group className='d-flex justify-content-center align-items-center mb-3'>
                                                    <div className="nft-detail-holder d-flex">
                                                        <strong className="mr-2 text-white">Name:</strong>
                                                        <span className='text-white'>{collection.name}</span>
                                                    </div>
                                                </Form.Group>
                                                <Form.Group className=' d-flex justify-content-center align-items-center mb-3'>
                                                    <div className="contract-border nft-detail-holder d-flex">
                                                        <strong className="mr-2 text-white">Contract Address:</strong>
                                                        <span className='text-white text-colum'>{collection.address ? collection.address : ENV.nftContractAddress}</span>
                                                    </div>
                                                </Form.Group>
                                                <Form.Group>
                                                    <div className="nft-detail-holder d-flex justify-content-center align-items-center">
                                                        <strong className="mr-2 text-white">Username:</strong>
                                                        <span className='text-white'> {collection.user.username ? collection.user.username : 'N/A'}</span>
                                                    </div>
                                                </Form.Group>
                                                <Form.Group className=' url-links d-flex justify-content-between'>
                                                    <div className="nft-detail-holder url">
                                                        <strong className="mr-2 text-white">URL:</strong>
                                                        <span><a href={`${ENV.siteUrl}collection/${collection.url}`} target="_blank">{ENV.siteUrl}collection/{collection.url}</a></span>
                                                    </div>
                                                    <div className="nft-detail-holder url d-flex">
                                                        <strong className="mr-2 text-white">Category:</strong>
                                                        <span className='text-white'>{collection.category ? collection.category.name : 'N/A'}</span>
                                                    </div>
                                                </Form.Group>
                                                <div className="nft-detail-holder url text d-flex">
                                                    <strong className="mr-2 text-white">Description:</strong>
                                                    <span className='collect-text text-white'>{collection.description ? collection.description : 'N/A'}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {
                            permissions && permissions.viewNotableDropsSettings &&
                            <Row>
                                <Col sm="12">
                                    <Card className="pb-5 table-big-boy">

                                        <>
                                            <Card.Header>
                                                <div className="d-block d-md-flex align-items-center justify-content-between">
                                                    <Card.Title as="h4">Settings</Card.Title>
                                                </div>
                                            </Card.Header>

                                            <Card.Body>
                                                <Row>
                                                    <Col sm="12">
                                                        <Form.Group>
                                                            <label>Show In Notable Drops</label>
                                                            <Form.Check
                                                                disabled={!permissions?.editNotableDropsSettings}
                                                                type="switch"
                                                                id="notableDrop"
                                                                className="mb-1"
                                                                onChange={(e) => { setNotableDrop(!notableDrop); setSwitched(true) }}
                                                                name="notableDrop"
                                                                defaultValue={false}
                                                                checked={notableDrop}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </>
                                    </Card>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">NFTs</Card.Title>
                                            {/* <p className="card-collection">List of NFTs</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width table-responsive">
                                        <Table className="table-bigboy">
                                            <thead>
                                                <tr>
                                                    <th className="serial-col">#</th>
                                                    <th className='text-center'>Image</th>
                                                    <th>Name</th>
                                                    <th>Owner</th>
                                                    <th>Creator</th>
                                                    <th>Price</th>
                                                    <th>Type</th>
                                                    <th>Copies</th>
                                                    <th className="td-actions text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    nfts && nfts.length ?
                                                        nfts.map((nft, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                    <td>
                                                                        <div className="user-image">
                                                                            <img className="img-fluid" src={nft.image ? ipfsToUrl(nft.image) : userDefaultImg} />
                                                                        </div>
                                                                    </td>
                                                                    <td className='text-white'>
                                                                        {nft.name}
                                                                    </td>
                                                                    <td className='text-white'>
                                                                        {nft.owner.username}
                                                                    </td>
                                                                    <td className='text-white'>
                                                                        {nft.creator.username}
                                                                    </td>
                                                                    <td className="text-white">
                                                                        {nft.currentPrice ? `${nft.currentPrice} ${nft.currency}` : 'N/A'}
                                                                    </td>
                                                                    <td className="text-white">
                                                                        {
                                                                            nft.type === 2 ?
                                                                                nft.isStaked ?
                                                                                    'NFTCD'
                                                                                    :
                                                                                    'NFTC'
                                                                                :
                                                                                nft.isStaked ?
                                                                                    'NFTD'
                                                                                    :
                                                                                    'NFT'
                                                                        }
                                                                    </td>
                                                                    <td className="text-white">
                                                                        {nft.copies}
                                                                    </td>
                                                                    {
                                                                        permissions && permissions.viewCollection &&
                                                                        <td className="td-actions">
                                                                            <div className="d-flex  justify-content-center">
                                                                                <OverlayTrigger overlay={<Tooltip id="tooltip-897993903"> View </Tooltip>} placement="left">
                                                                                    <Button className="btn-link btn-icon" type="button" variant="info" onClick={() => setModal(3, nft._id)}>
                                                                                        <i className="fas fa-eye"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                            </div>
                                                                        </td>
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                        :
                                                        <tr>
                                                            <td colSpan="9" className="text-center">
                                                                <div className="alert alert-info" role="alert">No NFT Found</div>
                                                            </td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </Table>
                                        {
                                            pagination &&
                                            <Pagination
                                                className="m-3"
                                                defaultCurrent={1}
                                                pageSize // items per page
                                                current={pagination.page} // current active page
                                                total={pagination.pages} // total pages
                                                onChange={onPageChange}
                                                locale={localeInfo}
                                            />
                                        }
                                    </Card.Body>





                                </Card>
                            </Col>
                        </Row>

                        {
                            modalType > 0 && nfts &&
                            <Modal className="modal-primary" onHide={() => setNftModal(!nftModal)} show={nftModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''} NFT
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <label className="label-font">Image: </label>
                                            <div>
                                                <div className="user-view-image">
                                                    <img src={nft.image ? ipfsToUrl(nft.image) : collectionDefaultImg} width="200" height="200" style={{ borderRadius: "8px" }} />
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <div className="d-flex nft-flex">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Name: </label><span className='text-white'>{nft.name}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group className="flex-fill  d-flex align-items-center">
                                                <label className="label-font mr-2">Price: </label><span className='text-white'>{nft.currentPrice ? `${nft.currentPrice} ${nft.currency}` : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group className='flex-fill d-flex align-items-center'>
                                                <label className="label-font mr-2">Copies: </label><span className='text-white'>{nft.copies}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Status: </label><span className='text-white'>{nft.status === 2 ? 'On Sale' : 'Idle'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Collection: </label><span className='text-white'>{collection.name || 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex  d-flex align-items-center">
                                            <Form.Group className="flex-fill  d-flex align-items-center">
                                                <label className="label-font mr-2">Creator: </label><span className='text-white'>{nft.creator.username}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex nft-flex">
                                            <Form.Group className="flex-fill  d-flex align-items-center">
                                                <label className="label-font mr-2">Owner: </label><span className='text-white'>{nft.owner.username}</span>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>

                                {/* <Modal.Footer>
                                    <Button
                                        className="btn btn-close"
                                        onClick={() => setNftModal(!nftModal)}
                                        variant="link"
                                    >
                                        Close
                                    </Button>
                                </Modal.Footer> */}
                                <Modal.Footer>
                                    {/* <Button className="btn btn-danger" onClick={() => setContentModal(!contentModal)}>Close</Button> */}
                                    <Button className="outline-button" onClick={() => setNftModal(!nftModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }


                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    collection: state.collection,
    nfts: state.nfts,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeCollection, getCollections, getCollection, updateSettings, getRole, beforeRole })(Collection);