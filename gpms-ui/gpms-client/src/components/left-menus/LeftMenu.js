import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment } from "react/cjs/react.production.min";
import { SearchFilter } from "../../shared/filters/SearchFilter";
import { AuthenticationService } from "../../shared/services/authentications/AuthenticationService";
import { ModuleService } from "../../shared/services/modules/ModuleService";
import _ from "lodash";
import withAuth from "../../shared/hoc/AuthComponent";
import { faFile } from "@fortawesome/free-solid-svg-icons";

class LeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leftParentMenu: [],
      leftChildMenu: [],
    };
  }

  componentDidMount = async () => {
    //load left menus
    await this.getLeftMenus();
    const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");


  };

  getLeftMenus = async () => {
    const filter = {};

    const resToken = AuthenticationService.GetToken();
    if (resToken.token == "undefined" || resToken.token === "") {
      return;
    }

    // await ModuleService.GetListByFilter(filter, resToken.token).then((res) => {
    //   const moduleMenus = res.data;
    const res = await ModuleService.GetListByFilter(filter, resToken.token);
    const moduleMenus = res.data;

    const parentMenus = _.filter(moduleMenus, (item) => {
      return item.parentId === null || item.parentId === 0;
    });

    const childMenus = _.filter(moduleMenus, (item) => {
      return item.parentId > 0;
    });

    this.setState({
      parentMenus: parentMenus,
      childMenus: childMenus,
    });
  };



  handleOverlay = () => {
    /* ========= sidebar toggle ======== */
    const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");
    const mainWrapper = document.querySelector(".main-wrapper");

    const overlay = document.querySelector(".overlay");

    sidebarNavWrapper.classList.remove("active");
    overlay.classList.remove("active");
    mainWrapper.classList.remove("active");
  };

  render() {
    //destructing
    const { parentMenus, childMenus } = this.state;
 
    return (
      <Fragment>
        <aside className="sidebar-nav-wrapper" >
          <div className="navbar-logo">
            <img src="/assets/images/logo/gdlps.png" alt="logo" />
            {/* <p style={{ color: "#1975fd" }}><b>GDLPS</b></p>  */}
          </div>
          <nav className="sidebar-nav">
            <div style={{ paddingLeft: '26px' }}>
              <Link to="/" className="active">
                <span className="icon">
                  <svg width="22" height="22" viewBox="0 0 22 22">
                    <path d="M17.4167 4.58333V6.41667H13.75V4.58333H17.4167ZM8.25 4.58333V10.0833H4.58333V4.58333H8.25ZM17.4167 11.9167V17.4167H13.75V11.9167H17.4167ZM8.25 15.5833V17.4167H4.58333V15.5833H8.25ZM19.25 2.75H11.9167V8.25H19.25V2.75ZM10.0833 2.75H2.75V11.9167H10.0833V2.75ZM19.25 10.0833H11.9167V19.25H19.25V10.0833ZM10.0833 13.75H2.75V19.25H10.0833V13.75Z" />
                  </svg>
                </span> &nbsp;
                <span className="text" style={{ color: '#5d657b' }}> <b>Dashboard</b></span>
              </Link>
            </div>
            <ul>
              <li className="nav-item nav-item-has-children">
                {/* <a
                  href="#0"
                  data-bs-toggle="collapse"
                  data-bs-target="#ddmenu_1"
                  aria-controls="ddmenu_1"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                > */}
                {/* <span className="icon">
                    <svg width="22" height="22" viewBox="0 0 22 22">
                      <path d="M17.4167 4.58333V6.41667H13.75V4.58333H17.4167ZM8.25 4.58333V10.0833H4.58333V4.58333H8.25ZM17.4167 11.9167V17.4167H13.75V11.9167H17.4167ZM8.25 15.5833V17.4167H4.58333V15.5833H8.25ZM19.25 2.75H11.9167V8.25H19.25V2.75ZM10.0833 2.75H2.75V11.9167H10.0833V2.75ZM19.25 10.0833H11.9167V19.25H19.25V10.0833ZM10.0833 13.75H2.75V19.25H10.0833V13.75Z" />
                    </svg>
                  </span>
                  <span className="text">Dashboard</span> */}
                {/* </a> */}
                <ul id="ddmenu_1" className="collapse show_ dropdown-nav">
                  {/* <li>
                    <Link to="/" className="active">
                      {" "}
                      Dashboard{" "}
                    </Link>
                  </li> */}
                </ul>
              </li>

              {parentMenus &&
                parentMenus.length > 0 &&
                parentMenus.map((item, index) => {
                  return (
                    <li key={index} className="nav-item nav-item-has-children">
                      <a
                        href="#0"
                        className="collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target={`#ddmenu_2_${item.id}`}
                        aria-controls={`ddmenu_2_${item.id}`}
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        {item.linkText != "Reports" &&
                          <span className="icon">
                            <FontAwesomeIcon icon={item.menuIcon} />
                          </span>
                        }
                        {item.linkText == "Reports" &&
                          <span className="icon">
                            <FontAwesomeIcon icon={faFile} />
                          </span>
                        }
                        <span className="text"><b>{item.linkText}</b></span>

                      </a>

                      {
                        childMenus.filter(cm => cm.parentId == item.id).length > 0 &&
                        (
                          <ul id={`ddmenu_2_${item.id}`} className="collapse dropdown-nav">
                            {
                              childMenus.filter(cm => cm.parentId == item.id).map((cItem, cIndex) => {
                                return (
                                  <li key={cIndex}>
                                    <Link to={cItem.linkURL}> {cItem.linkText} </Link>
                                  </li>
                                )
                              })
                            }

                          </ul>
                        )
                      }

                    </li>
                  );
                })}

            </ul>
          </nav>
        </aside>
        <div className="overlay" onClick={this.handleOverlay} ></div>
      </Fragment>
    );
  }
}

export default withAuth(LeftMenu);
