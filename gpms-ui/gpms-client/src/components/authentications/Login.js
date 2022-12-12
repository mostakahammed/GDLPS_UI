import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Fragment } from 'react/cjs/react.production.min';
import withAuth from '../../shared/hoc/AuthComponent';
import { Authenticate } from '../../shared/redux/actions/Authenticate';
import { AuthenticationService } from '../../shared/services/authentications/AuthenticationService';
import { ToasterTypeConstants, UserInfo } from '../../shared/utilities/GlobalConstrants';
import { Toaster } from '../../shared/utilities/Toaster';

class Login extends Component {

  state = {
    username: '',
    password: '',

  }

  constructor(props) {
    super(props)

  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    //this.formValidationObject(name, value);
  }

  handleLogin = (e) => {
    const { username, password } = this.state;
    this.props.Authenticate({ username, password });

  }

  render() {
    //destructuring
    const { username, password } = this.state;
    const resToken = AuthenticationService.GetToken();

    if (this.props.isLoggedIn) {
      if (resToken.roleId == 3) {
        return (
          <Navigate to='/assemblyDashBoard' replace={true} />
        )
      }
      else {
        return (

          <Navigate to='/' replace={true} />
        )
      }
    } else {
      return (
        <Fragment>
           <Helmet>
            <meta charSet="utf-8" />
            <title>Login</title>
          </Helmet>
          <div className="container-fluid">
            <div className="title-wrapper pt-30">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="title mb-30">
                    <h2>Sign in</h2>
                  </div>
                </div>

                {/* <div className="col-md-6">
                <div className="breadcrumb-wrapper mb-30">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#0">Dashboard</a>
                      </li>
                      <li className="breadcrumb-item"><a href="#0">Auth</a></li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Log in
                      </li>
                    </ol>
                  </nav>
                </div>
              </div> */}

              </div>

            </div>

            <div className="row g-0 auth-row">
              <div className="col-lg-6">
                <div className="signin-wrapper">
                  <div className="form-wrapper">
                    {/* <h6 className="mb-15" style={{}}>Sign In</h6> */}
                    <p className="text-sm mb-25">

                    </p>
                    <form action="#">
                      <div className="row">
                        <div className="col-12">
                          <div className="input-style-1">
                            <label>UserName</label>
                            <input type="text" name="username" id="username" defaultValue={username} onChange={this.handleInputChange} />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-style-1">
                            <label>Password</label>
                            <input type="password" name="password" id="password" defaultValue={password} onChange={this.handleInputChange} />
                          </div>
                        </div>
                        {/* <div className="col-xxl-6 col-lg-12 col-md-6">
                        <div className="form-check checkbox-style mb-30">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="checkbox-remember"
                          />
                          <label
                            className="form-check-label"
                            for="checkbox-remember"
                          >
                            Remember me next time</label
                          >
                        </div>
                      </div> */}
                        {/* <div className="col-xxl-6 col-lg-12 col-md-6">
                        <div
                          className="
                            text-start text-md-end text-lg-start text-xxl-end
                            mb-30
                          "
                        >
                          <a href="#0" className="hover-underline"
                            >Forgot Password?</a
                          >
                        </div>
                      </div> */}

                        <div className="col-12">
                          <div
                            className="
                            button-group
                            d-flex
                            justify-content-center
                            flex-wrap
                          "
                          >
                            <button
                              className="
                              main-btn
                              primary-btn
                              btn-hover
                              w-100
                              text-center
                            "
                              type='button' onClick={this.handleLogin}
                            >
                              Sign In
                            </button>
                          </div>
                        </div>
                      </div>

                    </form>
                    <div className="singin-option pt-40">
                      <p className="text-sm text-medium text-center text-gray">

                      </p>
                      <div
                        className="
                        button-group
                        pt-40
                        pb-40
                        d-flex
                        justify-content-center
                        flex-wrap
                      "
                      >
                        {/* <button className="main-btn primary-btn-outline m-2">
                        <i className="lni lni-facebook-filled mr-10"></i>
                        Facebook
                      </button> */}
                        {/* <button className="main-btn danger-btn-outline m-2">
                        <i className="lni lni-google mr-10"></i>
                        Google
                      </button> */}
                      </div>
                      {/* <p className="text-sm text-medium text-dark text-center">
                      Don’t have any account yet?
                      <a href="signup.html">Create an account</a>
                    </p> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="auth-cover-wrapper bg-primary-100">
                  <div className="auth-cover">
                    <div className="title text-center">
                      <h1 className="text-primary mb-10">Welcome Back</h1>
                      <p className="text-medium" style={{ textAlign: "center" }} >
                        Log in
                      </p>
                    </div>
                    <div className="cover-image">
                      <img src="assets/images/auth/signin-image.svg" alt="" />
                    </div>
                    <div className="shape-image">
                      <img src="assets/images/auth/shape.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Fragment>

      );
    }
  }
}

const mapStateToProps = (state) => ({

  isLoggedIn: state.AuthenticationReducer.isSuccess ? true : AuthenticationService.ValidateToken().isSuccess,

})

export default connect(mapStateToProps, { Authenticate: Authenticate })(Login);

