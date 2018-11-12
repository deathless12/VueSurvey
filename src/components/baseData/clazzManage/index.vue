<!-- 班级 -->
<template>
  <div class="clazz">
    <div class="optionDiv">
      <el-select v-model="grade" placeholder="请选择所属年级" size="mini" clearable>
		    <el-option
		      v-for="(item,index) in grades"
		      :key="item.index"
		      :label="item.name"
		      :value="item.id">
		    </el-option>
	   </el-select>
      <el-input v-model="search" placeholder="请输入关键字搜索" size="mini" clearable></el-input>
       <el-button type="success" size="mini" @click="batchDeleteClazz">批量删除</el-button>
        <el-button type="success" size="mini" @click="addClazz">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table
	    ref="multipleTable"
	    :data="clazzVMList"
	    tooltip-effect="dark"
	    style="width: 100%" border
	    @selection-change="handleSelectionChange" height="520px">
	    <el-table-column
	      type="selection"
	      width="55" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="班级名称" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="description"
	      label="班级简介" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="charge.name"
	      label="班主任" align="center">
	    </el-table-column>
	    <el-table-column label="操作" align="center">
	      <template slot-scope="scope">
	        <i class="fa fa-pencil-square-o" style="color: #ccc;font-size: 25px" @click="handleEdit(scope.$index, scope.row)" title="编辑"></i>
	        <i class="fa fa-trash-o" style="color: red;font-size: 25px;margin-left: 10px" @click="handleDelete(scope.$index, scope.row)" title="删除"></i>
	      </template>
	    </el-table-column>
	  </el-table>
    </div>
      <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
	  <el-form :model="form">
	    <el-form-item label="所属年级" :label-width="formLabelWidth">
	     <el-select v-model="form.gradeId" placeholder="请选择">
		    <el-option
		      v-for="(item,index) in grades"
		      :key="item.index"
		      :label="item.name"
		      :value="item.id">
		    </el-option>
	  	 </el-select>
	    </el-form-item>
	    <el-form-item label="班级名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
         </el-form-item>
	    <el-form-item label="班主任" :label-width="formLabelWidth">
          <el-select v-model="form.chargeId" placeholder="请选择">
		    <el-option
		      v-for="(item,index) in teachers"
		      :key="index"
		      :label="item.name"
		      :value="item.id">
		    </el-option>
	  	 </el-select>
        </el-form-item>
        <el-form-item label="班级介绍" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off" type="textarea"></el-input>
         </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取 消</el-button>
	    <el-button type="primary" @click="saveClazz">保 存</el-button>
	  </div>
	</el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
    	grade:'',
    	search:'',
	      multipleSelection:[],
	      dialogTitle:'添加班级信息',
	      dialogFormVisible:false,
	      formLabelWidth:'80px',
	      form:{
	        
	      }
    }
  },
  computed:{
  	clazzVMList(){
  		let vm = this;
  		 return this.clazzVM.filter((item)=>{
          if(item.name){
            if(item.grade&&vm.grade){
              return (item.name.indexOf(vm.search)!= -1)&&(item.grade.id == vm.grade)
            }
          }
          return item.name.indexOf(vm.search)!=-1;
  		});
    },
    ...mapGetters(['clazzVM','grades','teachers'])
  },
  created(){
  	let vm = this;
  	this.findAllGrade().then().catch();
  	this.findAllTeacher();
  	this.findAllClazzVM().then().catch();	
  },
  methods:{
    // 批量删除
    batchDeleteClazz(){
      // 获取用户选中的复选框对应的id
      let ids = this.multipleSelection.map((item) => {
        return item.id;
      });
      // ids 是一个数组 要将其转换成用，分割各元素的字符串
      this.batchClazz({ids:ids.toString()}).then((data) => { 
      	console.log(data);   
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllClazzVM().then();
        }else{
          this.$notify.error({
            title: '错误',
            message: '批量删除失败'
          });
        }
      }).catch((error) => {
        this.$notify.error({
            title: '错误',
            message: '批量删除失败'
          });
        console.log(error);
      });
    },
	// 新增按钮
	addClazz(){
	    this.form = {
	      
	    },
	    this.dialogFormVisible = true;
	},
    saveClazz(){
      // 保存
      // 向后台发送数据 成功后提示 关闭模态框 刷新数据
     this.saveOneClazz(this.form).then((data) => {
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          // 关闭模态框
          this.dialogFormVisible = false;
          this.findAllClazzVM().then();
        }else{
          this.dialogFormVisible = false;
          this.$notify.error({
            title: '错误',
            message: '保存失败'
          });
        }
      }).catch((error) => {
        this.dialogFormVisible = false;
        this.$notify.error({
            title: '错误',
            message: '保存失败'
          });
      });
    },
  	handleSelectionChange(val) {
        this.multipleSelection = val;
    },
      // 删除按钮
    handleDelete(index,row){
        let id = row.id;
        this.deleteClazzById({id}).then((data) => {
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllClazzVM().then();
        }else{
          this.$notify.error({
            title: '错误',
            message: '删除失败'
          });
        }
      }).catch((error) => {
        this.$notify.error({
            title: '错误',
            message: '删除失败'
          });
      });
      },
      // 编辑年级信息
    handleEdit(index,row){
        this.form = {
          name:row.name,
          gradeId:row.grade?row.grade.id:'',
          chargeId:row.charge?row.charge.id:'',
          description:row.description,
          id:row.id
        };
        this.dialogFormVisible = true;
        this.dialogTitle = '编辑班级信息';
    },
    ...mapActions(['findAllTeacher','saveOneClazz','deleteClazzById','batchClazz','findAllClazzVM','findAllGrade']),
    },
}
</script>
<style scoped>
  .el-input{
  	width:300px;
  }
</style>
<style scoped lang="scss">
	.clazz .optionDiv button{
		float:right;
		margin-left:10px;
	}
	/*.clazz .optionDiv button.searchBtn{
		float:none;
	}*/
	.clazz .tableDiv{
		margin-top: 10px;
	}
</style>