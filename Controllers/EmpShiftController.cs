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

    public class EmpShiftController : ApiController

    {
        static EmpShiftBL bl = new EmpShiftBL();
        // GET: api/EmpShift
        public IEnumerable<EmployeeWithShiftsID> Get()
        {
            return bl.GetEmpsShifts();
        }

        // GET: api/EmpShift/5
        public EmployeeShift2 Get(int id)
        {
            return bl.getEmployeeByID(id);
        }

        // POST: api/EmpShift
        public string Post(EmployeeShift2 emp)
        {
            bl.addEmpsShift(emp);
            return "Shift Added ";
        }

        // PUT: api/EmpShift/5
        public string Put(int id, EmployeeShift2 emp)
        {
            bl.editEmployee(id, emp);
            return "Employee Updated ";
        }

        // DELETE: api/EmpShift/5
        public string Delete(int id)
        {
            bl.removeEmployee(id);
            return "Employee Deleted ";
        }
    }
}
