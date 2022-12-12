import React, { Component, Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "../../shared/hoc/withRouter";
import { AuthConstants, ToasterTypeConstants } from "../../shared/utilities/GlobalConstrants";
import Footer from "../footers/Footer";
import Header from "../headers/Header";
import LeftMenu from "../left-menus/LeftMenu";
import AppRoute from "../routings/AppRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "../../shared/hoc/AuthComponent";
import { AuthenticationService } from "../../shared/services/authentications/AuthenticationService";
import { ListGroup } from "react-bootstrap";
import { Toaster } from "../../shared/utilities/Toaster";
import Login from "../authentications/Login";
import { Navigate } from "react-router-dom";



export const TestLayout = (Component) => {


	 const [views, setViews] = useState(0);
     console.log(this.props.authentication);

	useEffect(() => {

  }, []);
   
  

  return  (
  
    <Fragment>
      {/* Left Menu */}
      { <LeftMenu />}

      <main className="main-wrapper">
        {/* Header */}
        { <Header />}

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
// const mapStateToProps = (state) => ({
//   authentication:
//     state.AuthenticationReducer !== "undefined" &&
//       state.AuthenticationReducer.length > 0
//       ? state.AuthenticationReducer
//       : JSON.parse(localStorage.getItem(AuthConstants.LOGGED_IN_USER_KEY)) ??
//       {},
// });


// export default connect(mapStateToProps, {})(TestLayout);
 export default connect(TestLayout);
