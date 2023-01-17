import { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { beforeActivity, getActivities } from './Activity.action';
import { Card, Table, Container, Row, Col } from "react-bootstrap";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import userDefaultImg from '../../assets/img/placeholder.jpg'
import { Link } from "react-router-dom";
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { ENV } from '../../config/config';
import moment from 'moment';
import { ipfsToUrl } from 'utils/functions';

const Activity = (props) => {

    const [activities, setActivities] = useState([])
    const [loader, setLoader] = useState(true)
    const [pagination, setPagination] = useState(null)

    useEffect(() => {
        window.scroll(0, 0)
        props.getActivities()
    }, [])

    useEffect(() => {
        if (props.activity.activityAuth) {
            const { activity, pagination } = props.activity.activity
            setActivities([...activity])
            setPagination(pagination)
            props.beforeActivity()
        }
    }, [props.activity.activityAuth])

    useEffect(() => {
        if (activities) {
            setLoader(false)
        }
    }, [activities])

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getActivities(qs)
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
                                            <Card.Title as="h4">Activities</Card.Title>
                                            {/* <p className="card-user">List Of Activities</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Type</th>
                                                        <th>Item</th>
                                                        <th>Price</th>
                                                        <th>From</th>
                                                        <th>To</th>
                                                        <th>Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        activities && activities.length ? activities.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className='text-white'>{((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>

                                                                    <td className='text-white'>
                                                                        {
                                                                            item.type === 1 ? 'Creation' :
                                                                                item.type === 2 ? 'Offer' :
                                                                                    item.type === 3 ? 'Bid' :
                                                                                        item.type === 4 ? 'Transfer Offer' :
                                                                                            item.type === 5 ? 'Tranfer Bid' :
                                                                                                item.type === 6 ? 'Listing' :
                                                                                                    item.type === 7 ? 'Sales' : ''
                                                                        }
                                                                    </td>
                                                                    <td className='float-start'>
                                                                        {
                                                                            item.nft ?
                                                                                <Link to={`/nft/${item.nft._id}`}>
                                                                                    <div className='d-flex justify-content-start align-items-center'>
                                                                                        <div className="user-image m-0 mr-3">
                                                                                            <img className="img-fluid" alt={`${index}-image`} src={(item.nft.image) || userDefaultImg} />
                                                                                        </div>
                                                                                        <span>{item.nft.name}</span>
                                                                                    </div>
                                                                                </Link>
                                                                                : '-'
                                                                        }

                                                                    </td>
                                                                    <td className='text-white'>
                                                                        {item.price ? `${item.price} ${item.currency}` : '-'}
                                                                    </td>
                                                                    <td className='text-white'>
                                                                        {
                                                                            item.user && Object.keys(item.user).length > 0 ?
                                                                                <Link to={`/users?userId=${item.user._id}`}>
                                                                                    {item.user.username ? item.user.username : item.user.address.slice(0, 8)}
                                                                                </Link> : '-'
                                                                        }
                                                                    </td>
                                                                    <td className='text-white'>
                                                                        {item.toUserName ? item.toUserName : '-'}
                                                                    </td>
                                                                    <td className='text-white'>
                                                                        {moment(item.createdAt).fromNow()}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                            :
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Activity Found</div>
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
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    activity: state.activity,
    error: state.error
});

export default connect(mapStateToProps, { beforeActivity, getActivities })(Activity)
