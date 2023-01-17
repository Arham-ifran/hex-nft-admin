import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeAuctions, getAuctions } from './liveAuctions.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, ListGroup, ListGroupItem } from "react-bootstrap";
import placeholderImg from '../../assets/img/placeholder.png'
import Countdown from 'react-countdown';
import { ipfsToUrl } from 'utils/functions';

const LiveAuctions = (props) => {
    const [auctions, setAuctions] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [actionModal, setActionModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [auction, setAuction] = useState(null)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        props.getAuctions()
    }, [])

    useEffect(() => {
        if (props.auctions.getAuctionsAuth) {
            const { auctions, pagination } = props.auctions
            setAuctions(auctions)
            setPagination(pagination)
            props.beforeAuctions()
        }

    }, [props.auctions.getAuctionsAuth])

    useEffect(() => {
        if (auctions) {
            setLoader(false)
        }
    }, [auctions])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // set modal type
    const setModal = (type = 0, auctionId = null) => {
        setActionModal(!actionModal)
        setModalType(type)
        setLoader(false)
        if (type === 3 && auctionId)
            getAuction(auctionId)
    }

    const getAuction = async (auctionId) => {
        setLoader(true)
        const auctionData = await auctions.find((elem) => String(elem._id) === String(auctionId))
        if (auctionData)
            setAuction({ ...auctionData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getAuctions(qs)
    }

    const countDownRenderer = ({ days, hours, minutes, seconds }) => {
        return (
            <div className="countdown-container d-flex justify-content-center">
                <div className="countdown-wrapper m-1 text-center">
                    <strong>Days</strong>
                    <div>{days}</div>
                </div>
                <div className="countdown-wrapper m-1 text-center">
                    <strong>Hours</strong>
                    <div>{hours}</div>
                </div>
                <div className="countdown-wrapper m-1 text-center">
                    <strong>Minutes</strong>
                    <div>{minutes}</div>
                </div>
                <div className="countdown-wrapper m-1 text-center">
                    <strong>Seconds</strong>
                    <div>{seconds}</div>
                </div>
            </div>
        )
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Auctions</Card.Title>
                                            {/* <p className="card-collection">List of Auctions</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="serial-col">#</th>
                                                        <th className='text-center'>Image</th>
                                                        <th>Name</th>
                                                        <th>Owner</th>
                                                        <th>Price</th>
                                                        <th>Type</th>
                                                        <th className="time-col">End Date</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        auctions && auctions.length ?
                                                            auctions.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td>
                                                                            <div className="user-image">
                                                                                <img className="img-fluid" src={item.image ? ipfsToUrl(item.image) : placeholderImg} />
                                                                            </div>
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {item.name}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {item.owner.username}
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {
                                                                                item.currentPrice ?
                                                                                    item.currentPrice + ' ' + item.currency
                                                                                    : 'N/A'
                                                                            }
                                                                        </td>
                                                                        <td className='text-white'>
                                                                            {item.type === 1 ? 'NFT' : (item.type === 2 ? 'NFTC' : '-')}
                                                                        </td>
                                                                        <td className="time-col text-white">
                                                                            {
                                                                                item.auctionEndDate ?
                                                                                    <Countdown
                                                                                        date={new Date(item.auctionEndDate) + 10000}
                                                                                        renderer={countDownRenderer}
                                                                                    />
                                                                                    : 'N/A'
                                                                            }
                                                                        </td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-897993903">View</Tooltip>} placement="left" >
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            variant="info"
                                                                                            onClick={() => setModal(3, item._id)}
                                                                                        >
                                                                                            <i className="fas fa-eye"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="8" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Auction Found</div>
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
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {
                            modalType > 0 && auctions &&
                            <Modal className="modal-primary" onHide={() => setActionModal(!actionModal)} show={actionModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">Live Auctions Details</h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Card className="auction-card">
                                        <Card.Title className="text-center pt-2 auction-card-title">NFT</Card.Title>
                                        <Card.Body className="pb-3">
                                            <Row className="align-items-center">
                                                <Col md={5}>
                                                    <div className="auction-image-holder mb-3 mb-md-0">
                                                        <img className="img-fluid" src={auction.image ? auction.image : placeholderImg} />
                                                    </div>
                                                </Col>
                                                <Col md={7}>
                                                    <ul className="list-unstyled auction-item-details">
                                                        <li className="d-flex">
                                                            <strong className="mr-2 text-white">Name:</strong>
                                                            <span className='text-white'>{auction.name}</span>
                                                        </li>
                                                        <li className="d-flex">
                                                            <strong className="mr-2 text-white">Price:</strong>
                                                            <span className="label-value text-white">{auction.currentPrice ? `${auction.currentPrice} ${auction.currency}` : 'N/A'}</span>
                                                        </li>
                                                        <li className="d-flex">
                                                            <strong className="mr-2 text-white">Status:</strong>
                                                            <span className='text-white'>{auction.status === 2 ? 'On Sale' : 'Idle'}</span>
                                                        </li>
                                                    </ul>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="auction-card">
                                        <Card.Title className="text-center pt-2 auction-card-title">Collection</Card.Title>
                                        <Card.Body className="pb-3">
                                            <Row className="align-items-center">
                                                <Col md={5}>
                                                    <div className="auction-image-holder mb-3 mb-md-0">
                                                        <img className="img-fluid" src={auction.collection.logo ? auction.collection.logo : placeholderImg} />
                                                    </div>
                                                </Col>
                                                <Col md={7}>
                                                    <ul className="list-unstyled auction-item-details">
                                                        <li className="d-flex">
                                                            <strong className="mr-2 text-white">Name:</strong>
                                                            <span className='text-white'>{auction.collection.name}</span>
                                                        </li>
                                                    </ul>
                                                    {/* <div>
                                                        <div>Name: {auction.collection.name}</div>
                                                    </div> */}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="auction-card">
                                        <Card.Title className="text-center pt-2 auction-card-title">Owner</Card.Title>
                                        <Card.Body className="pb-3">
                                            <Row className="align-items-center">
                                                <Col md={5}>
                                                    <div className="auction-image-holder mb-3 mb-md-0">
                                                        <img className="img-fluid" src={auction.owner.profileImage ? auction.owner.profileImage : placeholderImg} />
                                                    </div>
                                                </Col>
                                                <Col md={7}>
                                                    <ul className="list-unstyled auction-item-details">
                                                        <li className="d-flex">
                                                            <strong className="mr-2 text-white">Name:</strong>
                                                            <span className='text-white'>{auction.owner.username}</span>
                                                        </li>
                                                        {/* <li className="d-flex">
                                                            <strong className="mr-2">Email:</strong>
                                                            <span>({auction.owner.email})</span>
                                                        </li> */}
                                                    </ul>
                                                    {/* <div>
                                                        <div>Name: {auction.owner.username}</div>
                                                        <div>email: ({auction.owner.email})</div>
                                                    </div> */}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="auction-card">
                                        <Card.Title className="text-center pt-2 auction-card-title">Creator</Card.Title>
                                        <Card.Body className="pb-3">
                                            <Row className="align-items-center">
                                                <Col md={5}>
                                                    <div className="auction-image-holder mb-3 mb-md-0">
                                                        <img className="img-fluid" src={auction.creator.profileImage ? auction.creator.profileImage : placeholderImg} />
                                                    </div>
                                                </Col>
                                                <Col md={7}>
                                                    <ul className="list-unstyled auction-item-details">
                                                        <li className="d-flex">
                                                            <strong className="mr-2 text-white">Name:</strong>
                                                            <span className='text-white'>{auction.creator.username}</span>
                                                        </li>
                                                        {/* <li className="d-flex">
                                                            <strong className="mr-2">Email:</strong>
                                                            <span>({auction.creator.email})</span>
                                                        </li> */}
                                                    </ul>
                                                    {/* <div>
                                                        <div>Name: {auction.creator.username}</div>
                                                        <div>email: ({auction.creator.email})</div>
                                                    </div> */}
                                                </Col>
                                            </Row>

                                        </Card.Body>
                                    </Card>
                                    {
                                        auction.auctionEndDate ?
                                            <Card className="auction-card">
                                                <Card.Title className="text-center pt-2 auction-card-title">Ending In</Card.Title>
                                                <Card.Body className="pb-3">
                                                    <div className='text-white'>
                                                        {<Countdown
                                                            date={new Date(auction.auctionEndDate) + 10000}
                                                            renderer={countDownRenderer}
                                                        />}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                            : ''
                                    }

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="outline-button" onClick={() => setActionModal(!actionModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    auctions: state.auctions,
    error: state.error
});

export default connect(mapStateToProps, { beforeAuctions, getAuctions })(LiveAuctions);