import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class PageTopNavigator extends Component {
  render() {
    const { TopNavigator } = this.props;

    const {
      link,
      text,
      canShowIcon,
      icon
    } = TopNavigator;

    return (
      <div className="row py-1">
        <div className="col-md-12">
          <div className="card">
            <div className="d-flex flex-row-reverse">
              <div className="p-2">
                {text.length > 0 && <Link to={link} className="btn btn-sm btn-primary">
                  {canShowIcon && <FontAwesomeIcon icon={icon} />} {text}
                </Link>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default React.memo(PageTopNavigator);
