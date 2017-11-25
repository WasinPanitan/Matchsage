import React from 'react';
import { Row,Col,Button,Menu,Carousel,Avatar,Card,Modal,Input } from 'antd';
import {connect} from 'react-redux';
import {CustomerActions} from '../../actions';
import NotFound from '../NotFound';
import styled from 'styled-components';
import MapComponent from './MapComponent';
import ServiceReservation from 'components/Service/Reservation/ServiceReservation';
import ReportEmployeeModal from 'components/Common/Modal/ReportEmployeeModal';

const {TextArea} = Input;

const H1 = styled.h1`
	text-align:left;
	color:#402900
`

const P = styled.p`
	text-align:left;
	text-indent:30px;
	color:#402900
`

class ServiceDetail extends React.Component{
	state={
		current :'detail',
		current2 : 'overall',
		isReservation: false,
		showReportEmployeeModal: false,
		selectedReportEmployee:'',
		reportEmployeeTopic:'',
		reportEmployeeContent:'',
		showServiceComplaint: false,
		sendServiceComplaintLoading:false,
		serviceComplaint_topic:'',
		serviceComplaint_content:''
	}
	handleClick = (e) => {
		if(e.key === 'detail' || e.key === 'employee'){
			this.setState({
				current: e.key,
				isReservation: false
			});
		}else if(e.key === 'overall'){
			this.setState({
				current2: e.key,
			});
		}
  }
	componentDidMount(){
		this.props.loadService(this.props.match.params.id);
	}

	onClickReservation = ()=>{
		this.setState({isReservation:true});
	}

	renderServiceComplaint(service_name){
		return <Modal
			visible={this.state.showServiceComplaint}
			title={'รายงาน'+service_name}
			// onOk={()=>{
			// 	this.setState({showServiceComplaint:false})
			// }}
			onCancel={()=>{
				this.setState({showServiceComplaint:false})
			}}
			footer={[
				<Button key="back" size="large" onClick={()=>{
					this.setState({ loading: false,showServiceComplaint:false});
				}}>ยกเลิก</Button>,
				<Button key="submit" type="primary" size="large" loading={this.state.sendServiceComplaintLoading} onClick={async()=>{
					this.setState({ loading: true });
					await this.props.sendComplaint(this.props.serviceStore.service_id,this.state.serviceComplaint_topic,this.state.serviceComplaint_content);
					this.setState({ loading: false,showServiceComplaint:false });
				}}>
					ส่ง
				</Button>,
			]}
		>
			หัวข้อ<br/>
			<Input placeholder="หัวข้อ" value={this.state.serviceComplaint_topic} onChange={(e)=>this.setState({serviceComplaint_topic:e.target.value})}/>
			รายละเอียด<br/>
			<TextArea placeholder="รายละเอียด" value={this.state.serviceComplaint_content} width="100%" autosize={{ minRows: 6}} onChange={(e)=>this.setState({serviceComplaint_content:e.target.value})}/>

		</Modal>
	}

