<template>
	<view class="page">
		<view class="row1" v-if="isshow">
			<view style="width:80rpx;">名称</view>
			<input class="my-input1" type="text" placeholder="请输入名称" v-model="vname"/>
		    <view style="width:80rpx;margin-left:76rpx;">类型</view>
			<view class="my-input1" @tap="showmask=true">{{type}}</view>
			<!-- 设置多选的蒙层 -->
			<view class="ismask" v-if="showmask" @tap="showmask=false">
				<view class="multi-list" @tap.stop="">
					<view class="multi-item" @tap="select(1)">in</view>
					<view class="multi-item" @tap="select(2)">out</view>
					<view class="multi-item" @tap="select(3)">all</view>
				</view>
			</view>
		</view>
		<view class="row2" v-if="isshow">
			<view style="width:72rpx;">时间</view>
			<view class="my-input2">
				<picker mode="date" :value="date0" @change="changeDate0">
				    <view>{{date0}}</view></picker>
			    <picker mode="time" :value="time0" @change="changeTime0">
				    <view>{{time0}}</view></picker>
			</view>
			<view>-</view>
			<view class="my-input2">
				<picker mode="date" :value="date1" @change="changeDate1">
				    <view>{{date1}}</view></picker>
			    <picker mode="time" :value="time1" @change="changeTime1">
				    <view>{{time1}}</view></picker>
			</view>
		</view>
		<view class="row3" style="border-bottom:1px solid #999;" v-if="isshow">
			<view style="width:80rpx;">形状</view>
			<view class="my-input3" @tap=toPolygon :class="{active:i==1}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><span class="iconfont" style="font-size:52rpx;">&#xe700;</span></view>
			<view class="my-input3" @tap=toCircle :class="{active:i==2}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><span class="iconfont" style="font-size:52rpx;">&#xe639;</span></view>
			<view class="my-input4">
				<slider style="width:260rpx" block-size="22" @change="sliderValue" activeColor="#108ee9" :value=slideV max="3000" @changing="slidingValue"/>
				<view style="width:80rpx;justify-content:center;">{{slideV}}</view>
			</view>
		</view>
		<map id="map" class="map" :class="{active2:isshow}" :latitude="latitude" :longitude="longitude" :markers ="markers"
		 scale="13">
		<cover-image v-if="isshow" src="static/i-submit.png" @tap="confirm" style="width:120rpx;height:120rpx;position:absolute;bottom:-20%;left:42%;"></cover-image>
		</map>
		
	</view>
