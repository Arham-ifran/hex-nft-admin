import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeNfts, getNft, updateSettings } from './nfts.action';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Card, Table, Container, Row, Col, Form } from "react-bootstrap";
import Countdown from 'react-countdown';
import userDefaultImg from '../../assets/img/placeholder.jpg'
import { ipfsToUrl } from 'utils/functions';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';

const { nftFileTypes } = ENV
const CryptoJS = require("crypto-js")

const Nft = (props) => {
    const [nft, setNft] = useState(null)
    const [bidsOffers, setBidsOffers] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [show, setShow] = useState(false)
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [switched, setSwitched] = useState(false)


    useEffect(() => {
        window.scroll(0, 0)
        props.getNft(window.location.pathname.split('/')[3])
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
        if (props.nfts.getNftAuth) {
            const { nft, pagination, bidsOffers } = props.nfts.nft
            setNft(nft[0])
            setShow(nft[0].showInHomePage)
            setBidsOffers(bidsOffers)
            setPagination(pagination)
            setLoader(false)
            props.beforeNfts()
        }
    }, [props.nfts.getNftAuth])

    const countDownRenderer = ({ days, hours, minutes, seconds }) => {
        return (
            <div className="countdown-container d-flex" style={{ justifyContent: "space-between", width: "85%" }}>
                <div className="countdown-wrapper m-1">
                    <div>Days</div>
                    <div>{days}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Hours</div>
                    <div>{hours}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Minutes</div>
                    <div>{minutes}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Seconds</div>
                    <div>{seconds}</div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (nft) {
            setLoader(false)
        }
    }, [nft])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    useEffect(() => {
        if (props.nfts.updateAuth && Object.keys(props.nfts.updateSettingsRes).length) {
            setLoader(false)
            props.beforeNfts()
        }
    }, [props.nfts.updateAuth])

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getCollection(window.location.pathname.split('/')[3], qs)
    }

    useEffect(() => {
        if (show !== undefined && nft && switched) {
            let payload = {
                _id: nft._id,
                showInHomePage: show
            }
            props.updateSettings(payload)
            setLoader(true)
            setSwitched(false)
        }
    }, [show], switched)

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
                                            <Card.Title as="h4">Information</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="pb-3 align-items-center">
                                            <Col md={3} className="mb-4">
                                                <div className="nft-image-holder mb-3 mb-md-0">
                                                    <img className="img-fluid" src={ipfsToUrl(nft.image)} alt="NFT Image" />
                                                </div>
                                            </Col>
                                            <Col md={9} className="mb-4">
                                                <ul className="nft-detail-holder list-unstyled">
                                                    <li>
                                                        <strong className="label-text text-white">Name: </strong>
                                                        <span className="label-value text-white">{nft.name}</span>
                                                    </li>
                                                    <li>
                                                        <strong className="label-text text-white">Price: </strong>
                                                        <span className="label-value text-white">{nft.currentPrice ? `${nft.currentPrice} ${nft.currency}` : 'N/A'}</span>
                                                    </li>
                                                    <li>
                                                        <strong className="label-text text-white">Type: </strong>
                                                        <span className="label-value text-white">
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
                                                        </span>
                                                    </li>
                                                    {
                                                        nft.type === 1 ?
                                                            <li>
                                                                <strong className="label-text text-white">Platform Share: </strong>
                                                                <span className="label-value text-white">{nft.platformShare ? nft.platformShare : '0'}%</span>
                                                            </li>
                                                            :
                                                            (
                                                                nft.type === 2 ?
                                                                    <li>
                                                                        <strong className="label-text text-white">Commission: </strong>
                                                                        <span className="label-value text-white">{nft.commission ? nft.commission : '0'}%</span>
                                                                    </li>
                                                                    :
                                                                    ''
                                                            )
                                                    }
                                                    <li>
                                                        <strong className="label-text text-white">Creator: </strong>
                                                        <span className="label-value text-white">{nft.creator.username}</span>
                                                    </li>
                                                    <li>
                                                        <strong className="label-text text-white">Owner: </strong>
                                                        <span className="label-value text-white">{nft.owner.username}</span>
                                                    </li>
                                                </ul>
                                                <div className="collection-detail d-flex align-items-center ">
                                                    <div className="collection-detail-holder d-flex align-items-center">
                                                        <strong className="label-text text-white  mr-1">Collection: </strong>
                                                        <span className='text-white'>{nft.collection ? nft.collection.name : 'N/A'}</span>
                                                    </div>
                                                    <div className="collection-image-holder ml-2">
                                                        <img className="img-fluid" src={nft.collection?.logo ? nft.collection.logo : userDefaultImg} />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={12}>
                                                {
                                                    nft.mediaType && nft.mediaType === 2 ?
                                                        <div>
                                                            <audio src={nft.fileLocal} controls></audio>
                                                        </div> :
                                                        nft.mediaType && nft.mediaType === 14 ?
                                                            <div >
                                                                <Video muted
                                                                    controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}>
                                                                    <source src={nft.fileLocal} />
                                                                </Video>
                                                            </div>
                                                            :
                                                            <div>
                                                                {
                                                                    nftFileTypes && nftFileTypes.length &&
                                                                    nftFileTypes.map((type, typeIndex) => {
                                                                        if (type.mediaType === nft.mediaType && type.btnText !== '')
                                                                            return (
                                                                                <a key={typeIndex} href={nft.fileLocal} target="_blank" className='btn btn-filled mt-4 w-100 text-white alert alert-info'>
                                                                                    <span className="d-block transition">{type.btnText}</span>
                                                                                </a>
                                                                            )
                                                                    })}
                                                            </div>
                                                }
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {
                            permissions && permissions.viewHomepageNftSettings &&
                            <Row>
                                <Col sm="12">
                                    <Card className="pb-5 table-big-boy">
                                        <Card.Header>
                                            <div className="d-block d-md-flex align-items-center justify-content-between">
                                                <Card.Title as="h4">Settings</Card.Title>
                                            </div>
                                        </Card.Header>

                                        <Card.Body>
                                            <Row>
                                                <Col sm="12">
                                                    <Form.Group>
                                                        <label>Show In Homepage</label>
                                                        <Form.Check
                                                            type="switch"
                                                            disabled={!permissions?.editHomepageNftSettings}
                                                            id="show"
                                                            className="mb-1"
                                                            onChange={(e) => { setShow(!show); setSwitched(true) }}
                                                            name="show"
                                                            defaultValue={false}
                                                            checked={show}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">{nft.sellingMethod === 2 ? 'Bids' : 'Offers'}</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <Table className="table-bigboy">
                                            <thead>
                                                <tr>
                                                    <th className="text-center serial-col">#</th>
                                                    <th>{nft.sellingMethod === 2 ? 'Bid By' : 'Offer By'}</th>
                                                    <th>Currency</th>
                                                    <th>Amount</th>
                                                    <th>Expiry Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    bidsOffers && bidsOffers.length ?
                                                        bidsOffers.map((item, index) => {

                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-white text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                    <td className="text-white">
                                                                        {nft.sellingMethod === 2 ? item.bidBy : item.offerBy}
                                                                    </td>
                                                                    <td className="text-white">
                                                                        {item.price.currency}
                                                                    </td>
                                                                    <td className="text-white">
                                                                        {item.price.amount}
                                                                    </td>
                                                                    <td className="text-white">
                                                                        <Countdown
                                                                            date={new Date(item.expiryDate) + 10000}
                                                                            renderer={countDownRenderer}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        :
                                                        <tr>
                                                            <td colSpan="5" className="text-white text-center">
                                                                <div className="alert alert-info" role="alert">No {nft.sellingMethod === 2 ? 'Bid' : 'Offer'} Found</div>
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
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    nfts: state.nfts,
    error: state.error,
    getRoleRes: state.role.getRoleRes,
});

export default connect(mapStateToProps, { beforeNfts, getNft, updateSettings, getRole, beforeRole })(Nft);