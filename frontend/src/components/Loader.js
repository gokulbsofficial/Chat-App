import { Spinner } from "react-bootstrap";
const Loader = () => {
    return (
        <Spinner animation="border" role="status"
            style={{
                width: '80px',
                height: '80px',
                margin: 'auto',
                position: "fixed",
                top: "0",
                display: 'block',
                bottom: '0',
                left: "0",
                right: '0',
            }}
        >
            <span className="sr-only">Loading...</span>
        </Spinner>
    )
}
export default Loader