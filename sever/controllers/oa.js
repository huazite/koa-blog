/*
 * @Author: huazi 
 * @Date: 2018-03-05 11:27:44 
 * @Last Modified by: huazi
 * @Last Modified time: 2018-03-07 09:49:03
 * ================后台管理页面主程序================
 */


class OaController{
	
	//展示后台主页面
	static async showAdmin(ctx){
		await ctx.render('../views/admin/index.ejs',{
			
		});
	}
	 
}

exports = module.exports = OaController;