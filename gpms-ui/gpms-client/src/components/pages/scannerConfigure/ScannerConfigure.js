import React, { Component } from 'react'
import Barcode from 'react-barcode';
import { Fragment } from 'react/cjs/react.production.min';
import { VALUE } from 'xlsx-populate/lib/FormulaError';
import withAuth from '../../../shared/hoc/AuthComponent';
import { withRouter } from '../../../shared/hoc/withRouter';
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { LineService } from '../../../shared/services/lines/LineService';
import { ToasterTypeConstants } from '../../../shared/utilities/GlobalConstrants';
import { Toaster } from '../../../shared/utilities/Toaster';
import Breadcrumb from '../../mics/Breadcrumb';

class ScannerConfigure extends Component {
    constructor(props) {
        super(props)
        const stepArr = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7', 'Step 8','Step 9']
        this.state = {
            step: stepArr[0],
            stepArr: stepArr,
            lines: [],
            lineId: 0,
            result: [],
            resultId: 0,
            barcodeVal: '',
            inputQr: '',
            scannerType: '',
            lineNo: ''
        }
    }
    componentDidMount = async () => {

        const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");
        const mainWrapper = document.querySelector(".main-wrapper");
        const overlay = document.querySelector(".overlay");

        sidebarNavWrapper.classList.add("active");
        overlay.classList.add("active");
        mainWrapper.classList.add("active");

        const result = [
            {
                value: 'Y',
                label: 'PASS'
            },
            {
                value: 'N',
                label: 'FAIL'
            }
        ]
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        let line = await this.getLineList(resToken.token);
    
        this.setState({
            lines: line.data,
            result: result
        })
        //  this.barcodeAutoFocus();
    }
    getLineList = async (token) => {

        let filteredList = await LineService.GetDropdownlistWithLineNumber(token);

        return filteredList;
    }

    changeStep = (step) => {
        const stepArr = this.state.stepArr;
        const index = stepArr.findIndex(e => e === step);
        if (step == stepArr[index]) {
            this.setState({
                step: stepArr[index + 1],
                barcodeVal: '',
                lineId: 0,
                resultId: 0
            })
        }

    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;

        // var barcodeVal = value.charCodeAt(0).toString();


        this.setState({
            barcodeVal: value
        });
        const name = target.name;

        this.setState({
            [name]: value,
            lineId: 0

        });

    };
    handleTypeChange = (event) => {
        const target = event.target;
        const value = target.value;

        const lineId = (value).toString();

        // var barcodeVal = lineId.charCodeAt(0).toString();

        this.setState({
            barcodeVal: lineId
        });
        const name = target.name;

        this.setState({
            [name]: value,
            resultId: 0,

        });

    };
    backStep = (step) => {
        const stepArr = this.state.stepArr;
        // let index = stepArr.indexOf(step, 0);
        const index = stepArr.findIndex(e => e === step);

        if (step == stepArr[index]) {
            this.setState({
                step: stepArr[index - 1],
                barcodeVal: '',
                lineId: 0,
                resultId: 0
            })

        }

    }
    newStep = () => {

        this.setState({
            step: "Step 1",
            barcodeVal: '',
            lineId: 0,
            resultId: 0
        })


    }
    checkStep = () => {

        this.setState({
            step: "Step 9",
            barcodeVal: '',
            lineId: 0,
            resultId: 0
        })
     

    }
    barcodeAutoFocus = () => {

        var step = this.state.step;

        if (step = 'Step 8') {
            document.getElementById("SearchbyScanning").focus();
        }

    }

    onChangeBarcode = (event) => {
        // updateBarcodeInputValue(event.target.value)
        this.setState({
            inputQr: event.target.value
        })
    }

    onKeyPressBarcode = (event) => {
        if (event.keyCode === 13) {
            // updateBarcodeInputValue(event.target.value)
            var value = event.target.value;
            var lineNo = value.substr(value.length - 1); // => "last one"

            var inputVal = value.slice(0, value.length - 1);

            var lastTwo = inputVal.substr(inputVal.length - 2); // => "Tabs1"

            if (lastTwo == "-Y") {
                this.setState({
                    inputQr: '',
                    scannerType: 'PASS',
                    lineNo: lineNo
                })
            }
            else if (lastTwo == "-N") {
                this.setState({
                    inputQr: '',
                    scannerType: 'FAIL',
                    lineNo: lineNo
                })

            }
        }
    }

