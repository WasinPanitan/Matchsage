import React from 'react';
import { message,Radio,Modal,Icon,Table,Calendar,LocaleProvider,Row,Col,Button } from 'antd';
import thTH from 'antd/lib/locale-provider/th_TH';
import './ReservedServices.css';
import {CustomerActions} from 'actions/CustomerActions';
import * as JWT from 'jwt-decode';
import {connect} from 'react-redux';
import { history } from 'helpers';
import { setInterval } from 'timers';

const RadioGroup = Radio.Group;

class ReservedServices extends React.Component{
  state = {
    loading: false,
    visible: false,
    selectedPayment: -1,
    clickedReserved:'',
    selectedPaymentNumber: '',
    disableConfirmButton:true
  }
  componentDidMount(){
    this.props.fetchReserved(JWT(localStorage.getItem('user')).user_id);
  }
  
  dateCellRender = (value)=>{
    let listData = [];
    if(this.props.customerReservations){
      let hasValue = false;
      this.props.customerReservations.map((reservation)=>{
      const reservationDate = new Date(reservation.date);
      if(!hasValue && reservationDate.getDate() === value.date() && reservationDate.getMonth()===value.month() && reservationDate.getFullYear()===value.year()) 
      {listData = [...listData,{
        type:'normal',
        content:'มีนัดนวด'
      }]
      hasValue = true;}
    })}
    
    return (
      <ul className="events">
        {
          listData.map((item,index) => (
            <li key={item.content+index}>
              <span className={`event-${item.type}`}>●</span>
              {item.content}
            </li>
          ))
        }
      </ul>
    );
  }
  
  monthCellRender = (value)=> {
    let num = 0;
    if(this.props.customerReservations){this.props.customerReservations.map((reservation)=>{
      const reservationDate = new Date(reservation.date);
      if(reservationDate.getMonth()===value.month() && reservationDate.getFullYear()===value.year()) num++;
    })}
    return num ? (
      <div className="notes-month">
        <span>มีนัดนวด</span>
        <section>{num}</section>
      </div>
    ) : null;
  }
  
  columns = [{
    title: 'หมายเลขการจอง',
    dataIndex: 'reserve_id'
  },{
    title: 'ชื่อร้าน',
    dataIndex: 'name',
    render: (text,record) => (
      <a onClick={()=>history.push(`/service/${record.service_id}`)}>{text}</a>
    ),
  }, {
    title: 'วันที่จอง',
    dataIndex: 'date',
  },{
    title: 'เวลาที่จอง',
    dataIndex: 'time',
  }, {
    title: 'ชำระค่าบริการ',
    render: (text, record) => (
      <Button type="primary" onClick={()=>this.setState({visible:true,clickedReserved:record.reserve_id})}>ชำระค่าบริการที่เหลือ</Button>
    )
  },{
    title: 'ยกเลิกการจอง',
    render: (text, record) => (
      <Button type="danger" onClick={async()=>{
        const respond = await CustomerActions.cancelReserveService(record.reserve_id);
        if(respond===true){
          this.props.fetchReserved(JWT(localStorage.getItem('user')).user_id);
          message.success('Cancel Successful.');
        }else{
          message.error(respond);
        }
      }}>ยกเลิกการจอง</Button>
    )
  } ];

  handleOk = async () => {
    this.setState({ loading: true });
    const isPaymentSuccess = await CustomerActions.payService(this.state.selectedPaymentNumber,this.state.clickedReserved);
    if(isPaymentSuccess===true) {
      this.setState({ loading: false, visible: false });
      this.props.fetchReserved(JWT(localStorage.getItem('user')).user_id);
      message.success('Payment Successful.');
    }
    else {
      this.setState({ loading: false, visible: false });
      message.error(isPaymentSuccess);
    }
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  onChange = (e) => {
    const selectedPaymentNumber = this.props.paymentAccounts[e.target.value].payment_number
    this.setState({
      selectedPayment: e.target.value,
      selectedPaymentNumber,
      disableConfirmButton:false
    });
  }

  modalColumns = [{
    title: '',
    dataIndex: 'choice',
    render: (text,record) => (
      <Radio value={text}/>
    )
  }, {
    title: 'วิธีการชำระ',
    dataIndex: 'payment_method',
    render: (text,record)=>(<img src={(()=>{switch(text){
        case('credit-card'):
          switch(record.company){
            case('visa'):
              return '/images/visa.png';
            default:
              return null;
          }
        case('bank-account'):
          switch(record.company){
            case('Krungsri'):
              return '/images/KRUNGSRI.png';
            case('Krungthai'):
              return '/images/KTB.png';
            case('Kbank'):
              return '/images/KBANK.png';
            case('SCB'):
              return '/images/SCB.png';
            case('Bangkok'):
              return '/images/BKK.png'
            default:
              return null;
          }
        default:
          return null;
      }})()} style={{maxHeight:'20px'}}/>)
  }, {
    title: 'เลขบัญชี',
    dataIndex: 'payment_number',
    key: 'payment_number',
    render: (text)=>(`XXXX-XXXX-XXXX-${text.substr(12,4)}`)
  }, {
    title: 'วันหมดอายุ',
    dataIndex: 'expire_date',
  }];

  renderChoosePaymentAccountModal = ()=>{
    const { visible, loading } = this.state;
    return <Modal
      visible={visible}
      title={"เลือกวิธีการชำระค่าบริการ "+this.state.clickedReserved}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      footer={[
        <Button key="back" size="large" onClick={this.handleCancel}>ยกเลิก</Button>,
        <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk} disabled={this.state.disableConfirmButton}>
          ชำระค่าบริการ
        </Button>,
      ]}
    >
      <RadioGroup onChange={this.onChange} value={this.state.selectedPayment} style={{width:'100%'}}>
        <Table dataSource={this.props.paymentAccounts} columns={this.modalColumns} pagination={false}/>
      </RadioGroup>
    </Modal>
  }

  render(){
    
    return <LocaleProvider locale={thTH}>
      <div style={{paddingLeft:'24px',paddingRight:'24px'}}>
        <Row gutter={24}>
          <Col span={10}>
            <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} />
          </Col>
          <Col span={14}>
            <h1>บริการที่จองไว้</h1>
            <Table rowKey="reserve_id" columns={this.columns} dataSource={this.props.customerReservations} />
            {this.renderChoosePaymentAccountModal()}
          </Col>
        </Row>
      </div>
    </LocaleProvider>
  }
}

function mapStateToProps(state){
	return {
    customerReservations: state.CustomerReducer.customerReservations,
    paymentAccounts:state.CustomerReducer.paymentAccounts
	}
}

function mapDispatchToProps(dispatch){
	return {
		fetchReserved: (customer_id)=>{
			dispatch(CustomerActions.fetchReservedServices(customer_id))
    },
    payService: (payment_number,reserve_id)=>{
      dispatch(CustomerActions.payService(payment_number,reserve_id))
    }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservedServices);