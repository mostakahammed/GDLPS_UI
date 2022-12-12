import React, { Component } from 'react'
import withAuth from '../../../shared/hoc/AuthComponent'
import PackagingData from './PackagingData';

class PackagingDashBoard extends Component {

  componentDidMount = () => {

    const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");
    const mainWrapper = document.querySelector(".main-wrapper");
    const overlay = document.querySelector(".overlay");

    sidebarNavWrapper.classList.add("active");
    overlay.classList.add("active");
    mainWrapper.classList.add("active");
    document.title = "Packaging Dashboard";

  }
  render() {
    return (
      <div>
        {/* {typeof RequisitionId !== "undefined" && RequisitionId > 0 && */}
        <PackagingData />

      </div>
    )
  }
}
export default withAuth(PackagingDashBoard);
