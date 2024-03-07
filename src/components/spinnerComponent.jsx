import ClipLoader from "react-spinners/ClipLoader";
// import RingLoader from "react-spinners/RingLoader";

// import RotateLoader from "react-spinners/RotateLoader";
// import SyncLoader from "react-spinners/SyncLoader";
// import ClockLoader from "react-spinners/ClockLoader";
// import CircleLoader from "react-spinners/CircleLoader";


const override = {
    display: "block",
    margin: "0 auto",
    // borderColor: "red",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    backgroundColor: "transparent"
    
};

// spinner component
const SpinnerComponent = (isLoadingState, color="#3c096c") => {
    
    // return rendering of the component
    return (
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-center items-center bg-slate-200 opacity-80 min-h-screen">
            <ClipLoader
                color={color}
                loading={isLoadingState}
                // cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}

export default SpinnerComponent;