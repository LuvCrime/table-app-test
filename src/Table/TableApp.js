import Table from "react-bootstrap/Table";
import React from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { addData } from "../Redux/Actions";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { FormControl } from "react-bootstrap";
import Loader from "react-loader-spinner";

const ROWS_PER_PAGE = 50;

class TableApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pageNumber: 1,
      loading: true,
      sortedRows: "",
      asc: true,
      searchingVal: "",
      searchMode: false,
      inputVal: "",
      userInfo: "",
    };
    autoBind(this);
  }

  onUserInfoButton(userInfo) {
    this.setState({
      userInfo: userInfo,
    });
  }

  componentDidMount() {
    const dataUrl = `http://www.filltext.com/?rows=${this.props.dataAmount}&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D`;
    fetch(dataUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.forEach((user) => {
          this.props.addData(
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.phone,
            user.address,
            user.description
          );
        });
        this.setState({
          loading: false,
        });
      });
  }

  onSearchButon() {
    if (this.state.searchMode === false) {
      this.setState({
        searchMode: true,
        searchingVal: this.state.inputVal,
        inputVal: "",
      });
    } else {
      this.setState({
        searchMode: false,
        searchingVal: this.state.inputVal,
        inputVal: "",
      });
    }
  }

  onSortButton(fieldName) {
    if (this.state.sortedRows === fieldName) {
      if (this.state.asc === true) {
        this.setState({
          asc: false,
        });
      } else {
        this.setState({
          asc: true,
        });
      }
    } else {
      this.setState({
        sortedRows: fieldName,
        asc: true,
      });
    }
  }

  addForm() {
    if (this.state.isClicked === false) {
      this.setState({
        isClicked: true,
      });
    } else if (
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.email === "" ||
      this.state.phone === ""
    ) {
      alert("All form fields should be filled");
      return;
    } else {
      this.setState({
        isClicked: false,
      });
      this.props.addData(
        null,
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        this.state.phone
      );
    }
    this.setState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  }

  onFormOnChange(e) {
    let name = e.target.name;
    this.setState({
      [name]: e.target.value,
    });
  }

  onActiveButton(number) {
    this.setState({
      pageNumber: number,
    });
  }

  renderUsers() {
    var usersTable = this.props.data
      .sort((a, b) => {
        if (this.state.asc === true) {
          if (typeof a[this.state.sortedRows] === "string") {
            return a[this.state.sortedRows].localeCompare(
              b[this.state.sortedRows]
            );
          } else {
            return a[this.state.sortedRows] - b[this.state.sortedRows];
          }
        } else {
          if (typeof a[this.state.sortedRows] === "string") {
            return b[this.state.sortedRows].localeCompare(
              a[this.state.sortedRows]
            );
          } else {
            return b[this.state.sortedRows] - a[this.state.sortedRows];
          }
        }
      })
      .slice(this.getIndex()[0], this.getIndex()[1])
      .map((data) => {
        return (
          <tr onClick={() => this.onUserInfoButton(data)}>
            <td>{data.id}</td>
            <td>{data.firstName}</td>
            <td>{data.lastName}</td>
            <td>{data.email}</td>
            <td>{data.phone}</td>
          </tr>
        );
      });
    return usersTable;
  }

  getIndex() {
    let currentPage = this.state.pageNumber;
    let firstIndex = ROWS_PER_PAGE * (currentPage - 1);
    let lastIndex = ROWS_PER_PAGE * currentPage;
    return [firstIndex, lastIndex];
  }

  renderFilterUsers() {
    var filter = this.props.data
      .filter((user) => {
        if (this.state.searchingVal === "") {
          return;
        }
        if (this.state.searchMode === true || this.state.searchMode === false) {
          if (
            user.firstName
              .toLowerCase()
              .includes(this.state.searchingVal.toLowerCase())
          ) {
            return true;
          } else if (
            user.lastName
              .toLowerCase()
              .includes(this.state.searchingVal.toLowerCase())
          ) {
            return true;
          } else if (
            user.email
              .toLowerCase()
              .includes(this.state.searchingVal.toLowerCase())
          ) {
            return true;
          } else if (user.phone.includes(this.state.searchingVal)) {
            return true;
          } else if (user.id.toString() === this.state.searchingVal) {
            return true;
          }
        } else {
          return false;
        }
        return false;
      })
      .map((searchedUser) => {
        return (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>id</th>
                <th>firstName</th>
                <th>lastName</th>
                <th>email</th>
                <th>phone</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => this.onUserInfoButton(searchedUser)}>
                <td>{searchedUser.id}</td>
                <td>{searchedUser.firstName}</td>
                <td>{searchedUser.lastName}</td>
                <td>{searchedUser.email}</td>
                <td>{searchedUser.phone}</td>
              </tr>
            </tbody>
          </Table>
        );
      });
    return filter;
  }

  renderTableColumn(nameOfTableColumn) {
    return (
      <th>
        {nameOfTableColumn}
        <span className={styles.sort}>
          <FontAwesomeIcon
            icon={faSortUp}
            onClick={(e) => this.onSortButton(nameOfTableColumn)}
            style={{
              transform: `rotate(${
                this.state.sortedRows === nameOfTableColumn &&
                this.state.asc === true
                  ? 0
                  : 180
              }deg)`,
              color:
                this.state.sortedRows === nameOfTableColumn ? "black" : "grey",
            }}
          />
        </span>
      </th>
    );
  }

  renderAddFormInput(name, type) {
    return (
      <InputGroup size="sm" className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="inputGroup-sizing-sm">{name}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          name={name}
          value={this.state[name]}
          autoComplete="off"
          type={type}
          onChange={this.onFormOnChange}
        />
      </InputGroup>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div className={styles.divLoader}>
          <Loader
            type="Circles"
            color="#007bff"
            height={80}
            width={80}
            timeout={3000}
          />
        </div>
      );
    }
    let usersCount = this.props.data.length;
    let pages = Math.ceil(usersCount / ROWS_PER_PAGE);
    let firstIndex = this.getIndex()[0];
    let lastIndex = this.getIndex()[1];
    let items = [];
    for (let number = 1; number <= pages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === this.state.pageNumber}
          onClick={(e) => this.onActiveButton(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    const filteredUsers = this.renderFilterUsers();

    const dataUsers = this.renderUsers();

    return (
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.search}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                name="inputVal"
                onChange={this.onFormOnChange}
                value={this.state.inputVal}
                autoComplete="off"
              />
              <InputGroup.Append>
                <Button variant="primary" onClick={this.onSearchButon}>
                  Search
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <div className={styles.searchTable}>{filteredUsers}</div>
          </div>
          {this.state.isClicked && (
            <div className={styles.form}>
              {this.renderAddFormInput("firstName", "text")}
              {this.renderAddFormInput("lastName", "text")}
              {this.renderAddFormInput("email", "email")}
              {this.renderAddFormInput("phone", "number")}
            </div>
          )}
          <div className={styles.buttonAdd}>
            <Button variant="primary" onClick={this.addForm}>
              Add User
            </Button>{" "}
          </div>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                {this.renderTableColumn("id")}
                {this.renderTableColumn("firstName")}
                {this.renderTableColumn("lastName")}
                {this.renderTableColumn("email")}
                {this.renderTableColumn("phone")}
              </tr>
            </thead>
            <tbody>{dataUsers}</tbody>
          </Table>
          <div className={styles.pagination}>
            <Pagination size="sm">{items}</Pagination>
          </div>
          {this.state.userInfo && (
            <div className={styles.userDescription}>
              <b>User info</b>
              <div>id: {this.state.userInfo.id}</div>
              <div>firstName: {this.state.userInfo.firstName}</div>
              <div>lastName: {this.state.userInfo.lastName}</div>
              <div>email: {this.state.userInfo.email}</div>
              <div>phone: {this.state.userInfo.phone}</div>
              <div>address: {this.state.userInfo.address.streetAddress}</div>
              <div>streetAddress: {this.state.userInfo.address.city}</div>
              <div>city: {this.state.userInfo.address.state}</div>
              <div>zip: {this.state.userInfo.address.zip}</div>
              <div>description: {this.state.userInfo.description}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = {
  addData: addData,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableApp);
