import React from "react";
import styles from "./styles.module.css";
import Button from "react-bootstrap/Button";
import { setDataAmount } from "../Redux/Actions";
import { connect } from "react-redux";
import autoBind from "react-autobind";

export class OnBoarding extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  chooseAmount(number) {
      this.props.setDataAmount(number)
  }
  
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.format}>Select data amount:</div>
        <div className={styles.buttons}>
          <Button variant="primary"
          onClick={()=>this.chooseAmount(32)}>Small amount</Button>{" "}
          <Button variant="primary"
           onClick={()=>this.chooseAmount(1000)}>Huge amount</Button>{" "}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
    return null;
  };
  
  const mapDispatchToProps = {
    setDataAmount: setDataAmount,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);