	renderServiceDetail = ()=>{
		return(
			<div>
				{this.state.current==='detail'?<div>
					<Row>
						<H1 style={{display:'inline',float:'left'}}>ชื่อร้าน {this.props.serviceStore.service.service_name}</H1>
						<Button icon="exclamation-circle" type="danger" onClick={()=>this.setState({showServiceComplaint:true,serviceComplaint_topic:'',serviceComplaint_content:''})}
						style={{display:'inline',float:'right'}}>รายงานบริการนี้</Button>
						{this.renderServiceComplaint(this.props.serviceStore.service.service_name)}
					</Row>
				<Row gutter={16} style={{marginBottom:'10px'}}>
					<Col span={12}>
						<Carousel autoplay>
							<div><h1 style={{color:'white'}}>Pic1</h1></div>
							<div><h1 style={{color:'white'}}>Pic2</h1></div>
							<div><h1 style={{color:'white'}}>Pic3</h1></div>
							<div><h1 style={{color:'white'}}>Pic4</h1></div>
						</Carousel>
					</Col>
					<Col span={12}>
						<MapComponent isMarkerShown
						/>
					</Col>
				
				</Row>
				
				<Row>
					<Menu
						onClick={this.handleClick}
						selectedKeys={[this.state.current2]}
						mode="horizontal"
						style={{marginBottom:'10px',display:'inline-block',float:'left',color:'#402900'}}
					>
						<Menu.Item key="overall">
							ข้อมูลทั่วไป
						</Menu.Item>
					</Menu>
					</Row>
					{this.state.current2==='overall'?<div>
						<H1>คำอธิบายร้าน</H1>
						<P>บลา บลา บลา</P>
						<H1>เจ้าของ</H1>
						<P>{this.props.serviceStore.ownerDetail.first_name} {this.props.serviceStore.ownerDetail.last_name}</P>
						<H1>ที่อยู่</H1>
						<P>555/555 บลา บลา บลา<br/></P>
						<P>เบอร์ {this.props.serviceStore.service.contact_number}</P>
						<P>อีเมล์ {this.props.serviceStore.ownerDetail.email}</P>
						<H1>คะแนน</H1>
						<P>{this.props.serviceStore.service.rating}</P>
					</div>
					:
					<div>
						
					</div>
					}
				</div>
				:
				<div>
					<Row >
						<Col span={8}>
							{this.props.serviceStore.employees.employees.map((employee,index)=>{return index%3===0?this.renderEmployeeCard(employee,index):null})}
						</Col>
						<Col span={8}>
							{this.props.serviceStore.employees.employees.map((employee,index)=>{return index%3===1?this.renderEmployeeCard(employee,index):null})}
						</Col>
						<Col span={8}>
							{this.props.serviceStore.employees.employees.map((employee,index)=>{return index%3===2?this.renderEmployeeCard(employee,index):null})}
						</Col>
					</Row>
					<ReportEmployeeModal changeTopic={(topic)=>this.setState({reportEmployeeTopic:topic})} changeContent={(content)=>this.setState({reportEmployeeContent:content})} topic={this.state.reportEmployeeTopic} content={this.state.reportEmployeeContent} employee={this.state.selectedReportEmployee} visible={this.state.showReportEmployeeModal} close={()=>this.setState({showReportEmployeeModal:false})}/>
				</div>
				}
			</div>
		);
	}

	renderEmployeeCard(employee,index){
		return <div>
		<Card style={{ width: '22vw',margin:'auto' }} bodyStyle={{ padding: 0 }}>
			<div>
				<img src="../images/Auteur-zonder-foto-1.png" style={{margin:'auto',display:'block',maxHeight:'22vw'}}/>
			</div>
			<div>
				ชื่อ {employee.first_name} {employee.last_name}
				<br/>เพศ {employee.gender==='male'?'ชาย':'หญิง'}
				<br/>คะแนน {employee.rating}
				<br/><Button icon="exclamation-circle" type="danger" onClick={()=>{
					this.setState({showReportEmployeeModal:true,selectedReportEmployee:employee,reportEmployeeTopic:'',reportEmployeeContent:''})
				}}>รายงานพนักงานคนนี้</Button>
			</div>
		</Card>
	</div>
	}

	render(props){
		let loaded = this.props.serviceStore.service;
		return (
			loaded?this.props.serviceStore.service.service_id?
			<div style={{color:'#402900'}}>
				<img src="../images/banner.jpg" style={{width:'100%',height:'12vw'}}/>
				<Row type="flex" justify="space-between" gutter={48} style={{marginBottom:'20px',marginTop:'20px',paddingLeft:'48px',paddingRight:'48px'}}>
					<Col span={5} style={{paddingLeft:'0px'}}>
						<Menu
							onClick={this.handleClick}
							selectedKeys={[this.state.current]}
							mode="inline"
							style={{color:'#402900'}}
						>
							<Menu.Item key="detail">
								ข้อมูลของร้าน
							</Menu.Item>
							<Menu.Item key="employee">
								พนักงานในร้าน
							</Menu.Item>
						</Menu>
						<Button type="primary" style={{'marginTop':'10px'}}
							onClick={this.onClickReservation}
						>
							จองบริการ
						</Button>
					</Col>

					<Col span={19} style={{backgroundColor:'#FFF8EB',padding:'20px'}}>
						{ this.state.isReservation? <ServiceReservation service_id={this.props.match.params.id}/> :this.renderServiceDetail()}
					</Col>
					
				</Row>
			</div>:<NotFound/>
			:null
		)
	}
}

function mapStateToProps(store){
	return {
		serviceStore: store.service
	}
}

function mapDispatchToProps(dispatch){
	return {
		loadService: (id)=>{
			dispatch(CustomerActions.fetchService(id))
		},
		sendComplaint:(service_id,topic,content)=>{
			dispatch(CustomerActions.sendServiceComplaint(service_id,topic,content))
		}
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetail);