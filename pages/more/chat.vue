<template>
	<view style="display:block;width:100%;overflow:hidden;">
		<view class="content">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory" upper-threshold="50"> 
				<!-- 加载历史数据waitingUI --> 
				<view v-if="showLoading" class="loading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view> 
					</view> 
				</view>
				<view class="my-header" style="margin-top:1px;">{{thetoptip}}<view style="border-bottom:2rpx solid #aaaaaa;width:20%"></view></view>
				<view class="row" v-for="(row,index) in historymsgList" :key="index" :id="'msg'+row.id">
					<!-- 用户消息 -->
					<block>
						<!-- 自己发出的消息 -->
						<view class="time1">{{row.time}}</view>
						<view class="my" v-if="row.uid==0">
							<view class="left">
								<span v-if="row.state" class="iconfont" style="color:#ff4433;font-size:44rpx;padding-right:16rpx;">&#xe622;</span>
								<view v-if="row.type=='text'" class="bubble">
									<rich-text :nodes="row.content.text"></rich-text> 
								</view>
								<view v-if="row.type=='voice'" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id?'play':''">
									<view class="length">{{row.content.length}}</view>
									<view class="icon my-voice"></view>
								</view>
								<view v-if="row.type=='img'" class="bubble img" @tap="showPic0(row)" >
									<image :src="row.content.url" :style="{'width': row.content.w+'px','height': row.content.h+'px'}"></image>
								</view></view>
							<view class="right">
								<image src="/static/face1.png"></image></view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.uid!=0">
							<view class="left">
								<image src="/static/face2.png"></image>
							</view>
							<view class="right">
								<!-- <view class="username">
									<view class="name">{{row.userinfo.username}}</view> <view class="time">{{row.time}}</view>
								</view> -->
								<view v-if="row.type=='text'" class="bubble">
									<rich-text :nodes="row.content.text"></rich-text>
								</view>
								<view v-if="row.type=='voice'" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id?'play':''">
									<view class="icon other-voice"></view>
									<view class="length">{{row.content.length}}</view>
								</view>
								<view v-if="row.type=='img'" class="bubble img" @tap="showPic0(row)">
									<image :src="row.content.url" :style="{'width': row.content.w+'px','height': row.content.h+'px'}"></image>
								</view>
							</view>
						</view>
					</block>
				</view>
				
				
				
				
				
				
				
				
				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.id">
					<!-- 用户消息 -->
					<block>
						<!-- 自己发出的消息 -->
						<view class="time1">{{row.time}}</view>
						<view class="my" v-if="row.uid==0">
							<view class="left">
								<span v-if="row.state" class="iconfont" style="color:#ff4433;font-size:44rpx;padding-right:16rpx;">&#xe622;</span>
								<view v-if="row.type=='text'" class="bubble">
									<rich-text :nodes="row.content.text"></rich-text> 
								</view>
								<view v-if="row.type=='voice'" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id?'play':''">
									<view class="length">{{row.content.length}}</view>
									<view class="icon my-voice"></view>
								</view>
								<view v-if="row.type=='img'" class="bubble img" @tap="showPic(row)" >
									<image :src="row.content.url" :style="{'width': row.content.w+'px','height': row.content.h+'px'}"></image>
								</view></view>
							<view class="right">
								<image src="/static/face1.png"></image></view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.uid!=0">
							<view class="left">
								<image src="/static/face2.png"></image>
							</view>
							<view class="right">
								<!-- <view class="username">
									<view class="name">{{row.userinfo.username}}</view> <view class="time">{{row.time}}</view>
								</view> -->
								<view v-if="row.type=='text'" class="bubble">
									<rich-text :nodes="row.content.text"></rich-text>
								</view>
								<view v-if="row.type=='voice'" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id?'play':''">
									<view class="icon other-voice"></view>
									<view class="length">{{row.content.length}}</view>
								</view>
								<view v-if="row.type=='img'" class="bubble img" @tap="showPic(row)">
									<image :src="row.content.url" :style="{'width': row.content.w+'px','height': row.content.h+'px'}"></image>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view style="height:30rpx;width:100%;"></view>
			</scroll-view>
		</view>
		<view class="bottom" :class="popupLayerClass">
			<!-- 底部输入栏 -->
			<view class="input-box"  @touchmove.stop.prevent="discard">
				<!-- 录音 -->
				<view class="voice">
					<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="tapvoice"></view></view>
				<!-- 文本输入 -->
				<view class="textbox">
					<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
					<view class="text-mode"  :class="isVoice?'hidden':''">
						<view class="box">
							<input v-model="textMsg"  @focus="textFocus" @confirm="sendText" cursor-spacing="18"/></view></view></view>
				<!-- 加号 -->
				<view class="more" @tap="showMore">
					<view class="icon add"></view></view>
				<!-- 发送 -->
				<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
					<view class="btn">发送</view></view>
			</view>
			<!-- 更多 -->
			<view class="popup-layer">
			    <!-- 更多功能 相册-拍照 -->
			    <view class="more-layer">
				    <view class="list">
					    <view class="box" @tap="getImage('album')"><view class="icon tupian2"></view></view>
					    <view class="box" @tap="getImage('camera')"><view class="icon paizhao"></view></view>
				    </view>
			    </view>
			</view>
		</view>
		
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
			<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
	</view>
