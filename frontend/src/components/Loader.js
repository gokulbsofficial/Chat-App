import { Spinner } from "react-bootstrap";
const Loader = ({ size, color }) => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: `${size || 80}px`,
        height: `${size || 80}px`,
        margin: "auto",
        color:`${color || "#ffffff"}`,
        // position: "fixed",
        // top: "0",
        // display: "block",
        // bottom: "0",
        // left: "0",
        // right: "0",
      }}
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};
export default Loader;
