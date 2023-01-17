import { useEffect } from 'react'
import { connect } from "react-redux";
import { useHistory } from 'react-router-dom';

const Getter = (props) => {
    const history = useHistory();

    

    useEffect(() => {
        // when an error is received
        if (props.error.error && props.error.error!== null) {
            // if user is not found, clear storage and redirect to connect wallet screen
            if (props.error.error.userDisabled) {
                localStorage.clear()
                history.push('/login')
            }
        }
    }, [props.error])

    return (
        <>
        </>
    )
}

const mapStateToProps = (state) => ({
    error: state.error
});

export default connect(mapStateToProps)(Getter);
