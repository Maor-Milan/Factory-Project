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
    public class ShiftController : ApiController
    {
       ShiftsBL bl=new ShiftsBL();
        // GET: api/Shift
        public IEnumerable<Shift2> Get()
        {
            return bl.getShifts();
        }

        // GET: api/Shift/5
        public Shift2 Get(int id)
        {
            
                return bl.getShiftByID(id);
          
        }

        // POST: api/Shift
        public string Post(Shift2 s)
        {
            bl.addShift(s);
            return "Shift Added";
        }

        // PUT: api/Shift/5
        public string Put(int id, Shift2 s)
        {
            bl.updateShift(id, s);
            return "Shift Updated";
        }

        // DELETE: api/Shift/5
        public string Delete(int id)
        {
            bl.deleteShift(id);
            return "Shift Deleted";
        }
    }
}
