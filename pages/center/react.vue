<template>
	<view class="center">
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-text">修改昵称</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-text">修改密码</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		
	</view>	
</template>
<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data(){
			return{
				
			}
		},	
		computed: {
			...mapState({
				alldata: state => state.userdata
			}),
		},
		methods: {
			
		}
	}
</script>
<style>
	.userclass {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		margin: auto;
	}
</style>
