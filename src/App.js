import "./App.css";
import OnBoarding  from "./OnBoarding/OnBoarding";
import TableApp from "./Table/TableApp";
import { connect } from "react-redux";


function App(props) {
  if(props.dataAmount) {
  return (
    <div className="App">
      <TableApp />
    </div>
  );
  } else {
    return (
      <div className="App">
        <OnBoarding />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    dataAmount: state.dataAmount
  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(App);

