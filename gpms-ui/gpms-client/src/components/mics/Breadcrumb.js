import React, { Component } from "react";
import { Link } from "react-router-dom";

class Breadcrumb extends Component {
  render() {
    const { BreadcrumbParams } = this.props;
    
    const {
      header,
      title,
      isDashboardMenu,
      isThreeLayer,
      threeLayerTitle,
      threeLayerLink,
    } = BreadcrumbParams;

    return (
      <div className="title-wrapper pt-15">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="title mb-15">
              <h4>{header}</h4>
            </div>
          </div>
          <div className="col-md-6">
            <div className="breadcrumb-wrapper mt-1">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  {!isDashboardMenu && (
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                  )}

                  {isThreeLayer && (
                    <li className="breadcrumb-item">
                      <Link to={threeLayerLink}>{threeLayerTitle}</Link>
                    </li>
                  )}
                  {!isDashboardMenu && (
                    <li className="breadcrumb-item active" aria-current="page">
                      {title}
                    </li>
                  )}
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default React.memo(Breadcrumb);
