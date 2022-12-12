import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "../../shared/hoc/withRouter";
import { AuthConstants, ToasterTypeConstants } from "../../shared/utilities/GlobalConstrants";
import Footer from "../footers/Footer";
import Header from "../headers/Header";
import LeftMenu from "../left-menus/LeftMenu";
import AppRoute from "../routings/AppRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Logout } from "../../shared/redux/actions/Authenticate";
import { AuthenticationService } from "../../shared/services/authentications/AuthenticationService";


class Layout extends Component {

  render() {

    const { isSuccess } = this.props.authentication;  

    return (
      <Fragment>
        {/* Left Menu */}
        {isSuccess && <LeftMenu />}

        <main className="main-wrapper">
          {/* Header */}
          {isSuccess && <Header />}

          <section className="section">
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            <AppRoute />


          </section>

          {/* footer */}
          <Footer />
        </main>

      </Fragment>
    );
  }
  
}

const mapStateToProps = (state) => ({
  authentication:
    state.AuthenticationReducer !== "undefined" &&
      state.AuthenticationReducer.length > 0
      ? state.AuthenticationReducer
      : JSON.parse(localStorage.getItem(AuthConstants.LOGGED_IN_USER_KEY)) ??
      {},
});

export default connect(mapStateToProps)(Layout);

