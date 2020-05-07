<template>
	<view class="page">
		                                                                                <!-- 不显示中心按钮            不显示全屏按扭                   不显示播放按钮              禁止手滑 -->
		 <video id="myVideo" ref="video1" :src="src" @error="error" controls="false" show-center-play-btn="false" show-fullscreen-btn="false" show-play-btn="false" enable-progress-gesture="false" ></video>
	</view>
</template>
<script>
	var video = null,currentWebview=null;
	export default {
	    data() {return {dev:this.$store.state.information.device_id,vn:this.$store.state.information.video_num}},
		computed:{src(){return "rtmp://"+this.dev+"01"}},
		onLoad() {
			console.log("load");
			var that = this;
			view2 = new plus.nativeObj.View('test2',{bottom:'15%',left:'30%',height:'40px',width:'40%'},[{tag:'font',id:'test',text:'等待对方接听...',textStyles:{size:'20px',align: 'center',color:'#fff'},position:{top: '0px',left: '0px',width: '100%',height: '40px'}}]);
			view3 = new plus.nativeObj.View('test3',{top:'6%',left:'6%',height:'34px',width:'34px'},[{tag:'img',id:'test3', src:'static/v-switch2.png'}]);
			
			// view.addEventListener("click", function(e) {var x = e.clientX;var y = e.clientY;var that = this;
			//     if(x>135&&x<195){uni.navigateBack();
			// 		}else if(y>10&&y<70){
			// 			if(x>10&&x<50){pusher.switchCamera();
			// 			}else if(x>70&&x<110){
			// 				if(sound==1){video.setStyles({muted:true});sound=2}
			// 				else{video.setStyles({muted:false});sound=1};
			// 			}else if(x>230&&x<270){
			// 				if(white==1){pusher.setStyles({beauty:1,whiteness:3});white=2}
			// 				else{pusher.setStyles({beauty:0,whiteness:0});white=1};
			// 			}else if(x>290&&x<340){
			// 				pusher.snapshot(function(e){console.log(e);},function(e){console.log(e);});
			// 			}
			// 		}
			//     });
		},
	    methods: {
			send(){}
	    },
		onUnload(){
			console.log("unload");
		}
	}
</script>

<style>
/* .page{
	background-color:#efefef;
} */
#myVideo{
	width:100%;
	height:300px;
}
.icon{
	width:260rpx;
	height:260rpx;
	margin:260rpx auto 10rpx;
	border-radius:50%; 
	border:0.6px solid #aaa;
	justify-content:center;
	align-items:center;
	background-color:#ffffff;
}
.my-hover{background-color:rgba(100,100,100,0.2)}
</style>
