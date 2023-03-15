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
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DepartmentController : ApiController
    {
        DepartmentBL bl = new DepartmentBL();
        
        // GET: api/Department
        public IEnumerable<Department> Get(string depName="")
        {
            return bl.getAllDepartments(depName);
        }

        // GET: api/Department/5
        public  Department Get(int id)
        {
            return bl.getDepartmentById(id);
        }

        // POST: api/Department
        public string Post(Department newDep)
        {
            bl.addNewDepartment(newDep);
            return "New Department Created";
        }

        // PUT: api/Department/5
        public string Put(int id, Department updep)
        {
            bl.updateDepartment(id, updep);
            return "Department Updated";
        }

        // DELETE: api/Department/5
        public string Delete(int id)
        {
            bl.deleteDepartment(id);
            return "Department Deleted";
        }
    }
}
