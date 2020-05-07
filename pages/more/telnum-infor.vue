<template>
	<form class='page'>
		<view class="my-frame">
			<view class=""><image src="/static/header1.png" style="width:64px;height:64px;margin:60rpx auto 20rpx;"></image></view>
			
				<input class="my-input" type="text" placeholder-class placeholder="名称" name="name" v-model="vname"/>
			
				<input class="my-input" type="number" placeholder-class placeholder="号码" name="num" v-model="vnum"/>
		    <view></view>
		</view>
		
	
			<button style="margin-top:180rpx;" hover-class="hover" formType="submit" @tap="save">保存</button>
	</form>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			return {
				vname:'',
				vnum:'',
				id:'',
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		},
		onLoad(option) {
			console.log("load");
			this.id = option.id;
			this.vname = option.name;
			this.vnum = option.num;
		},
		methods:{
			save(){
				var that = this;
				if(!this.vname||!this.vnum){uni.showToast({title:'名称或号码不能为空!',icon:'none',duration:2000});return}
				var value = this.id+","+this.vname+","+this.vnum;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":"phonebook","set_value":value}};
				// console.log(data);
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,
				success: (res) => {
					if (res.data.code == 1000) {
						uni.showModal({title:'保存联系人',content:res.data.data.msg,showCancel:false});
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:'保存联系人',content:"指令发送失败,"+error,showCancel:false});
					}
				},
				fail: (res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			}
		}
	}
</script>

<style>
.my-input{
	/* height: 60rpx; */
	line-height: 88upx;
	background: #e2f5fc;
	/* background-color:#efefef; */
	margin: 40upx 25rpx;
	border-radius: 16upx;
	padding: 20upx 40upx;
	font-size: 40rpx;
	letter-spacing:0.5px;
}
</style>
