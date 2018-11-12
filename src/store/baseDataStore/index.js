// 基础数据仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		grades:[],
		clazzVM:[],
		teachers:[],
		courses:[],
		schoolInfo:[],
	},
	getters:{
		schoolInfo:state => state.schoolInfo,
		grades:state => state.grades,
		clazzVM:state => state.clazzVM,
		teachers:state => state.teachers,
		courses:state => state.courses,
	},
	mutations:{
		changeSchoolInfo(state,data){
			state.schoolInfo = data;
		},
		changeGrades(state,data){
			state.grades = data.filter(item=>{
				return item.schoolId == 3;
			});
		},
		changeClazzVM(state,data){
			state.clazzVM = data.filter(item=>{
				if(item.grade){
					return item.grade.schoolId == 3;
				}		
			});
		},
		changeTeachers(state,data){
			state.teachers = data;
		},
		changeCourses(state,data){
			state.courses = data;
		},
	},
	actions:{
		//校园信息开始
		findAllSchoolInfo(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/school/findById',{params:obj}).then(({data})=>{
					// data就是后台返回的所有的数据  
					context.commit('changeSchoolInfo',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneSchoolInfo(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/school/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//校园信息结束
		//班级开始
		batchClazz(context,obj){
			return new Promise((resolve,reject) => {
				axios.post('/clazz/batchDeleteClazz',qs.stringify(obj)).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		deleteClazzById(context,obj){
			return new Promise((resolve,reject) => {
				axios.get('/clazz/deleteClazzById',{params:obj}).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		saveOneClazz(context,obj){
			return new Promise((resolve,reject) => {
				axios.post('/clazz/saveOrUpdateClazz',qs.stringify(obj)).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		findAllClazzVM(context){
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/findAllVM').then(({data})=>{
					// data就是后台返回的所有的数据  
					context.commit('changeClazzVM',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		// findAllClazz(context){
		// 	return new Promise((resolve,reject)=>{
		// 		axios.get('/clazz/findAll').then(({data})=>{
		// 			// data就是后台返回的所有的数据  
		// 			context.commit('changeClazz',data.data);
		// 			resolve(data.data);
		// 		}).catch((error)=>{
		// 			reject(error);
		// 		});
		// 	})
		// },
		//班级结束
		//课程开始
		findAllCourse(context){
			return new Promise((resolve,reject)=>{
				axios.get('/course/findAllCourse').then(({data})=>{
					// data就是后台返回的所有的数据  
					context.commit('changeCourses',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneCourse(context,obj){
			return new Promise((resolve,reject) => {
				axios.post('/course/saveOrUpdate',qs.stringify(obj)).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		deleteCourseById(context,obj){
			return new Promise((resolve,reject) => {
				axios.get('/course/deleteById',{params:obj}).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		batchCourse(context,obj){
			return new Promise((resolve,reject) => {
				axios.post('/course/batchDelete',qs.stringify(obj)).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},	
		//课程结束
		//教师开始
		findAllTeacher(context){
			return new Promise((resolve,reject)=>{
				axios.get('/user/findAll').then(({data})=>{
					// data就是后台返回的所有的数据  
					context.commit('changeTeachers',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneTeacher(context,obj){
			return new Promise((resolve,reject) => {
				axios.post('/user/saveOrUpdate',qs.stringify(obj)).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		deleteTeacherById(context,obj){
			return new Promise((resolve,reject) => {
				axios.get('/user/deleteById',{params:obj}).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		batchTeacher(context,obj){
			return new Promise((resolve,reject) => {
				axios.post('/user/batchDelete',qs.stringify(obj)).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},	
		//教师结束
		//年级开始
		findAllGrade(context){
			return new Promise((resolve,reject)=>{
				axios.get('/grade/findAll').then(({data})=>{
					// data就是后台返回的所有的数据  
					context.commit('changeGrades',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//新增或更新年级数据
		saveOneGrade(context,obj){
			return new Promise((resolve,reject) => {
				axios.post('/grade/saveOrUpdate',qs.stringify(obj)).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		//通过id删除年级
		deleteGradeById(context,obj){
			return new Promise((resolve,reject) => {
				axios.get('/grade/deleteById',{params:obj}).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		//批量删除年级信息
		batchGrade(context,obj){
			return new Promise((resolve,reject) => {
				axios.get('/grade/batchDelete',{params:obj}).then(({data}) => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			});
		},	
		//年级结束
	}
}