    render() {
        const { step, stepArr, lines, lineId, result, resultId, barcodeVal, inputQr, scannerType,
            lineNo } = this.state;

        return (
            <div className="container-fluid">
                <Breadcrumb
                    BreadcrumbParams={{
                        header: "Scanner Configuration",
                        title: "Scanner Configuration",
                        isDashboardMenu: false,
                        isThreeLayer: false,
                        threeLayerTitle: "",
                        threeLayerLink: "",
                    }}
                />
                <div className="row">
                    <div className="card-style mb-30" >
                        <div className='row'>
                            <div className='col-md-12' style={{ textAlign: 'right' }}>

                                <button className="main-btn info-btn" style={{ marginRight: '5px' }} onClick={() => { this.newStep() }}> New Configure</button>

                                <button className="main-btn primary-btn" onClick={() => { this.checkStep() }}> Check Configure</button>
                            </div>

                        </div>
                        {step == stepArr[0] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card-style mb-30" >
                                            <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>{step}</h3>
                                            <div className="profile-cover">
                                                <img src="assets/images/scannerConfige/Step1.png" alt="cover-image" />
                                            </div>
                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S: First Of all need to erase all rules using this Barcode.</p>

                                            <div className='row'>
                                                <div className='col-md-6' style={{ textAlign: 'left' }}>
                                                    <button className="main-btn warning-btn" onClick={() => { this.backStep(step) }}>back</button>
                                                </div>
                                                <div className='col-md-6' style={{ textAlign: 'right' }}>
                                                    <button className="main-btn primary-btn" onClick={() => { this.changeStep(step) }}>Next</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-md-3'>

                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                        {step == stepArr[1] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card-style mb-30" >
                                            <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>{step}</h3>
                                            <div className="profile-cover">
                                                <img src="assets/images/scannerConfige/Step2.png" alt="cover-image" />
                                            </div>
                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S: Initialize new rule using this Barcode.</p>

                                            <div className='row'>
                                                <div className='col-md-6' style={{ textAlign: 'left' }}>
                                                    <button className="main-btn warning-btn" onClick={() => { this.backStep(step) }}>back</button>
                                                </div>
                                                <div className='col-md-6' style={{ textAlign: 'right' }}>
                                                    <button className="main-btn primary-btn" onClick={() => { this.changeStep(step) }}>Next</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-md-3'>

                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                        {step == stepArr[2] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card-style mb-30" >
                                            <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>{step}</h3>
                                            <div className="profile-cover">
                                                <img src="assets/images/scannerConfige/Step3.png" alt="cover-image" />
                                            </div>
                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S: Send all that remains using this Barcode.</p>

                                            <div className='row'>
                                                <div className='col-md-6' style={{ textAlign: 'left' }}>
                                                    <button className="main-btn warning-btn" onClick={() => { this.backStep(step) }}>back</button>
                                                </div>
                                                <div className='col-md-6' style={{ textAlign: 'right' }}>
                                                    <button className="main-btn primary-btn" onClick={() => { this.changeStep(step) }}>Next</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-md-3'>

                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                        {step == stepArr[3] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card-style mb-30" >
                                            <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>{step}</h3>
                                            <div className="profile-cover">
                                                <img src="assets/images/scannerConfige/Step4.png" alt="cover-image" />
                                            </div>
                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S: P.S: Add value  '-'  in scannerusing this Barcode.</p>

                                            <div className='row'>
                                                <div className='col-md-6' style={{ textAlign: 'left' }}>
                                                    <button className="main-btn warning-btn" onClick={() => { this.backStep(step) }}>back</button>
                                                </div>
                                                <div className='col-md-6' style={{ textAlign: 'right' }}>
                                                    <button className="main-btn primary-btn" onClick={() => { this.changeStep(step) }}>Next</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-md-3'>

                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                        {step == stepArr[4] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card-style mb-30" >
                                            <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>{step}</h3>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="input-style-1">
                                                        <label><b>Scanner Type</b> </label>
                                                        <select className="form-control" name="resultId" id="resultId" onChange={this.handleInputChange} value={resultId}>
                                                            <option value=""> Select One</option>
                                                            {result.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item.value}>{item.label}</option>
                                                                )
                                                            })}
                                                        </select>

                                                    </div>
                                                </div>

                                            </div>
                                            {barcodeVal == 'Y' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Pass.png" alt="cover-image" />
                                                    </div>
                                                    {/* <Barcode key='barcode' value={barcodeVal} /> */}
                                                </div>
                                            }
                                            {barcodeVal == 'N' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Fail.png" alt="cover-image" />
                                                    </div>
                                                    {/* <Barcode key='barcode' value={barcodeVal} /> */}
                                                </div>
                                            }

                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S: First scan type Barcode then scan Line Barcode.</p>

                                            <div className='row'>
                                                <div className='col-md-6' style={{ textAlign: 'left' }}>
                                                    <button className="main-btn warning-btn" onClick={() => { this.backStep(step) }}>back</button>
                                                </div>
                                                <div className='col-md-6' style={{ textAlign: 'right' }}>
                                                    <button className="main-btn primary-btn" onClick={() => { this.changeStep(step) }}>Next</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-md-3'>

                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                        {step == stepArr[5] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-7'>
                                        <div className="card-style mb-30" >
                                            <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>{step}</h3>
                                            <div className="row">

                                                <div className="col-md-6">
                                                    <div className="input-style-1">
                                                        <label><b>Line</b> </label>
                                                        <select className="form-control" name="lineId" id="lineId" onChange={this.handleTypeChange} value={lineId}>
                                                            <option value=""> Select One</option>
                                                            {lines.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item.value}>{item.label}</option>
                                                                )
                                                            })}
                                                        </select>