</template>
<script>
	import vuex from 'vuex'
	var r = null;var id = 0;
	function getDate(type){
		var that=this;
		var date = new Date();
		if(type=="lastweek"){
			date.setTime(date.getTime()-24*60*60*7000);}
		if(type=="3seconds"){
			date.setTime(date.getTime());} 
		if(type=="13seconds"){
			date.setTime(date.getTime()-12000);}
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hours =  date.getHours();
		let minutes =  date.getMinutes();
		let seconds = date.getSeconds();
		month = month > 9 ? month : '0' + month;day = day > 9 ? day : '0' + day;
		hours = hours > 9 ? hours : '0' + hours;minutes = minutes > 9 ? minutes : '0' + minutes;seconds = seconds > 9 ? seconds : '0' + seconds;
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`};
	var tenseconds=null,now=null,timernow=null,timerhistory=null,istoday=null;
	export default {
		data() {
			return {
				isHistoryLoading:false,//是否是第一次加载
				showLoading:false,//显示加载动画
				thetoptip:"下拉加载历史消息",//顶部提示
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',//滚动到的位置
				 
				sametime:'',//时间参考值
				isVoice:false,//是否显示话筒
				popupLayerClass:'',//是否显示抽屉
				
				textMsg:'',//文字信息
				historymsgList:[],
				msgList:[],//消息列表:文字列表，图片列表，声音列表
				msgImgList:[],//图片URL列表
				hismsgImgList:[],//图片URL列表
				p:"",
				voiceTis:'按住 说话', //录音提示
				recordTis:"手指上滑 取消发送",//录音文字
				recording:false, //是否录音中
				willStop:false,//是否即将停止
				recordTimer:null,//录音所用定时器
				recordLength:0,//录音时长
				playMsgid:null, //正在播放的id
				initPoint:{identifier:0,Y:0},//录音判断上滑
				
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
				// socketTask:null, //websocket实体
				// is_open_socket:false //websocket状态
				
			};
		},
		computed:{
			lastweek(){return getDate("lastweek")},
			today(){return getDate()},
		},
		onLoad(option) {
			var that =this;
			id = 0;
			uni.setNavigationBarTitle({title:"与"+this.infor.name+"的微聊"});
			istoday = getDate().slice(0,10);
			timernow = setInterval(function(){that.reqNow()},10000);
			this.p = plus.audio.createPlayer({src:""});
			this.p.addEventListener("canplay",function(){
				// console.log("音频已就绪");
				if(that.playMsgid>999){
					that.historymsgList[that.playMsgid-1000].content.length=that.p.getDuration()+"秒";
				}else{that.msgList[that.playMsgid].content.length=that.p.getDuration()+"秒";}
				
				that.p.play(function(){console.log('播放成功');that.playMsgid=null;},
				            function(){console.log('播放失败');that.playMsgid=null;});
			});
		},
		onUnload() {
			console.log("unload");
			clearInterval(timernow);
			this.goclear();
		},
		onShow(){
			this.scrollTop = 9999999;
		},
		methods:{
			loadHistory () {
				if(this.isHistoryLoading){return;}
				this.thetoptip = "正在加载...";
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false;//关闭滑动动画
				this.showLoading = true;//显示加载动画
				this.reqHistory();
					//这段代码很重要，不然每次加载历史数据都会跳到顶部
					// this.$nextTick(function() {
					// 	this.$nextTick(function() {
					// 		this.scrollAnimation = true;//恢复滚动动画
					// 		this.showLoading = false;
					// 	});
					// });
			},
			
			//更多功能(点击+弹出)
			showMore(){this.isVoice = false;if(this.popupLayerClass){this.popupLayerClass="";return};this.popupLayerClass = 'showLayer';},
			// 打开抽屉
			openDrawer(){this.popupLayerClass = 'showLayer';},
			// 隐藏抽屉
			hideDrawer(){this.popupLayerClass = '';},
			//获取焦点，则关闭抽屉
			textFocus(){
				// var that = this;
				// var timeout1 = setTimeout(function(){that.popupLayerClass = '';clearTimeout(timeout1)},1000)
				// // this.popupLayerClass = ''
			},
			//点击录音，关闭抽屉
			tapvoice(){this.isVoice=!this.isVoice;this.popupLayerClass = ''},
			// 1.01发送文字消息,为空退出，不为空调用sendMsg,清空输入栏
			sendText(){
				if(!this.textMsg){return};
				let msg = {text:this.textMsg};
				this.sendMsg(msg,'text');
				this.textMsg='';
			},
			//// 1.02发送图片消息，包含图片，相机
			getImage(type){
				var that = this;
				uni.chooseImage({
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [type], //从相册选择还是相机
				    success: function (res) {
				        var piclist = res.tempFilePaths;
						for(let i=0;i<piclist.length;i++){
							uni.getImageInfo({
								src:piclist[i],
								success:(image)=>{
									let msg = {url:res.tempFilePaths[i],w:image.width,h:image.height,url64:''};
									that.sendMsg(msg,'img');
								}
							});
						}
				    }
				}) 		
			},
			// 2.00整理发送消息
			sendMsg(content,type){
				//实际应用中，此处应该提交长连接，模板仅做本地处理。
				var nowDate = new Date();
				var hours = nowDate.getHours(),minutes = nowDate.getMinutes(),morning="上午 ";
				if(hours>11){morning="下午 "};
				hours = hours > 9 ? hours : '0' + hours;minutes = minutes > 9 ? minutes : '0' + minutes;

				var newtime = morning+hours+":"+minutes;
				if(this.sametime == newtime){newtime = ''}else{this.sametime = newtime}
				let msg = {state:'',id:id,time:newtime,type:type,uid:0,content:content}
				this.screenMsg(msg);
				this.popupLayerClass = '';
				id++;
			},
			// 2.01对方的消息
			receiveMsg(content,type){
				var nowDate = new Date();
				var hours = nowDate.getHours(),minutes = nowDate.getMinutes(),morning="上午 ";
				if(hours>11){morning="下午 "};
				hours = hours > 9 ? hours : '0' + hours;minutes = minutes > 9 ? minutes : '0' + minutes;
				var newtime = morning+hours+":"+minutes;
				if(this.sametime == newtime){newtime = ''}else{this.sametime = newtime}
				
				let msg = {state:true,id:id,time:newtime,type:type,uid:1,content:content}
				this.screenMsg(msg);
				console.log(msg);
				this.popupLayerClass = '';
				id++;
			},
			//3.00显示消息(筛选处理)
			screenMsg(msg){
				//非自己的消息震动
				if(msg.uid!=0){
					console.log('振动');
					uni.vibrateLong();
					switch (msg.type){
						case 'text':this.addTextMsg(msg);break;
						case 'voice':this.addVoiceMsg(msg);break;
						case 'img':this.addImgMsg(msg);break;
					}
				}else{
				    //自己的消息展示和发送
					switch (msg.type){
						case 'text':this.sendReq('writing_msg',msg.content.text,msg);this.addTextMsg(msg);break;
						case 'voice':this.voi64(msg);this.addVoiceMsg(msg);break;
						case 'img':this.pic64(msg);this.addImgMsg(msg);break;
					}
				}
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+msg.id
				});
			},
			// 4.01添加文字消息 4.02语音消息  4.03图片消息 到列表
			addTextMsg(msg){this.msgList.push(msg);},
			addVoiceMsg(msg){this.msgList.push(msg);},
			addImgMsg(msg){
				var that = this;
				if(msg.content.url=="static/fail.png"){that.msgList.push(msg);return};
				msg.content = this.setPicSize(msg.content);
				this.msgImgList.push(msg.content.url);
				this.msgList.push(msg);
				// console.log(msg.msg.content.url)
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content){let maxW = uni.upx2px(350);let maxH = uni.upx2px(350);if(content.w>maxW||content.h>maxH){let scale = content.w/content.h;content.w = scale>1?maxW:maxH*scale;content.h = scale>1?maxW/scale:maxH;}return content;},
			// 预览图片
			showPic(msg){uni.previewImage({indicator:"none",current:msg.content.url,urls: this.msgImgList});},
			showPic0(msg){uni.previewImage({indicator:"none",current:msg.content.url,urls: this.hismsgImgList});},
			
			// 添加系统文字消息到列表
			// addSystemTextMsg(msg){// 	this.msgList.push(msg);// },// sendSystemMsg(content,type){// 	let lastid = this.msgList[this.msgList.length-1].msg.id;// 	lastid++;// 	let row = {type:"system",msg:{id:lastid,type:type,content:content}};// 	this.screenMsg(row)// },
			
			// 播放语音
			playVoice(msg){
				console.log("点击了");
				this.p.setStyles({src:msg.content.url});
				this.playMsgid=msg.id;
			},
			// 录音开始及结束的回调(不包含结束)
			voiceBegin(e){
				var that = this;
				if(e.touches.length>1){return ;}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				//获得录音对象AudioRecorder
				r = plus.audio.getRecorder();
				// 开始录音
				r.record({
					format:'amr',
				//录音结束(回调文件)
				},function(e){
					clearInterval(that.recordTimer);
				    if(!that.willStop){    
				    	if(that.recordLength==0){uni.showToast({title:'录音时间太短',icon:'none'});that.willStop = false;that.recordTis = '手指上滑 取消发送';return;}					
						let msg = {length:0,url:e};
				    	let min = parseInt(that.recordLength/60);
				    	let sec = that.recordLength%60;
				    	min = min<10?'0'+min:min;
				    	sec = sec<10?'0'+sec:sec;
				    	msg.length = min+':'+sec;
				    	that.sendMsg(msg,'voice')};
				    that.willStop = false;
					that.recordTis = '手指上滑 取消发送';
				},function(e){
					
				})
				this.voiceTis='松开 结束';
				this.recordLength = 0;
				this.recording = true;
				this.recordTimer = setInterval(()=>{this.recordLength++;},900) 
				
			},
			// 录音被打断
			voiceCancel(){if(!this.recording){return;};this.recording = false;this.voiceTis='按住 说话';r.stop();},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){if(!this.recording){return;}let touche = e.touches[0];if(this.initPoint.Y - touche.clientY>=uni.upx2px(160)){this.willStop = true;this.recordTis = '松开手指 取消发送'}else{this.willStop = false;this.recordTis = '手指上滑 取消发送'}},
			// 结束录音
			voiceEnd(e){if(!this.recording){return;}this.recording = false;this.voiceTis='按住 说话';console.log('录音结束额');r.stop();},
			discard(){return;},
			voi64(msg){
				var that = this;
				var url = msg.content.url
				//通过url 获取文件对象
				plus.io.resolveLocalFileSystemURL(url,function(entry){
				    //通过文件对象 获取文件数据对象
				    entry.file(function(file){
								// 新建文件读取对象
								var fileReader = new plus.io.FileReader();
								fileReader.readAsDataURL(file);
								fileReader.onloadend = function(evt){
								that.sendReq("wav_msg",evt.target.result,msg);
								}
					})
				});
			},
		    //将url转化为base64，并发送
			pic64(msg,num){
				var url = "_doc/"+(new Date()).valueOf()+".jpg";
				var that = this;
				plus.zip.compressImage({
					src:msg.content.url,
					dst:url,
					format:"png",
					quality:num
				},function(event){  
					console.log(event.size/1024);
					if(!num&&event.size/1024>40){
						that.pic64(msg,10); 
						return
					};
					// console.log(event.target);console.log(event.size);
					//通过url 获取文件对象
					plus.io.resolveLocalFileSystemURL(url,function(entry){
					    //通过文件对象 获取文件数据对象
					    entry.file(function(file){
									// 新建文件读取对象
									var fileReader = new plus.io.FileReader();
									fileReader.readAsDataURL(file);
									fileReader.onloadend = function(evt){
										that.sendReq("picture",evt.target.result,msg);
									}
						})
					});
	            },function(error){console.log(error.message);});	
			},
			sendReq(order,value,msg){ 
				var that = this;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":order,"set_value":value}};
				uni.request({url:this.url +"/avp_in/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						if(res.data.data.msg=="set_param,ok!"){return}
						else{uni.showToast({title:res.data.data.msg,icon:"none",duration:2000});}
					}else{
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});
					};
					msg.state=true;
				},
				fail:(res)=>{uni.showToast({title:"消息发送失败，请检查网络",icon:"none",duration:2000});msg.state=true;},
				});
			},
			//查询历史聊天记录
			reqHistory(){
				var that = this;var url = this.url;
				var device_id = this.infor.device_id;
				var data = {"device_id":device_id,"s_time":this.lastweek,"e_time":this.today};
				uni.request({url:this.url +"/select_avp/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						console.log("有历史消息了");
						// console.log(res);
						var list = res.data.data.all_data,len = list.length;
						var state ="",msg = {},id = 999,time0="",time1="",user = 0;
						for(let i=0;i<len;i++){
							id++;
							if(list[i].to_user==device_id){user=0}else{user=1};
							time1 = list[i].add_time.slice(0,16);
							if(time0==time1){time1=""}else{time0 = time1;if(time1.slice(0,10)==istoday){if(time1.slice(11,13)>11){time1="下午 "+time1.slice(11,)}else{time1="上午 "+time1.slice(11,)}}};
							if(list[i].othermesg1==0){state=false}else{state=true};
							if(list[i].kind=="text"){
								msg = {text:list[i].content};
							}else if(list[i].kind=="img"){
							    msg = {url:"static/timg.gif",w:120,h:120};
							    that.loadImage(url+list[i].picture_path,i);
							}else if(list[i].kind=="voice"){
								msg = {url:url+list[i].picture_path,length:"xx秒"};
									// plus.io.getAudioInfo({filePath:toURL,success:function(e){var seconds= parseInt(e.duration);var minutes = 0;if(seconds>59){seconds=seconds-60;minutes=minutes+1};var minute = minutes > 9 ? minutes : '0' + minutes;var second = seconds > 9 ? seconds : '0' + seconds;var time = minute+":"+second;that.msgList[i].msg.content.length=time;} });
							};
							that.historymsgList.push({state:state,id:id,time:time1,type:list[i].kind,uid:user,content:msg})
						    // console.log(that.historymsgList[i]);
						};
						var timeout = setTimeout(function(){that.showLoading = false;
					    that.thetoptip = "没有更多消息";
					    that.scrollAnimation = true;
						clearTimeout(timeout);
						},1000)
					    	
					}else{
						that.scrollAnimation = true;that.thetoptip = "下拉加载历史消息";that.showLoading = false;that.isHistoryLoading = false;
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error="暂无聊天消息"};
						uni.showToast({title:error,icon:"none",duration:3000});
						console.log(error+"时间"+data.s_time+"--时间"+data.e_time);
					}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:3000});
				    that.scrollAnimation = true;that.thetoptip = "下拉加载历史消息";that.showLoading = false;that.isHistoryLoading = false;},
				}); 
			},
			//每十秒查询一次最新聊天纪律
			reqNow(){
				var that = this;var url = this.url;
				var device_id = this.infor.device_id;
				tenseconds = getDate("13seconds");now = getDate("3seconds");
				var data = {"device_id":device_id,"s_time":tenseconds,"e_time":now};
				uni.request({url:this.url +"/select_avp/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						console.log("有新消息了");
						var list = res.data.data.all_data.filter((item,i)=>{return item.send_user == device_id});   
						var len = list.length;var msg = {};
						// 获取新消息，并判断是图片还是语音
						for(let i=0;i<len;i++){
							if(list[i].kind=="text"){
								msg = {text:list[i].content};
								that.receiveMsg(msg,"text");
							}else if(list[i].kind=="img"){
							    that.loadImage(url+list[i].picture_path,"now");
							}else if(list[i].kind=="voice"){
								msg = {url:url+list[i].picture_path,length:"??秒"};
								that.receiveMsg(msg,"voice");
							}
						};
					}else{
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error="暂无聊天消息"};
						console.log(error+" 时间:"+data.s_time+" -- 时间:"+data.e_time);
					}
				},
				fail:(res)=>{console.log(res);},
				});
			},
			//加载图片获取信息
			loadImage(oldurl,i){
				var that = this;
				uni.getImageInfo({
				    src:oldurl,
				    success:function(im) {
					   var content = {url:im.path,w:im.width,h:im.height};
					   if(i=="now"){that.receiveMsg(content,"img");return;};
					   that.historymsgList[i].content = that.setPicSize(content);
					   that.hismsgImgList.push(content.url);
				    },
					fail:function(res){
						var content = {url:"static/fail.png",w:120,h:120};
						if(i=="now"){that.receiveMsg(content,"img");return;};
						that.historymsgList[i].content = content;
					}
				});
			},
			//清理聊天信息
			goclear(){
				plus.io.requestFileSystem(plus.io.PRIVATE_DOC,function(fs){
					fs.root.removeRecursively(function(entry){
						console.log("清理成功");
					},function(e){console.log("清理失败");});
				})
			},
			// initWebsocket(){
			// 	this.socketTask = uni.connectSocket({
			// 		url:"ws://192.168.0.105:8088/ws/web/name/",
			// 		success:(res)=>{console.log("成功");console.log(res);},
			// 		fail:(res)=>{console.log("失败");console.log(res);}
			// 	});
			// 	this.socketTask.onOpen((res) => {
			// 		this.is_open_socket = true;
			// 		console.log("WebSocket连接正常打开中...！");
			// 	})
			// },
		}
	}
</script>
<style lang="scss">
	@import "@/common/style.scss"; 
.content{
	
}
</style>