</template>
<script>
	//北京116.4 39.9  深圳114.0 22.6
	var map = null;var points = [];
	
	
	var markerObj=new plus.maps.Marker(new plus.maps.Point(116.4,39.9));
	
	//创建圆形覆盖物对象circleObj,预设中心点和半径，设置好边框色，填充色，填充透明度，线宽默认5
	var circleObj = new plus.maps.Circle({latitude:22.6,longitude:114.0},500);
	circleObj.setStrokeColor('#ee2200'); 
	circleObj.setFillColor('#ee2200');
	circleObj.setFillOpacity(0.3);
	
	//创建多边形覆盖物对象polygonObj，预设顶点，设置好边框色，填充色，填充透明度，线宽默认5
	var point0 = new Array( new plus.maps.Point(116.0,39.0), new plus.maps.Point(115.0,38.0), new plus.maps.Point(117.0,38.0) );
	var polygonObj = new plus.maps.Polygon( point0 );
	polygonObj.setStrokeColor('#ee2200');
	polygonObj.setFillColor('#ee2200');
	polygonObj.setFillOpacity(0.3);
	export default {
		data() {
			const currentDate = this.getDate();
			const currentTime = this.getTime();
			var infor = this.$store.state.information;
			// console.log(infor);
			var lat = infor.lat;var lng = infor.lng;var isshow = true;
			var fence = this.$store.state.fence;
			if(fence){lat = fence.content[1].lat;lng = fence.content[1].lng;isshow=false};
			return {
				date0:currentDate,//日期0
				date1:currentDate,//日期1
				time0:currentTime,//时间0
				time1:currentTime,//时间1
				showmask:false,//是否显示蒙层
				vname:"",//绑定的名字
				type:"请选择类型",//显示的类型
				i:0,//形状的索引
				slideV:1000,//半径大小
				
				isshow:isshow,
				latitude:lat,
				longitude:lng,
				fence,
				infor,
				markers:[],
			}
		},
		computed:{
			url(){return this.$store.state.url},
			token(){return this.$store.state.logindata.token},
		},
		onReady(){
			console.log("ready");
			var that = this;
			//获取原生地图对象map
			var unimap = uni.createMapContext('map', this);
			map = unimap.$getAppMap();        
			if(that.fence.kind=="polygon"){
				points = [];
				that.fence.content.forEach((item,i)=>{points.push(new plus.maps.Point(item.lng,item.lat));});
				polygonObj.setPath(points);
				map.addOverlay(polygonObj);
				// that.i=4; 
			}else if(that.fence.kind=="circle"){
				var item = that.fence.content;
				circleObj.setCenter(new plus.maps.Point(item[1].lng,item[1].lat));
				circleObj.setRadius(item[0]);
				that.slideV=parseInt(item[0]);
				map.addOverlay(circleObj);
				// that.i=4;
			}
		}, 
		onLoad() {
	        console.log("load"); 
		 //    if(this.infor.kind=="person_gps"){
			// 	this.markers.push({id:1,latitude:this.infor.lat,longitude:this.infor.lng,name:this.infor.name,iconPath:"static/p.png"})
		 //    	markerObj.setPoint(new plus.maps.Point(this.infor.lng,this.infor.lat));
		 //    	markerObj.setLabel(this.infor.name);
			// 	markerObj.setIcon("/static/p.png");
		    	
		 //    }else{
			// 	this.markers.push({id:1,latitude:this.infor.lat,longitude:this.infor.lng,name:this.infor.name,iconPath:"static/car.png"})
			// 	markerObj.setPoint(new plus.maps.Point(this.infor.lng,this.infor.lat));
			// 	markerObj.setLabel(this.infor.name);
			// 	markerObj.setIcon("/static/car.png"); 
			// }
			
			// 将检索到的第一条信息作为标点添加到地图中
				// var searchObj = new plus.maps.Search( map );
				// searchObj.onPoiSearchComplete = function( state, result ){
				// 	console.log("onPoiSearchComplete: "+state+" , "+result.currentNumber);
				// 	if ( state == 0 ) {
				// 		if ( result.currentNumber <= 0 ) {
				// 			alert( "没有检索到结果" );
				// 		}
				// 		for(var i=0; i<result.currentNumber; i++){
				// 			var pos = result.getPosition( i );
				// 			var marker = new plus.maps.Marker( pos.point );
				// 			marker.setLabel( pos.name );
				// 			map.addOverlay( marker );
				// 		}
				// 	} else {
				// 		alert( "检索失败" );
				// 	}
				// }
				// var pt = new plus.maps.Point( 116.404, 39.915 ); // 天安门坐标
				// searchObj.poiSearchNearBy( "肯德基", pt, 1000 );
		    
		},
		methods:{
			//滑块的值
			sliderValue(e){this.slideV = e.detail.value;circleObj.setRadius(this.slideV);},
			slidingValue(e){this.slideV = e.detail.value;},
			//选择类型
			select(i){
				if(i==1){this.type = "in"}else if(i==2){this.type = "out"}else{this.type= "all"};
	            this.showmask=false;
			},
			setMarkers(){
				
				
			},
			toPolygon(){
				this.i = 1;
				map.clearOverlays();
				// map.addOverlay(markerObj);
				points = [];
				polygonObj.setPath(points); 
				map.addOverlay(polygonObj);
				map.onclick = function (point){
					var markObj = new plus.maps.Marker(point);
					map.addOverlay(markObj);
					points.push(point);
					polygonObj.setPath(points);
				}
			},
			toCircle(){
				this.i = 2;
				var that=this;
				map.clearOverlays();
				// map.addOverlay(markerObj);
				circleObj.setRadius(0);
				map.addOverlay(circleObj);
				
				
				map.onclick = function(point){
					circleObj.setCenter(point);
					circleObj.setRadius(that.slideV);      
				}
			},
			confirm(){ //修改和新建围栏
				let that = this;
				var i = this.i;
				if (!that.vname) {
					uni.showToast({icon:'none',title:'请输入名称'});
				}else if (that.type=="请选择类型") {
					uni.showToast({icon:'none',title:'请选择类型'});
				}else if (that.i==0){
					uni.showToast({icon:'none',title:'请绘制围栏'});
				}else if (that.i==1&&points.length<3) {
					uni.showToast({icon:'none',title:'请绘制围栏'});
				}else if (that.i==2&&circleObj.getRadius()==0) {
					uni.showToast({icon:'none',title:'请绘制围栏'});
				}else{
					//时间问题
					var s_time ="0",e_time ="0",content = [],kind = "",i=that.i;
					if(that.date0!=that.date1||that.time0!=that.time1){
						s_time = that.date0+" "+that.time0+":00";
						e_time = that.date1+" "+that.time1+":00";
					};
					//内容及形状问题
					// if(i==4){
					// 	content = that.fence.content;kind = that.fence.kind;
					// }else 
					if (i==1){
						points.forEach((item,i)=>{content.push({lng:item.longitude,lat:item.latitude})})
						kind = "polygon";
					}else if (i==2){
						content = [that.slideV,{"lng":circleObj.getCenter().longitude,"lat":circleObj.getCenter().latitude}];
						kind = "circle";
					}
					var data = {"what":"add","e_fence":{
						        name:that.vname,name_id:'0',
						        kind:kind,in_out:that.type,
								content:content,s_time: s_time,e_time: e_time,
								device_list:[that.infor.device_id]}
					};
					// console.log(data);
					uni.request({url:that.url +"/electric_fence/",method:"POST",header:{"authorization": that.token},data:data,sslVerify:false,
					success: (res) => {
						if (res.data.code == 1000) {
							uni.showModal({title:'围栏设置',content:res.data.data.msg,showCancel:false});
						}else{
							console.log(res);var error = "错误码:"+res.statusCode;
							if(res.data.code){error=res.data.error};
							uni.showModal({title:'围栏设置',content:error,showCancel:false});
						}
					},
					fail: (res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
					});
				}
			},
			changeDate0: function(e) {this.date0 = e.target.value;},
			changeDate1: function(e) {this.date1 = e.target.value;},
			changeTime0: function(e) {this.time0 = e.target.value;},
			changeTime1: function(e) {this.time1 = e.target.value;},
			getDate() {
				var date = new Date();
				let year = date.getFullYear();let month = date.getMonth() + 1;let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getTime() {
				var date = new Date();
				let hours =  date.getHours();let minutes =  date.getMinutes();
				hours = hours > 9 ? hours : '0' + hours;;
				minutes = minutes > 9 ? minutes : '0' + minutes;
				return `${hours}:${minutes}`;
			}
		}
	}
</script>
<style>
.map{width:750rpx;height:100%;}
.row1{box-sizing:border-box;height:8%;padding:0 16rpx;align-items:center;justify-content:start;}
.row2{box-sizing:border-box;height:8%;padding:0rpx 16rpx;align-items:center;justify-content:space-between;}
.row3{box-sizing:border-box;height:8%;padding:0rpx 16rpx;align-items:center;justify-content:flex-start;position:relative;}
.my-input1{
	background: #fff;
	width:200rpx;
	height:82rpx;
	border-radius: 12rpx;
	padding: 0 24rpx;
	align-items:center;
	justify-content:space-around;
	letter-spacing:0.5px;
	box-shadow:1px 1px 6px #aaa;
}
.my-input2{
	background: #fff;
	width:290rpx;
	height:82rpx;
	padding: 0 10rpx;
	align-items:center;
	justify-content:space-around;
	border-radius: 12rpx;
	box-shadow:1px 1px 6px #aaa; 
}
.my-input3{
	background: #fff;
	margin-right:30rpx;
	color:#666;
	width:82rpx;
	height:82rpx;
	align-items:center;
	justify-content:center;
	border-radius: 12rpx;
	box-shadow:1px 1px 6px #aaa; 
}
.my-input4{
	background: #fff;
	width:426rpx;
	height:82rpx;
	align-items:center;
	justify-content:center;
	border-radius: 12rpx;
	box-shadow:1px 1px 6px #aaa; 
}
.ismask{position:absolute;z-index:99;top:0;right:0;left:0;bottom:0;}
.multi-list{
	display:block;
	position:absolute;
	top:20rpx;
	right:36rpx;
	width:200rpx;
	height:260rpx;
	background-color:#fff;
	border-radius:12rpx; 
	box-shadow:1px 1px 6px #aaa;
}
.multi-item{
	margin:10rpx 0;
	padding:10rpx 0;
	justify-content:center;
}
.active{color:#108ee9}
.active2{height:76%}
.my-hover{
	background-color:rgba(100,100,100,0.2)
}
</style>
