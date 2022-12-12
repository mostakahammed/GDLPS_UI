import React, { Component } from "react";
import Breadcrumb from "../mics/Breadcrumb";
import withAuth from "../../shared/hoc/AuthComponent";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faDashboard, faPeopleCarryBox, faPieChart, faRecycle, faStore, faVcard } from "@fortawesome/free-solid-svg-icons";

class Dashboard extends Component {

  render() {

    return (
      <div className="container-fluid">
        <Breadcrumb
          BreadcrumbParams={{
            header: "",
            title: "",
            isDashboardMenu: true,
            isThreeLayer: false,
            threeLayerTitle: "",
            threeLayerLink: "",
          }}
        />

        <div className="row">
        <div className="col-xl-3 col-lg-4 col-sm-6">
            <Link to="/station" target='_blank' className="active">
              <div className="card-style mb-30" >
                <div className="icon primary" 
                style={{
                  height: '46px', borderRadius: '10px', background: 'rgba(74, 108, 247, 0.1)',
                  color: '#4a6cf7',
                  textAlign: 'center',
                  padding: '10px',
                  margin: '10px'
                }} >
                  <FontAwesomeIcon icon={faStore} />
                </div>
                <div className="content" >
                  <h5 className="text-bold mb-10" style={{textAlign:'center'}}>Station List</h5>
                  <p className="text-sm text-danger">
                    <span className="text-gray"></span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-xl-3 col-lg-4 col-sm-6">
            <Link to="/assemblyDashBoard" target='_blank' className="active">
              <div className="card-style mb-30" >
                <div className="icon primary" 
                style={{
                  height: '46px', borderRadius: '10px', background: 'rgba(74, 108, 247, 0.1)',
                  color: '#4a6cf7',
                  textAlign: 'center',
                  padding: '10px',
                  margin: '10px'
                }} >
                 <FontAwesomeIcon icon={faDashboard} />
                </div>
                <div className="content" >
                  <h5 className="text-bold mb-10" >Assemble DashBoard</h5>
                  <p className="text-sm text-danger">
                    <span className="text-gray"></span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
         <div className="col-xl-3 col-lg-4 col-sm-6">
            <Link to="/packagingDashBoard" target='_blank' className="active">
              <div className="card-style mb-30" >
                <div className="icon primary" 
                style={{
                  height: '46px', borderRadius: '10px', background: 'rgba(74, 108, 247, 0.1)',
                  color: '#4a6cf7',
                  textAlign: 'center',
                  padding: '10px',
                  margin: '10px'
                }} >
                  <FontAwesomeIcon icon={faPeopleCarryBox} />
                </div>
                <div className="content" >
                  <h5 className="text-bold mb-10" >Packaging DashBoard</h5>
                  <p className="text-sm text-danger">
                    <span className="text-gray"></span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-xl-3 col-lg-4 col-sm-6">
            <Link to="/repairingDashBoard" target='_blank' className="active">
              <div className="card-style mb-30" >
                <div className="icon primary" 
                style={{
                  height: '46px', borderRadius: '10px', background: 'rgba(74, 108, 247, 0.1)',
                  color: '#4a6cf7',
                  textAlign: 'center',
                  padding: '10px',
                  margin: '10px'
                }} >
                 <FontAwesomeIcon icon={faRecycle} />
                </div>
                <div className="content" >
                  <h5 className="text-bold mb-10" >Repairing DashBoard</h5>
                  <p className="text-sm text-danger">
                    <span className="text-gray"></span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

    );
  }
}

export default withAuth(Dashboard)
