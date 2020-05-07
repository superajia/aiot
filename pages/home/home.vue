<template>
	<view style="width:750rpx">
		<map id="map" style="width: 100%; height: 100vh;" :latitude="latitude" :longitude="longitude" :scale="scalema" :markers="markers" 
		 @markertap="clickmarker" @tap="showView">
		</map>
	</view>
</template>
<script>
	// 日期控件
	import vuex from 'vuex'
	var view1 = null,view2 = null,view3 = null,view4 = null,view5 = null,call_now={},kind="car",a = null;var statusbar = 44;
	export default {
		data() {
			return {
				isandroid:true,
				url:this.$store.state.url,
				management_car: null,
				latitude: 34.153002,
				longitude: 112.480765,
				scalema:5,
				markers:[],
			}
		},
		computed: {
			token() {return this.$store.state.logindata.token},
			tm(){return this.$store.state.tm}, 
		},
		watch: {
			tm(val){
				if(val==-10086){return};
				view1.hide();view2.hide();view3.hide();
				console.log("选取的车辆id为"+val);
				this.initMapAgain(val)
			}
		},
		onLoad(option) {
			console.log("load"); 
			this.requestcars();
			this.requestalert();
			// 获取当前页面，并将原生视图控件添加到页面上
			var that = this;
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			var currentWebview = page.$getAppWebview();
			uni.getSystemInfo({
				success:function(res){
					console.log(res);
					if(res.platform=="ios"){
						that.isandroid = false;statusbar = res.statusBarHeight+44+"px";
						that.$store.commit('setisandroid',"false");
					}else{that.$store.commit('setisandroid',"true");}
				}
			});
			//底部图标
			view1 = new plus.nativeObj.View('test',
			                                 {bottom: '0',left: '4%',height: '150px',width: '92%'},
											[{tag:'rect',id:'rect0',rectStyles:{color:'#fff',radius:'10px'}},
											 {tag:'rect',id:'rect', rectStyles:{color:'#cccccc'},position:{top:'80px',left:'4%',width:'92%',height:'1px'}},
											 {tag:'img',id:'test1', src:'static/i-rename.png',position:{top:'87px',left:'8%',width:'34px',height:'34px'}},
											 {tag:'font',id:'test2',text:'一键点名',            position: {top:'126px',left:'3%',width:'20%',height:'20px'},
											 textStyles:{size:'12px'}},
											 {tag:'img',id:'test3', src:'static/i-location.png',position: {top:'87px',left:'32%',width:'34px',height:'34px'}},
											 {tag:'font',id:'test4',text:'位置追踪',            position: {top:'126px',left:'27%',width:'20%',height:'20px'},
											 textStyles:{size:'12px'}},
											 {tag:'img',id:'test5', src:'static/i-route.png',position: {top:'87px',left:'57%',width:'34px',height:'34px'}},
											 {tag:'font',id:'test6',text:'轨迹回放',            position: {top:'126px',left:'52%',width:'20%',height:'20px'},
											 textStyles:{size:'12px'}},
											 {tag:'img',id:'test7', src:'static/i-more.png',position: {top:'87px',left:'82%',width:'34px',height:'34px'}},
											 {tag:'font',id:'test8',text: '更多',           position: {top:'126px',left:'77%',width:'20%',height:'20px'},
											 textStyles:{size:'12px'}}]);
			view1.hide();
			view1.addEventListener("click",function(e){
				var x = e.clientX;var y = e.clientY;var that = this;
				if (x > 10 && x < 70 && y > 80)
			    {
				var data = {"param_data":{"device_id":call_now.dev,"set_command":"call_now","set_value":"0"}};
				var v = "/device_set_person/";
				if(kind=="car"){v="/device_set_car/"};
				uni.request({url:call_now.url+v,method:"POST",header:{"authorization": call_now.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						console.log(res.data);
						uni.showModal({title:"一键点名",content:res.data.data.msg,showCancel:false});
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:"一键点名",content:"指令发送失败,"+error,showCancel:false});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
				//令设备立刻上报GPS定位数据,10秒钟一次,持续三分钟
				// uni.showModal({title:'一键点名',content: '指令已下发,等待设备响应。。。',showCancel:false});
				} else if (x > 95 && x < 155 && y > 80) {uni.navigateTo({url: 'main/location'})} else if (x > 185 && x < 245 && y > 80) {uni.navigateTo({url: 'main/datatime'})} else if (x > 275 && x < 335 && y > 80) {if(kind=="car"){uni.navigateTo({url: '../more/more_car'})}else{uni.navigateTo({url: '../more/more'})} }}, false);
			view2 = new plus.nativeObj.View('test2',{bottom: '70px',left: '5%',height: '80px',width: '90%'});
			view2.hide()
			if(this.isandroid){view3 = new plus.nativeObj.View('test3',{top: '0px',left: '0px',height: '50px',width: '100%',backgroundColor: '#ffffff'});
			}else{view3 = new plus.nativeObj.View('test3', {top:statusbar,left: '0px',height: '50px',width: '100%',backgroundColor: '#ffffff'});}
			view3.hide();
			view4 = new plus.nativeObj.View('test4',
			                                 {top: '44%',left: '4px',height: '73px',width: '32px',backgroundColor: '#fff'},
											 [{tag: 'img',id: 'img',src: 'static/fonad.png',position: {top: '3px',left: '1px',width: '30px',height: '30px'}},
											 {tag: 'img',id: 'img2',src: 'static/tongbu.png',position: {top: '39px',left: '0px',width: '32px',height: '32px'}},
											 {tag: 'rect',id: 'rect',rectStyles: {color: '#999999'},position: {top: '36px',left: '10%',width:'80%',height: '1px'}}]);
			view4.show();
			view4.addEventListener("click",function(e){
				var x = e.clientX;var y = e.clientY;
				if (y < 38) {uni.getLocation({
					type:'gcj02',success:function(res){
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.scalema = 18;
						that.covers2.push({
							id:14,latitude:res.latitude,longitude:res.longitude,
							iconPath: '/static/ren.png',width: 1,height: 1,
							callout: {content: "当前所在位置",color: "#FF0000",fontSize: "24",borderRadius: "10",bgColor: "#FF0000",padding: "10",display: "ALWAYS"},
						});
					},
				    })
				}else if(y>38){
					that.requestcars();
				}
			},false);
			view5 = new plus.nativeObj.View('test5',
			                                {top: '44%',left:'91%',height: "73px",width: '32px',backgroundColor: '#fff'},
										    [{tag: 'rect',id: 'rect',rectStyles: {color: '#999999'},position: {top: '36px',left: '10%',width: '80%',height: '1px'}}, 
											 {tag: 'img',id: 'img',src: 'static/jia.png',position: {top: '3px',left: '1px',width: '30px',height: '30px'}},
											 {tag: 'img',id: 'img2',src: 'static/jian.png',position: {top: '40px',left: '1px',width: '30px',height: '30px'}}]);
			view5.show();
			view5.addEventListener("click",function(e){
				var x = e.clientX;var y = e.clientY;
				if (y < 38) {
					if (that.scalema > 17) {uni.showToast({title: '最大了'});return;};
					that.scalema++;
				} else if (y > 38) {
					if (that.scalema < 6) {uni.showToast({title: '最小了'});return;};
					that.scalema--;}
				}, false);
			currentWebview.append(view1);
			currentWebview.append(view2);
			currentWebview.append(view3);
			currentWebview.append(view4);
			currentWebview.append(view5);
		},
		onReady() {console.log("ready");},
		methods: {
			showView(){
				view1.hide();
				view2.hide();
				view3.hide();
			},
			//请求所有车辆数据
			requestcars( ) {
				plus.nativeUI.showWaiting();
				// console.log(Object.keys(res.data.data));
				uni.request({
					url:this.url + "/time_now/?key=all",method: "GET",sslVerify:false,
					header:{"authorization": this.token,"key":"vehicle_real_time_positioning","map": "gd"},
				    success: (res) => {
						if(res.data.code == 1000){
						// console.log("树形展示请求成功");console.log(res.data.data.user_dic);
						this.$store.commit('settree',res.data.data.user_dic);
						}else{
							console.log(res);
							var error = "错误码:"+res.statusCode;
							if(res.data.code){error=res.data.error};
							console.log(error);
						}
					},
					fail:(res)=>{console.log(res);}});
				uni.request({
					url:this.url + "/all_on_line/",method:"GET",sslVerify:false,
					header:{"authorization": this.token,key:"all_on_line","map": "gd"},
				    success:(res) => {
				    	if(res.data.code == 1000){
				    		// console.log("所有车辆请求成功");console.log(res.data.data.all_device);
				    		this.management_car = res.data.data.all_device;
							// console.log(res.data.data);
							this.initMap( );
				    	}else if(res.statusCode==403){
								plus.nativeUI.closeWaiting();
				    			uni.showModal({title:'提示',content:'token过期,请重新登录',showCancel:false})
				    	}else{
							plus.nativeUI.closeWaiting();
							console.log(res);
							var error = "错误码:"+res.statusCode;
							if(res.data.code){error=res.data.error};
							uni.showToast({title:error,icon:"none",duration:3000});
				    	};
				    },
				    fail:(res)=>{
						plus.nativeUI.closeWaiting();
				    	console.log(res);
						uni.showToast({title:'请检查网络',icon:"none",duration:2000});
				    },
				});
			},
			//初始化地图的中心,markers
			initMap() {console.log("initMap");var that = this,url='/static/p.png';
			this.longitude = 112.480765;
			this.latitude = 34.153002;
			this.markers = [];this.scalema = 5;
			view1.hide();view2.hide();view3.hide();
			
			this.management_car.forEach((item, index) => {
				if(item.kind=="person_gps"){url='/static/p.png'}else{url='/static/car.png'}
				that.markers.push({id:index+1,latitude: item.lat,longitude:item.lng,name:item.name,iconPath:url})});
			plus.nativeUI.closeWaiting();
			}, 
			//从列表选择后整理地图marker
			initMapAgain(num){
				var that = this,url='/static/p.png';
				this.markers = [];  this.scalema = 15;
				this.management_car.forEach((item, index) => {
					if(item.device_id==num){
						a=index;that.latitude = item.lat;that.longitude = item.lng;
						if(item.kind=="person_gps"){
							url='/static/p.png'
						}else{
							url='/static/car.png'};
						that.markers.push({id:1,latitude: item.lat,longitude: item.lng,name:item.name,iconPath:url})}})
				this.showInfor(a);
			},
			//请求报警信息
			requestalert(){
				uni.request({
					url:this.url+"/real_time/",method:"GET",sslVerify:false,
					header:{"authorization":this.token,"map":"gd"},
					success: (res) => {
						if (res.data.code == 1000) {
							console.log("报警请求成功");
							var len = res.data.data.length+"";
							uni.setTabBarBadge({index:1,text:len});   
				        }else{console.log(res);uni.setTabBarBadge({index:1,text:"0"});};
				    },
				    fail:(res) =>{console.log(res);uni.setTabBarBadge({index:1,text:"0"});}
				});
			},
			//点击标记点
			clickmarker(e) {
				if(e.target.markerId==1){ }else{a = e.target.markerId-1;}
				console.log("获取索引:" +a);
				//隐私iOS点击会先移动，再次点击才会出现弹窗
			    if(this.isandroid){this.longitude = this.management_car[a].lng;this.latitude = this.management_car[a].lat;}
				this.showInfor(a);
				},
			//选中标记点
			showInfor(a){
				var that = this;
				var infor = this.management_car[a];
				call_now = {url:this.url,token:this.token,dev:infor.device_id};
				infor.index = a;
				if(infor.kind=="person_gps"){kind="person"}else{kind="car"};
				// console.log(infor);
				this.$store.commit('setinformation', infor);
				new Promise((resolve, reject) => {
						var point = new plus.maps.Point(infor.lng,infor.lat);
						plus.maps.Map.reverseGeocode(point, {},
							function(e) {resolve(e.address);},
							function(e) {resolve("获取当前地址失败!");});
					}).then(address => {
						that.$store.commit('setlocation', address);
						view2.reset();view3.reset();
						if(kind=="person"){var bitmap = new plus.nativeObj.Bitmap('car','static/mapperson4.png');view3.drawBitmap(bitmap, {top: '0px',left: '0px',width: '100%',height: '100%'}, {top: '7px',left: '10%',width: '38px',height: '36px'});}
						else{var bitmap = new plus.nativeObj.Bitmap('car','static/mapcar.png');view3.drawBitmap(bitmap, {top: '0px',left: '0px',width: '100%',height: '100%'}, {top: '4px',left: '10%',width: '50px',height: '42px'});}
						view3.drawText(infor.name, {top: '0px',left: '0px',width: '100%',height: '38px'}, {size: '17px',align: 'center',color: '#000000',weight:'bold'});
						view3.drawText("IMEI:"+infor.device_id, {top: '28px',left: '0px',width: '100%',height: '20px'}, {size: '11px',align: 'center',color: '#808080'});
						// 给view2添加车牌号,位置,状态,速度,定位类型,通讯时长,定位时间,
						if(infor.status=='在线'){view2.drawText(infor.status, {top: '11px',left: '11px',width: '100%',height: '10px'}, {size: '11px',align: 'left',color:'#1AAD19'});
						}else{view2.drawText(infor.status, {top: '11px',left: '11px',width: '100%',height: '10px'}, {size: '11px',align: 'left',color: '#808080'});}
			
						view2.drawText(infor.speed + ' km/h', {top: '11px',left: '26%',width: '100%',height: '10px'}, {size: '11px',align: 'left',color: '#808080'});
						view2.drawText('电量'+infor.battery + '%', {top: '11px',left: '48%',width: '100%',height: '10px'}, {size: '11px',align: 'left',color: '#808080'});
						view2.drawText('定位类型: ' + infor.track_type, {top: '11px',left: '71%',width: '100%',height: '10px'}, {size: '11px',align: 'left',color: '#808080'});
						view2.drawText('位置: ' + address, {top: '27px',left: '10px',width: '93%',height: 'wrap_content'}, {size: '13px',align: 'left',color: '#000000',whiteSpace:"normal"});
						view2.drawText('通讯时间: ' + infor.serv_receive, {top: '63px',left: '10px',width: '100%',height: '10px'}, {size: '11px',align: 'left',color: '#808080'});
						view2.drawText('定位时间: ' + infor.dev_upload, {top: '63px',left: '52%',width: '100%',height: '10px'}, {size: '11px',align: 'left',color: '#808080'});
						view1.show();
						view2.show();
						view3.show();
					}).catch(
						e => {
							console.log(JSON.stringify(e))
						})
			}
		},
		// 监听点击导航栏图标,跳转到车辆列表
		onNavigationBarButtonTap(val) {
			this.$store.commit("settm",-10086);
			uni.navigateTo({url: 'list/list'})	
		},
		// onShow() {console.log("show")},
		// onHide() {console.log("hide")},
		// onUnload() {console.log("unload")}
	}
</script>
<style>
</style>