                                                    </div>
                                                </div>

                                            </div>
                                            {barcodeVal == 'Y' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Pass.png" alt="cover-image" />
                                                    </div>
                                                    {/* <Barcode key='barcode' value={barcodeVal} /> */}
                                                </div>
                                            }
                                            {barcodeVal == 'N' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Fail.png" alt="cover-image" />
                                                    </div>
                                                    {/* <Barcode key='barcode' value={barcodeVal} /> */}
                                                </div>
                                            }
                                            {barcodeVal == '1' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Send1.png" alt="cover-image" />
                                                    </div>
                                                    {/* <Barcode key='barcode' value={barcodeVal} /> */}
                                                </div>
                                            }
                                            {barcodeVal == '2' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Send2.png" alt="cover-image" />
                                                    </div>
                                                    {/* <Barcode key='barcode' value={barcodeVal} /> */}
                                                </div>
                                            }
                                            {barcodeVal == '3' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Send3.png" alt="cover-image" />
                                                    </div>

                                                </div>
                                            }
                                            {barcodeVal == '4' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Send4.png" alt="cover-image" />
                                                    </div>

                                                </div>
                                            }
                                            {barcodeVal == '5' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Send5.png" alt="cover-image" />
                                                    </div>

                                                </div>
                                            }
                                            {barcodeVal == '6' &&
                                                <div className="row">
                                                    <div className="profile-cover">
                                                        <img src="assets/images/scannerConfige/Send6.png" alt="cover-image" />
                                                    </div>

                                                </div>
                                            }
                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S: First scan type Barcode then scan Line Barcode.</p>

                                            <div className='row'>
                                                <div className='col-md-6' style={{ textAlign: 'left' }}>
                                                    <button className="main-btn warning-btn" onClick={() => { this.backStep(step) }}>back</button>
                                                </div>
                                                <div className='col-md-6' style={{ textAlign: 'right' }}>
                                                    <button className="main-btn primary-btn" onClick={() => { this.changeStep(step) }}>Next</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-md-2'>

                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                        {step == stepArr[6] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card-style mb-30" >
                                            <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>{step}</h3>
                                            <div className="profile-cover">
                                                <img src="assets/images/scannerConfige/Step6.png" alt="cover-image" />
                                            </div>
                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S: Add extended key.</p>

                                            <div className='row'>
                                                <div className='col-md-6' style={{ textAlign: 'left' }}>
                                                    <button className="main-btn warning-btn" onClick={() => { this.backStep(step) }}>back</button>
                                                </div>
                                                <div className='col-md-6' style={{ textAlign: 'right' }}>
                                                    <button className="main-btn primary-btn" onClick={() => { this.changeStep(step) }}>Next</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-md-3'>

                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                        {step == stepArr[7] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card-style mb-30" >
                                            <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>{step}</h3>
                                            <div className="profile-cover">
                                                <img src="assets/images/scannerConfige/Step8.png" alt="cover-image" />
                                            </div>
                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S: This is the last step save all scanner configuration.</p>

                                            <div className='row'>
                                                <div className='col-md-6' style={{ textAlign: 'left' }}>
                                                    <button className="main-btn warning-btn" onClick={() => { this.backStep(step) }}>back</button>
                                                </div>
                                                <div className='col-md-6' style={{ textAlign: 'right' }}>
                                                    <button className="main-btn primary-btn" onClick={() => { this.changeStep(step) }}>Finish</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-md-3'>

                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                        {step == stepArr[8] &&

                            <div className="col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className='col-md-3'>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card-style mb-30" >
                                            <div className="input-style-1">
                                                <input
                                                    autoFocus={true}
                                                    placeholder='Start Scanning'
                                                    value={inputQr}
                                                    onChange={this.onChangeBarcode}
                                                    id='SearchbyScanning'
                                                    className='SearchInput'
                                                    onKeyDown={this.onKeyPressBarcode}
                                                    onBlur={this.barcodeAutoFocus}
                                                />
                                            </div>
                                            {scannerType != '' &&
                                                <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'red' }}> This is {scannerType} scanner for Line Number {lineNo}</p>
                                            }
                                            <p style={{ paddingTop: '15px', paddingBottom: '15px', color: 'black' }}>P.S:Check Scanner configuration.</p>
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                    </div>
                                </div>
                                {/* end card */}

                            </div>

                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default withAuth(withRouter(ScannerConfigure));
