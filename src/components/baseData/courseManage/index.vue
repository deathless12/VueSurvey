<!-- 课程管理页面 -->
<template>
  <div class="course">
    <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入关键字搜索" size="mini"></el-input>
       <el-button type="success" size="mini" @click="batchDeleteCourse">批量删除</el-button>
        <el-button type="success" size="mini" @click="addCourse">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table
	    ref="multipleTable"
	    :data="courseList"
	    tooltip-effect="dark"
	    style="width: 100%" border
	    @selection-change="handleSelectionChange" height="520px">
	    <el-table-column
	      type="selection"
	      width="55" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="课程名称" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="period"
	      label="课程周期" align="center">
	    </el-table-column>
	    <el-table-column
	      prop="description"
	      label="课程简介" align="center">
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
	  <el-form :model="form" ref="ruleForm" :rules="rules">
	    <el-form-item label="课程名称" :label-width="formLabelWidth" prop="name">
	      <el-input v-model="form.name" autocomplete="off"></el-input>
	    </el-form-item>
	    <el-form-item label="课程周期" :label-width="formLabelWidth" prop="period">
	      <el-input v-model="form.period" autocomplete="off"></el-input>
	    </el-form-item>
	    <el-form-item label="课程介绍" :label-width="formLabelWidth" prop="description">
	      <el-input v-model="form.description" autocomplete="off"></el-input>
	    </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取 消</el-button>
	    <el-button type="primary" @click="saveCourse('ruleForm')">保 存</el-button>
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
	      dialogTitle:'添加课程',
	      dialogFormVisible:false,
	      formLabelWidth:'80px',
	      form:{},
        rules:{ 
          name:[
            { required: true, message: '请输入课程名称', trigger: 'blur' }
          ],
          description:[
            { required: true, message: '请输入课程简介', trigger: 'blur' }
          ],
          period:[
            { required: true, message: '请输入课程周期',trigger: 'blur'},
            { type: 'number', message: '课程周期必须为数字值',trigger: 'blur'}
          ],
       },
    }
  },
  computed:{
  	courseList(){
  		let vm = this;
  		return this.courses.filter((item)=>{
  			if(item.name){
  				return item.name.indexOf(vm.search)!=-1;
  			}else{
  				return true;
  			}
  		});
  	},
    ...mapGetters(['courses']),
  },
  created(){
  	this.findAllCourse().then().catch();	
  },
  methods:{
    // 批量删除
    batchDeleteCourse(){
      // 获取用户选中的复选框对应的id
      let ids = this.multipleSelection.map((item) => {
        return item.id;
      });
      // ids 是一个数组 要将其转换成用，分割各元素的字符串
      this.batchCourse({ids:ids.toString()}).then((data) => {
        console.log(data);
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllCourse().then();
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
	 addCourse(){
	    this.form = {
	      type:1,
	    },
	    this.dialogFormVisible = true;
	  },
    saveCourse(ruleForm){
      // 保存
      // 向后台发送数据 成功后提示 关闭模态框 刷新数据
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.saveOneCourse(this.form).then((data) => {
            if(data.stauts == 200){
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success'
              });
              // 关闭模态框
              this.dialogFormVisible = false;
              this.findAllCourse().then();
              console.log(this.courseList)
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
        }
      })
    },
  	handleSelectionChange(val) {
        this.multipleSelection = val;
    },
      // 删除按钮
    handleDelete(index,row){
        let id = row.id;
        this.deleteCourseById({id}).then((data) => {
        if(data.stauts == 200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllCourse().then();
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
          period:row.period,
          description:row.description,
          id:row.id
        };
        this.dialogFormVisible = true;
        this.dialogTitle = '编辑';
    },
    ...mapActions(['findAllCourse','saveOneCourse','deleteCourseById','batchCourse']),
    },
}
</script>
<style scoped>
  .el-input{
  	width:300px;
  }
</style>
<style scoped lang="scss">
	.course .optionDiv button{
		float:right;
		margin-left:10px;
	}
	.course .optionDiv button.searchBtn{
		float:none;
	}
	.course .tableDiv{
		margin-top: 10px;
	}
</style>