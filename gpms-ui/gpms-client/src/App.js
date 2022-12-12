import React, { Component } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Layout from "./components/layouts/Layout";
import "../src/shared/utilities/FontAwesomeCommonIcon";


class App extends Component {

  // componentDidMount() {
  //   const reloadCount = sessionStorage.getItem('reloadCount');
  //   if (reloadCount < 2) {
  //     sessionStorage.setItem('reloadCount', String(reloadCount + 1));
  //     window.location.reload();
  //   } else {
  //     sessionStorage.removeItem('reloadCount');
  //   }
  // }

  render() {

    return (
      <Fragment>
        <Layout />
        {/* <TestLayout/> */}
      </Fragment>
    );
  }

}

export default (App);
