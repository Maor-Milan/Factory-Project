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

    public class EmpShiftTableController : ApiController
    {
        EmployeeShiftTableBL bl =new EmployeeShiftTableBL();
        // GET: api/EmpShiftTable
        public IEnumerable<EmployeeShift2> Get()
        {
            return bl.getAll();
        }

        // GET: api/EmpShiftTable/5
        public EmployeeShift2 Get(int id)
        {
            return bl.getById(id);
        }

        // POST: api/EmpShiftTable
        public string Post(EmployeeShift2 newEmp)
        {
            bl.addNewempShift(newEmp);
            return "New EmpShift Created";

        }

        // PUT: api/EmpShiftTable/5
        public string Put(int id, EmployeeShift2 upEmp)
        {
            bl.updateEmpShift(id,upEmp);
           return "empShift Updated";

        }

        // DELETE: api/EmpShiftTable/5
        public string Delete(int id)
        {
                bl.deleteEmpShift(id);
            return "EmpShift Deleted";

        }
    }
}
