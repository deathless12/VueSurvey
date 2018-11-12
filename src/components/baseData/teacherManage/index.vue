<!-- 教师管理页面 -->
<template>
  <div class="teacher">
    <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入关键字搜索" size="mini"></el-input>
       <el-button type="success" size="mini" @click="batchDeleteTeacher">批量删除</el-button>
        <el-button type="success" size="mini" @click="addTeacher">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table
	    ref="multipleTable"
	    :data="teacherList"
	    tooltip-effect="dark"
	    style="width: 100%" border
	    @selection-change="handleSelectionChange" :height="tableHeight">
	    <el-table-column
	      type="selection"
	      width="55" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="教师姓名" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="gender"
	      label="性别" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="birth"
	      label="出生日期" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="hiredate"
	      label="入职时间" align="center">
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
	    <el-form-item label="教师姓名" :label-width="formLabelWidth">
	      <el-input v-model="form.name" autocomplete="off"></el-input>
	    </el-form-item>
	    <el-form-item label="性别" :label-width="formLabelWidth">
	      <el-radio v-model="form.gender" label="男">男</el-radio>
  		  <el-radio v-model="form.gender" label="女">女</el-radio>
	    </el-form-item>
	    <el-form-item label="出生日期" :label-width="formLabelWidth">
	       <el-date-picker
		      v-model="form.birth" value-format="yyyy-MM-dd"
		      type="date"
		      placeholder="选择日期">
		    </el-date-picker>
	    </el-form-item>
	   <el-form-item label="入职时间" :label-width="formLabelWidth">
	       <el-date-picker
		      v-model="form.hiredate" value-format="yyyy-MM-dd"
		      type="date"
		      placeholder="选择日期">
		    </el-date-picker>
	    </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取 消</el-button>
	    <el-button type="primary" @click="saveTeacher">保 存</el-button>
	  </div>
	</el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
export default {
  data(){
    return {
    	search:'',
	      multipleSelection:[],
	      dialogTitle:'添加教师信息',
	      dialogFormVisible:false,
	      formLabelWidth:'80px',
	      form:{
	        type:1,
	      }
    }
  },
  computed:{
  	teacherList(){
  		let vm = this;
  		return this.teachers.filter((item)=>{
  			if(item.name){
  				return item.name.indexOf(vm.search)!=-1;
  			}else{
  				return true;
  			}
  		});
  	},
    ...mapGetters(['teachers']),
  },
  created(){
  	this.findAllTeacher().then().catch();	
    this.tableHeight = $(window).height()-194;
  },
  methods:{
    // 批量删除
    batchDeleteTeacher(){
      // 获取用户选中的复选框对应的id
      let ids = this.multipleSelection.map((item) => {
        return item.id;
      });
      // ids 是一个数组 要将其转换成用，分割各元素的字符串
      this.batchTeacher({ids:ids.toString()}).then((data) => {
        console.log(data);
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllTeacher().then();
        }else{
          this.dialogFormVisible = false;
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
      });
    },
	// 新增按钮
	 addTeacher(){
	    this.form = {
	      type:1,
	    },
	    this.dialogFormVisible = true;
	  },
    saveTeacher(){
      // 保存
      // 向后台发送数据 成功后提示 关闭模态框 刷新数据
     this.saveOneTeacher(this.form).then((data) => {
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          // 关闭模态框
          this.dialogFormVisible = false;
          this.findAllTeacher().then();
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
        this.deleteTeacherById({id}).then((data) => {
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllTeacher().then();
        }else{
          this.dialogFormVisible = false;
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
          type:1,
          name:row.name,
          gender:row.gender,
          birth:row.birth,
          hiredate:row.hiredate,
          id:row.id
        };
        this.dialogFormVisible = true;
        this.dialogTitle = '编辑';
    },
    ...mapActions(['findAllTeacher','saveOneTeacher','deleteTeacherById','batchTeacher']),
    },
}
</script>
<style scoped>
  .el-input{
  	width:300px;
  }
</style>
<style scoped lang="scss">
	.teacher .optionDiv button{
		float:right;
		margin-left:10px;
	}
	.teacher .optionDiv button.searchBtn{
		float:none;
	}
	.teacher .tableDiv{
		margin-top: 10px;
	}
</style>