<template>
	<view class="page">
		<view class="logo" @tap="preview" @longpress="select">
			<image class="logo-img" :src="logoUrl"></image>
			<view style="color:#fff;font-size:38rpx;padding:40rpx 40rpx 40rpx;">{{user}}</view>
		</view>
		<view class="my-para">
			<view class="my-cell-start" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="gouser">
				<view class="my-icon iconfont">&#xe6d9;</view><text>帐号</text><span class="iconfont icon-right">&#xe61b;</span></view>
			<view class="my-line"></view>
			<view class="my-cell-start" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="goshare">
				<view class="my-icon iconfont">&#xe72a;</view><text>关于</text><span class="iconfont icon-right">&#xe61b;</span></view>
			<!-- <view class="my-cell-start" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="goset">
				<view class="my-icon iconfont">&#xe70a;</view><text>通用</text><span class="iconfont icon-right">&#xe61b;</span></view> --> 
		</view>
		
		<view class="my-para">
			<!-- <view class="my-cell-start" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="goclear">
				<view class="my-icon iconfont">&#xe647;</view><text>清理缓存</text><view style="flex-direction:row-reverse;position:absolute;top:20rpx;right:64rpx;color:#808080;">{{cookie}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
			<view class="my-line"></view> -->
			<!-- <view class="my-cell-start" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="goreact">
				<view class="my-icon iconfont">&#xe604;</view><text>反馈</text><span class="iconfont icon-right">&#xe61b;</span></view>
			<view class="my-line"></view>
			<view class="my-cell-start" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="goshare">
				<view class="my-icon iconfont">&#xe72a;</view><text>关于</text><span class="iconfont icon-right">&#xe61b;</span></view> -->
		</view>
		
		<view class="my-para" style="margin-top:100rpx;">
			<view class="my-cell-center" style="color:#007aff" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="logout">退出登录</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {logoUrl:"../../static/logo.png",cookie:""}
		},
		computed: {
			user(){var name = null;var login = this.$store.state.logindata;if(login){name = login.username}else{name = "未登录"};return name},
			url(){return this.$store.state.url},
			token(){return this.$store.state.logindata.token},
		},
		methods: {
		    gouser(){uni.navigateTo({url: 'user'})},
			goset(){},
			goclear(){
				// var that = this;
				// plus.io.requestFileSystem(plus.io.PRIVATE_DOC,function(fs){
				// 	fs.root.removeRecursively(function(entry){
				// 		    that.count(); 
				// 		uni.showModal({title:'提示',content: '缓存清理成功',showCancel:false});
				// 	},function(e){uni.showModal({title:'提示',content: '缓存清理成功',showCancel:false});that.count();});
				// })
			},  
			goreact(){},
			goshare(){uni.navigateTo({url: 'code',});},
			logout(){
				var user = this.$store.state.logindata.username;
				uni.reLaunch({url: "../login/login"+"?username="+user});
			},
			count(){
				// var that = this;   
				// plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function( fs ) {
			 //        //获取目录总的信息
				// 	that.cookie = "0 B"  
				// 	fs.root.getMetadata(function(metadata){   
				// 		if(metadata.size==0){that.cookie = "0 B"
				// 		}else if(metadata.size<1024){that.cookie = metadata.size.toFixed(0)+" B"
				// 		}else if(metadata.size<1048576){that.cookie = (metadata.size/1024).toFixed(0)+" K"
				// 		}else{that.cookie = (metadata.size/1048576).toFixed(0)+" M"}
				// 	},function(){console.log(e.message);},false);
					
				// });
				// //读取目录信息对象，用于获取目录中包含的文件及子目录
				// var directoryReader = fs.root.createReader();
				// //获取当前目录中的所有文件和子目录
				// 	directoryReader.readEntries(function(entries){
				// 		for( i=0; i < entries.length; i++ ) {
				// 			entries[i].file(function(file){console.log(file.size/1024)});
				// 		}
				// 	});
			},
			select(){
				var that = this;
				uni.chooseImage({
					count:1, //默认9
					// sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择还是相机
					success: function (res){
						var url = "_doc/"+(new Date()).valueOf()+".png";
						plus.zip.compressImage({
							src:res.tempFilePaths[0],dst:url,format:"png",width:"128px",height:"128px"
						},function(event){  
							plus.io.resolveLocalFileSystemURL(url,function(entry){
							    entry.file(function(file){
									var fileReader = new plus.io.FileReader();
									fileReader.readAsDataURL(file);
									fileReader.onloadend = function(evt){
									that.upLoad(evt.target.result);
									}
								})
							});
						},function(error){console.log(error.message);});
					}
				}) 		
				
			},
			upLoad(v){
				var that = this;
				uni.request({url:this.url +"/head_portrait/",method:"POST",header:{"authorization":this.token},data:{"head":v},sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						uni.showToast({title:"头像上传成功",icon:"none",duration:2000});
						that.downLoad();
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000})
					}
				},
				fail: (res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			downLoad(){
				
				var that = this;
				uni.request({url:this.url +"/head_portrait/",method:"GET",header:{"authorization":this.token},sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000){
						if(res.data.data[0].head_portrait=="0"){return;}
						that.logoUrl = res.data.data[0].head_portrait;
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000})
					}
				},
				fail: (res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			preview(){
				// var that = this;
				var bitmap = new plus.nativeObj.Bitmap();
				var path = "_doc/"+(new Date()).valueOf() + '.png';
				bitmap.loadBase64Data(this.logoUrl,function(){
					// console.log("加载图片成功");
					bitmap.save(path,{},function(index){
						console.log('保存图片成功：'+JSON.stringify(index));
						bitmap.recycle();
						uni.previewImage({
							current:0,
						    urls:[index.target],
						    longPressActions: {
						        success:function(data) {
						            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						        },
						       fail: function(err) {
						            console.log(err.errMsg);
						        }
						    }
						});
					},function(e){console.log(e)});
				},function(e){console.log(e);
					url = "static/fail.png";
				});
				
			}
	    },
		onLoad(){
			this.downLoad();
		}
	}
</script>
<style>
	.my-icon{
		width:40rpx;
		height:40rpx;
		padding:10rpx 14rpx 6rpx 2rpx;
		font-size:40rpx;
		line-height:1;
		color:#007AFF;
	}
	.icon-right{
		position:absolute;
		top:22rpx;
		right:30rpx;
		color:#808080;
		line-height:1.5;
		font-size:38rpx;
	}
</style>
