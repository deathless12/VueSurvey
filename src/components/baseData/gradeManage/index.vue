<!-- 年级管理页面 -->
<template>
  <div class="grade">
    <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入内容" size="mini"></el-input>
       <el-button type="success" size="mini" @click="toSearch" class="searchBtn">搜索</el-button>

       <el-button type="success" size="mini" @click="batchDeleteGrade">批量删除</el-button>
        <el-button type="success" size="mini" @click="addGrade">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table
    ref="multipleTable"
    :data="gradeList"
    tooltip-effect="dark"
    style="width: 100%" border
    @selection-change="handleSelectionChange" height="520px">
    <el-table-column
      type="selection"
      width="55" align="center">
    </el-table-column>
    <el-table-column
      prop="name"
      label="年级名称" align="center">
    </el-table-column>
    <el-table-column
      prop="description"
      label="有关描述" align="center">
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
    <el-form-item label="年级名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关描述" :label-width="formLabelWidth" type="textarea"><el-input v-model="form.description" autocomplete="off"></el-input></el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveGrade">保 存</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
	import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
    	search:'',
	      multipleSelection:[],
	      gradeList:[],
	      dialogTitle:'新增',
	      dialogFormVisible:false,
	      formLabelWidth:'80px',
	      form:{
	        school:3,
	      }
    }
  },
  computed:{
     	...mapGetters(['grades']),
  },
  created(){
    let em = this;
  	this.findAllGrade().then(function(data){
  		data = data.filter(function(item){
  			return item.schoolId == 3;
  		});
  		em.gradeList = data;
  	}).catch();	
  },
  methods:{
    // 批量删除
    batchDeleteGrade(){
      // 获取用户选中的复选框对应的id
      let ids = this.multipleSelection.map((item) => {
        return item.id;
      });
      // ids 是一个数组 要将其转换成用，分割各元素的字符串
      this.batchGrade({ids:ids.join(',')}).then((data) => {
        console.log(data);
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllGrade().then((data) => {
          	data = data.filter(function(item){
	  			return item.schoolId == 3;
	  		});
            this.gradeList = data;
          });
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
    saveGrade(){
      // 保存
      // 向后台发送数据 成功后提示 关闭模态框 刷新数据
      this.saveOneGrade(this.form).then((data) => {
        console.log(data);
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          // 关闭模态框
          this.dialogFormVisible = false;
          this.findAllGrade().then((data) => {
          	data = data.filter(function(item){
	  			return item.schoolId == 3;
	  		});
            this.gradeList = data;
          });
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
    toSearch(){
      let em = this;
      this.gradeList = this.grades.filter(function(item){
        if(item.name){
          return item.name.indexOf(em.search) != -1;
        }else{
          return true;
        }
      });
    },
    handleDelete(index,row){
        let id = row.id;
        this.deleteGradeById({id}).then((data) => {
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllGrade().then((data) => {
          	data = data.filter(function(item){
	  			return item.schoolId == 3;
	  		});
            this.gradeList = data;
          });
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
  	handleSelectionChange(val) {
        this.multipleSelection = val;
    },
      // 删除按钮
      handleDelete(index,row){
        let id = row.id;
        this.deleteGradeById({id}).then((data) => {
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllGrade().then((data) => {
          	data = data.filter(function(item){
	  			return item.schoolId == 3;
	  		});
            this.gradeList = data;
          });
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
      // 新增按钮
      addGrade(){
        this.form = {
          schoolId:3
        };
        this.dialogFormVisible = true;
        this.dialogTitle = '新增';
      },
      // 编辑年级信息
      handleEdit(index,row){
        this.form = {
          schoolId:3,
          name:row.name,
          description:row.description,
          id:row.id
        };
        this.dialogFormVisible = true;
        this.dialogTitle = '编辑';
      },
      ...mapActions(['findAllGrade','saveOneGrade','deleteGradeById','batchGrade']),
  },
}
</script>
<style scoped>
  .el-input{
  	width:300px;
  }
</style>
<style scoped lang="scss">
	.grade .optionDiv button{
		float:right;
		margin-left:10px;
	}
	.grade .optionDiv button.searchBtn{
		float:none;
	}
	.grade .tableDiv{
		margin-top: 10px;
	}
</style>