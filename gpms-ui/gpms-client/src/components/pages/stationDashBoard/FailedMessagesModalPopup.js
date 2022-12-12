import React, { Component, Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { withRouter } from '../../../shared/hoc/withRouter';
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { FailedMessageService } from '../../../shared/services/failedMessages/FailedMessageService';
import { ProductionDailyService } from '../../../shared/services/productionDailys/ProductionDailyService';
import { ProductionRepairingService } from '../../../shared/services/productionRepairings/ProductionRepairingService';
import { ToasterTypeConstants } from '../../../shared/utilities/GlobalConstrants';
import { Toaster } from '../../../shared/utilities/Toaster';

class FailedMessagesModalPopup extends Component {
    constructor(props) {

        super(props);
        this.state = {
            showModal: false,
            failedMessages: [],
         //   productionDailyId: 0,
            stationId: 0,
            columns: [

                {
                    name: "Why Product is Falied ? !!",
                    cell: (row) => (
                        <>
                            <p style={{ color: "Red" }}
                                onClick={() => this.addProductionRepairing(row, this.state.productionDailyId)} >{row.label}
                            </p>

                        </>

                    ),
                },
            ],
            data: [],
        };
    }
    componentDidMount = async () => {

        const { productionDailyId } = this.props;
        const { stationId } = this.props;
   
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }


        let failedMessage = await this.getFailedMessageList(resToken.token);

        this.setState({
            data: failedMessage.data,
            productionDailyId: productionDailyId,
            stationId: stationId
        })
    }
    getFailedMessageList = async (token) => {

        let filteredList = await FailedMessageService.GetDropdownList(token);

        return filteredList;
    }


    isShowModal = (status) => {
        this.handleClose();
        this.setState({ showModal: status });
    }

    handleClose = () => {
        this.props.onPopupClose(false);
    }
    handleDelete = async (row) => {
        //added confirmation

        console.log(row);

    };
    addProductionRepairing = async (row, productionDailyId) => {

        var stationId = this.state.stationId;
        var passed = this.state.passed;
        var failed = this.state.failed;
        var faultPercent = this.state.faultPercent;
        var total = this.state.total;
        var viewItems = this.state.viewItems;

        const model = {
            ProductionDailyId: productionDailyId,
            FailedMessageId: row.value,
            IsActive: true,
            Status: "Failed"
        }

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            this.props.onPopupClose(false);
            return;
        }

        var savedRes = await ProductionRepairingService.Add(model, resToken.token);
        if (savedRes.response.isSuccess) {
            this.setState({
                productionDailyId:0
            })
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Successfully added" });
            this.props.onPopupClose(false);

            let filter = { StationId: stationId };

            const res = await ProductionDailyService.GetListByFilter(filter, resToken.token);
            const resPassFailData = await ProductionDailyService.GetPassFailDataByFilter(filter, resToken.token);
            if (resPassFailData.data.length > 0) {
                passed = resPassFailData.data[0].passed;
                failed = resPassFailData.data[0].failed;
                faultPercent = resPassFailData.data[0].faultPercent;
                total = passed + failed;
            }


            viewItems = [];
            _.forEach(res.data, (item) => {

                var viewItem =
                {
                    productRefNum: item.productRefNum,
                    station: item.station.name,
                    date: item.date,
                    stationStatus: item.stationStatus,
                    isFailed: item.isFailed
                }

                viewItems.push(viewItem);
            })
          
            this.setState({
                viewItems: viewItems,
                modelName: "",
                productionDailyId: 0,
                passed: passed,
                failed: failed,
                faultPercent: parseInt(faultPercent.toFixed(2)),
                total: total

            });
            return;
        }

    }


    render() {
        return (
            <Fragment>
                <Modal show={this.props.showModalPopup} onHide={this.handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    {/* <Modal.Header closeButton>
                        <Modal.Title id="sign-in-title">
                            Failed Messages
                        </Modal.Title>
                    </Modal.Header> */}
                    <Modal.Body>
                        <div className="row">

                            <div className="table-wrapper table-responsive" style={{ height: "250px" }}>                   
                                    <DataTable
                                        //title="Your Ttile"
                                        className="table"
                                        columns={this.state.columns}
                                        data={this.state.data}
                                        // progressPending={this.props.loading}
                                        // pagination
                                        // paginationServer
                                        // paginationTotalRows={this.state.totalRows}
                                        // paginationDefaultPage={this.state.currentPage}
                                        // onChangeRowsPerPage={this.handlePerRowsChange}
                                        // onChangePage={this.handlePageChange}
                                        onSort={this.handleOnSort}
                                        //selectableRows
                                        onSelectedRowsChange={({ selectedRows }) =>
                                            console.log(selectedRows)
                                        }
                                    />
                           
                            </div>
                        </div>

                        <div className="signUp" style={{ textAlign: "end" }}>
                            <button type="button" className="main-btn warning-btn btn-hover" onClick={() => this.isShowModal(true)}> Close</button>
                        </div>
                    </Modal.Body>

                </Modal >

            </Fragment >

        );
    }
}

export default (withRouter(FailedMessagesModalPopup));  