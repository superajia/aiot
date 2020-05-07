import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: { 
		logindata:"", //登陆信息
		url:"",       //URL地址

		tree:"", //所有车辆分组信息
		information:"",//当前车辆信息
		location:"",//   当前车辆位置
		tm:"", //从设备列表选择的车辆id
		
		fence:"", //当前选择的围栏       车辆.围栏
		order:"",  //单台设备  所有命令
		isandroid:"",//设备类型
	},
	mutations:{
		setisandroid(state,val){
		 	state.isandroid = val
		},
		setorder(state,val){
		 	state.order = val
		},
	    seturl(state,val){
	  		  state.url = val
	    },
	    settree(state,val){
		    state.tree = val
	    },
	    setlocation(state, val){
	  	    state.location=val
	    },
	    settm(state, val) {
	        state.tm = val
	    },
	    setfence(state, val) {
	        state.fence = val
	    },
	    /* 存账户密码 */
		setlogindata(state, val){
		    state.logindata = val
		},
		setinformation(state, val){
			state.information=val
		},
	  },  
});
export default store