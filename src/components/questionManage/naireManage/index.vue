<!-- 问卷管理页面 -->
<template>
  <div class="naireManage">
  <!-- {{quesNoOption}} -->
    <!-- {{naireWithQues}} -->
    <!-- {{multipleSelection}} -->
    <div class="optionDiv">
      <el-input size="mini" v-model="search" placeholder="请输入内容"></el-input>
      <el-button size="mini" type="success" @click="batchDelete">批量删除</el-button>
      <el-button size="mini" type="success" @click="add">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table
        @selection-change="handleSelectionChange"
        :data="naireList"
        style="width: 100%" :height="tableHeight">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center"
          prop="name"
          label="问卷名称">
        </el-table-column>
        <el-table-column align="center"
          prop="description"
          label="问卷描述">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" round @click="handleEyes(scope.$index, scope.row)" size="mini">预览</el-button>
            <el-button type="info" round @click="handleEdit(scope.$index, scope.row)" size="mini">修改</el-button>
            <el-button type="danger" round @click="handleDelete(scope.$index, scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="问卷名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问卷描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目列表" :label-width="formLabelWidth">
          <el-button size="mini" @click="showTrans">点击选择</el-button>
        </el-form-item>
      </el-form>
      <div class="contentDiv">
        <div class="itemDiv" v-for="(item,index) in quesShowList">
          <ul>
            <li>
              序号{{index+1}}:&nbsp;&nbsp;{{item.name}}
            </li>
            <li style="padding-left:30px;" v-for="(option,num) in item.options">
              {{option.label}}.&nbsp;{{option.name}}
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="success" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 穿梭框 模态框 -->
    <el-dialog :title="dialogTransTitle" :visible.sync="dialogTransVisible">
      <el-transfer v-model="quesIds" :data="quesList"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="success" @click="dialogTransVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 问卷预览 -->
    <el-dialog :title="naireWithQues.name" :visible.sync="dialogEyeVisible">
      <!-- {{naireWithQues}} -->
      <span>{{naireWithQues.description}}</span>
      <div class="contentDiv">
        <div class="itemDiv" v-for="(item,index) in naireWithQues.questionVMs">
          <ul>
            <li>
              序号{{index+1}}:&nbsp;&nbsp;{{item.name}}
            </li>
            <li style="padding-left:30px;" v-for="(option,num) in item.options">
              {{option.label}}.&nbsp;{{option.name}}
            </li>
          </ul>
        </div>
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
      tableHeight:'300px',
      dialogTitle:'新增',
      dialogFormVisible:false,
      dialogTransTitle:'题目列表',
      dialogTransVisible:false,
      dialogEyeVisible:false,
      formLabelWidth:'80px',
      form:{
        name:'',
        description:'',
      },
      quesIds:[],
    }
  },
  computed:{
    quesShowList(){
      return this.questions.filter((item,index)=>{
        return this.quesIds.indexOf(item.id)!=-1;
      });
    },
    quesList(){
      let arr = [];
      this.quesNoOption.forEach((item)=>{
        let obj = {
          key:item.id,
          label:item.name
        };
        arr.push(obj);
      });
      return arr;
    },
    naireList(){
      let vm = this;
      return this.naires.filter((item)=>{
        if(item.name){
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
    ...mapGetters(['naires','quesNoOption','questions','naireWithQues']),
  },
  created(){
    this.findAllNaire();
    this.findAllQuesNoOption();
    this.tableHeight = ($(window).height()-190)+'px';
    this.findAllQuestion();
  },
  mounted(){
    // vue实例与DOM绑定并且渲染完毕
    //设置元素的高度，在这里设置，选中元素。
  },
  methods:{
    showTrans(){
      this.dialogTransVisible = true;
    },
    // 保存
    save(){
      this.form.questionIds = this.quesIds.join(',');
      this.saveOneNaire(this.form).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.findAllNaire();
        }else{
          this.$notify({
            title: '失败',
            message: '保存失败',
            type: 'error'
          });
          this.dialogFormVisible = false;
        }
      }).catch((error)=>{
        this.$notify({
          title: '失败',
          message: '保存失败',
          type: 'error'
        });
        this.dialogFormVisible = false;
      });
    },
    // 批量删除
    batchDelete(){
      let ids = this.multipleSelection.map((item)=>{
        return item.id;
      });
      this.batchNaire({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllNaire();
        }else{
          this.$notify({
            title: '失败',
            message: '批量删除失败',
            type: 'error'
          });
        }
      }).catch((error)=>{
        this.$notify({
          title: '失败',
          message: '批量删除失败',
          type: 'error'
        });
      });
    },
    // 新增
    add(){
      this.dialogTitle = "新增";
      this.dialogFormVisible = true;
      this.form = {
        name:'',
        description:'',
      };
      this.quesIds = [];
    },
    // 预览
    handleEyes(index,row){
      this.findNaireWithQues({id:row.id}).then((data)=>{
        this.dialogEyeVisible = true;
      });
    },
    // 编辑
    handleEdit(index,row){
      this.dialogTitle = "编辑";
      this.findNaireWithQues({id:row.id}).then((data)=>{
        // data===this.naireWithQues
        this.form = {
          id:data.id,
          name:data.name,
          description:data.description,
        };
        this.quesIds = data.questionVMs.map((item)=>{
          return item.id;
        });
        this.dialogFormVisible = true;
      });
    },
    // 删除
    handleDelete(index,row){
      this.deleteOneNaire({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllNaire();
        }else{
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error'
          });
        }
      }).catch((error)=>{
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'error'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    ...mapActions(['findAllNaire','saveOneNaire','deleteOneNaire','batchNaire','findAllQuesNoOption','findAllQuestion','findNaireWithQues']),
  },
}
</script>
<style>
  .optionDiv .el-input{
    width:200px;
  }
  .el-dialog__header{
      background: #eee;
     }
</style>
<style scoped lang="scss">
  .naireManage{
    .optionDiv{
      button{
        float:right;
        margin-left:10px;
      }
    }
    .itemDiv{
      border:1px solid #777777;
      margin-top:10px;
      padding:3px 0px;
      border-radius: 15px;
      ul{
        list-style:none;
        padding-left:10px;
        margin-bottom:0;
        margin-top:0;
      }
    }

  }
</style>