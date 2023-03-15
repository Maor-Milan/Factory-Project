using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FactoryProject.Models;
using System.Web.Http.Cors;

namespace FactoryProject.Controllers
{
	[EnableCors(origins:"*",headers:"*",methods:"*")]
    public class LoginController : ApiController
    {
        
        static LoginBL bl=new LoginBL();

        // GET: api/Login
        public IEnumerable<User3> Get()
        {
            return bl.GetLogin();
        }

        // GET: api/Login/5
        public User3 Get(int id)
        {
            return bl.getUserByID(id);
        }

        // POST: api/Login
        public string Post(User3 use)
        {
            bl.addUser(use);
            return "User Added ";
        }

        // PUT: api/Login/5
        public string Put(int id, User3 use)
        {
            bl.editUser(id, use);
            return "User Updated ";
        }

        // DELETE: api/Login/5
        public string Delete(int id)
        {
            bl.removeUser(id);
            return "User Deleted ";
        }
    }


}

