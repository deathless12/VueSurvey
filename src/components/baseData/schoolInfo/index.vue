<!-- 学校信息页面 -->
<template>
  <div class="schoolInfo">
		<table>
			<tr @click="show=false" v-for="(item,index) in tableArr">
				<td>{{item.name}}</td>
				<td>
					<span v-if="show">{{schoolInfo[item.prop]}}</span>
					<el-input v-else v-model="form[item.prop]" placeholder="请输入内容"></el-input>
				</td>
			</tr>
		</table>
		<el-button type="success" @click="save"">保存</el-button>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
    	show:true,
     	tableArr:[{
     		name:"校园名称",
     		prop:'name'
     	},{
     		name:"校园介绍",
     		prop:'description'
     	},{
     		name:"校园地址",
     		prop:'address'
     	},{
     		name:"校园电话",
     		prop:'telephone'
     	},{
     		name:"版权信息",
     		prop:'copyright'
     	}],
     	form:{},
    }
  },
  created(){
  	this.findAllSchoolInfo({id:3}).then((data)=>{
  		// data-->schoolInfo
  		this.form = {
  			id:data.id,
  			name:data.name,
  			description:data.description,
  			address:data.address,
  			telephone:data.telephone,
  			copyright:data.copyright,
  		};
  	});
  },
  computed:{
  	...mapGetters(['schoolInfo'])
  },
  methods:{
  	save(){
  		this.saveOneSchoolInfo(this.form).then((data)=>{
  			if(data.stauts==200){
  				this.$notify({
	          title: '成功',
	          message: '保存成功',
	          type: 'success'
	        });
	        this.show = true;
	        this.findAllSchoolInfo({id:3});
  			}else{
  				this.$notify({
	          title: '失败',
	          message: '保存失败',
	          type: 'error'
	        });
  			}
  		}).catch((error)=>{
				this.$notify({
          title: '失败',
          message: '保存失败',
          type: 'error'
        });
  		});
  	},
  	...mapActions(['findAllSchoolInfo','saveOneSchoolInfo'])
  }
}
</script>
</style>
<style scoped lang="scss">
  .schoolInfo{
  	table{
	  	width: 100%;
	  	border:1px solid black;
	  	border-collapse: collapse;
	  	tr{
	  		border:1px solid black;
	  		line-height: 40px;
	  		font-size: 16px;
	  		td:first-child{
	  			text-align: center;
	  			width:25%;
	  			border:1px solid black;
	  		} 
	  		td:not(:first-child){
	  			border:1px solid black;
	  			padding-left: 10px;
	  		}
	  		.el-input{
	  			.el-input__inner{
	  				color:#f00;
	  			}
	  		}
	  	}
    } 
    button{
    	float: right;
    	margin-top: 10px;
    }
 }
</style>
