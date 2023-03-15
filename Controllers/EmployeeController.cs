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

    public class EmployeeController : ApiController
    {
        static EmployeeBL bl = new EmployeeBL();
        
        
        
        // GET: api/Employee
        public IEnumerable<Employee> Get(string fullname="")
        {
            return bl.GetEmployees(fullname);
        }

        // GET: api/Employee/5
        public Employee Get(int id)
        {
            return bl.getEmployeeByID(id);
        }

        // POST: api/Employee
        public string Post(Employee emp)
        {
            bl.addEmployee(emp);
            return "Employee Added ";
        }

        // PUT: api/Employee/5
        public string Put(int id, Employee emp)
        {
            bl.editEmployee(id, emp);
            return "Employee Updated ";
        }

        // DELETE: api/Employee/5
        public string Delete(int id)
        {
            bl.removeEmployee(id);
            return "Employee Deleted ";
        }
    }
}
