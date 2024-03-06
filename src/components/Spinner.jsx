import RingLoader from "react-spinners/RingLoader";



const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    marginTop : "50px"
  };

const Spinner = ({loader}) =>{

    return     <RingLoader
    color="blue"
    loading={loader}
    size={70}
    cssOverride={override}
    aria-label="Loading Spinner"
    data-testid="loader"
/>
}

export default Spinner;