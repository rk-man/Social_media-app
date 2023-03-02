import { FaSpinner } from "react-icons/fa";
import "./../styles/spinner.css";

function LoadingSpinner() {
    return (
        <div className="spinner-overlay">
            <FaSpinner className="spinner" />
        </div>
    );
}

export default LoadingSpinner;
