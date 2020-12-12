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
    console.log(
      "---",
      userInfo.address.streetAddress,
      "---",
      "----",
      userInfo.address.city,
      "----",
      userInfo.address.state,
      "----",
      userInfo.address.zip
    );
  }

  componentDidMount() {
    const dataUrl =
  `http://www.filltext.com/?rows=${this.props.dataAmount}&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D`;
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

  render() {
    console.log(this.state.userInfo);
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
    let currentPage = this.state.pageNumber;
    let firstIndex = ROWS_PER_PAGE * (currentPage - 1);
    let lastIndex = ROWS_PER_PAGE * currentPage;
    let items = [];
    for (let number = 1; number <= pages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={(e) => this.onActiveButton(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    const filteredUsers = this.props.data
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
              <tr>
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

    const dataUsers = this.props.data
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
      .slice(firstIndex, lastIndex)
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
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    firstName
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  name="firstName"
                  value={this.state.firstName}
                  autoComplete="off"
                  type="text"
                  onChange={this.onFormOnChange}
                />
              </InputGroup>

              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    lastName
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  name="lastName"
                  value={this.state.lastName}
                  autoComplete="off"
                  type="text"
                  onChange={this.onFormOnChange}
                />
              </InputGroup>

              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    email
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  name="email"
                  value={this.state.email}
                  autoComplete="off"
                  type="email"
                  onChange={this.onFormOnChange}
                />
              </InputGroup>

              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    phone
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  name="phone"
                  value={this.state.phone}
                  autoComplete="off"
                  type="number"
                  onChange={this.onFormOnChange}
                />
              </InputGroup>
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
                <th>
                  id
                  <span className={styles.sort}>
                    <FontAwesomeIcon
                      icon={faSortUp}
                      onClick={(e) => this.onSortButton("id")}
                      style={{
                        transform: `rotate(${
                          this.state.sortedRows === "id" &&
                          this.state.asc === true
                            ? 0
                            : 180
                        }deg)`,
                        color:
                          this.state.sortedRows === "id" ? "black" : "grey",
                      }}
                    />
                  </span>
                </th>
                <th>
                  firstName
                  <span className={styles.sort}>
                    <FontAwesomeIcon
                      icon={faSortUp}
                      onClick={(e) => this.onSortButton("firstName")}
                      style={{
                        transform: `rotate(${
                          this.state.sortedRows === "firstName" &&
                          this.state.asc === true
                            ? 0
                            : 180
                        }deg)`,
                        color:
                          this.state.sortedRows === "firstName"
                            ? "black"
                            : "grey",
                      }}
                    />
                  </span>
                </th>
                <th>
                  lastName
                  <span className={styles.sort}>
                    <FontAwesomeIcon
                      icon={faSortUp}
                      onClick={(e) => this.onSortButton("lastName")}
                      style={{
                        transform: `rotate(${
                          this.state.sortedRows === "lastName" &&
                          this.state.asc === true
                            ? 0
                            : 180
                        }deg)`,
                        color:
                          this.state.sortedRows === "lastName"
                            ? "black"
                            : "grey",
                      }}
                    />
                  </span>
                </th>
                <th>
                  email
                  <span className={styles.sort}>
                    <FontAwesomeIcon
                      icon={faSortUp}
                      onClick={(e) => this.onSortButton("email")}
                      style={{
                        transform: `rotate(${
                          this.state.sortedRows === "email" &&
                          this.state.asc === true
                            ? 0
                            : 180
                        }deg)`,
                        color:
                          this.state.sortedRows === "email" ? "black" : "grey",
                      }}
                    />
                  </span>
                </th>
                <th>
                  phone
                  <span className={styles.sort}>
                    <FontAwesomeIcon
                      icon={faSortUp}
                      onClick={(e) => this.onSortButton("phone")}
                      style={{
                        transform: `rotate(${
                          this.state.sortedRows === "phone" &&
                          this.state.asc === true
                            ? 0
                            : 180
                        }deg)`,
                        color:
                          this.state.sortedRows === "phone" ? "black" : "grey",
                      }}
                    />
                  </span>
                </th>
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
