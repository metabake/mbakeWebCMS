
import { Email } from 'mbake/lib/Email'
import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'
import { IDB } from '../lib/IDB'

import { TerseB } from "terse-b/terse-b"
    

export class AdminHandler extends BaseRPCMethodHandler {
   log:any = new TerseB(this.constructor.name) 

   emailJs = new Email()
   IDB: IDB
   configIntu

   constructor(IDB, configIntu) {
      super(1)
      this.IDB = IDB
      this.configIntu = configIntu

   }//()

   auth(login, pass) {
      this.log.info('admin')
      const user = 'admin'
      const pswd = this.configIntu.secret
      if (login == user && pass == pswd) {
         return 'OK'
      }
      return 'FAIL'
   }

   async checkAdmin(params) {
      this.log.info('checkAdmin')
      let auth = await this.auth(params.admin_email, params.admin_pass)

      if (auth != 'OK') 
         return 'FAIL'
       else 
         return 'OK'

   }//()


   async getConfig(params) {

      let auth = await this.auth(params.admin_email, params.admin_pass)

      if (auth != 'OK') return

      let data = await this.IDB.getConfig();

      return data
   }//()

   async updateConfig(params) {

      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let emailjsService_id = params.emailjsService_id
      let emailjsTemplate_id = params.emailjsTemplate_id
      let emailjsUser_id = params.emailjsUser_id

      let res =  this.IDB.updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id);
      this.log.info("TCL: AdminHandler -> updateConfig -> res", res)
      if (res) {
         let data = [];
         data.push({
            emailjsService_id: emailjsService_id,
            emailjsTemplate_id: emailjsTemplate_id,
            emailjsUser_id: emailjsUser_id,
         });
         
         return data

      }
   }

   async resetPasswordIfMatch(params) {
      let adminEmail = Buffer.from(params.admin_email).toString('base64');
      let newPassword = Buffer.from(params.password).toString('base64');
      const result = await this.IDB.resetPasswordAdminIfMatch(adminEmail, params.code, newPassword);

      return result
   }//()

   async getEditors(params) {

      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let editors = this.IDB.getEditorsAll()
      return editors
   }

   /**
    *  Needs a guid sent by browsers. There is a getGUID() 
    */
   async addEditor(params) {
      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let guid = params.id;
      let email = params.email;
      let name = params.name;
      let password = params.password;

      await this.IDB.addEditor(guid, name, email, password)

      return 'OK'
   }//()

   /**
    *  edit user
    */
   async editEditor(params) {
      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let guid = params.uid;
      let name = params.name;
      let data = await this.IDB.editEditor(guid, name);

      return data
   }

   async deleteEditor(params) {
      let auth = await this.auth(params.admin_email, params.admin_pass)
      if (auth != 'OK') return

      let guid = params.uid;
      await this.IDB.deleteEditor(guid)

      return 'OK'
   }//()

}//class

