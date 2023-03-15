using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FactoryProject.Models
{
	public class EmployeeShiftTableBL
	{
		FactoryDBEntities5 db = new FactoryDBEntities5();

		public List<EmployeeShift2> getAll()
		{

			
				return db.EmployeeShift2.ToList();
			

		}



		
		public EmployeeShift2 getById(int id)
		{
			return 	db.EmployeeShift2.Where(x => x.ID == id).First();
	

	}

		public void addNewempShift(EmployeeShift2 newEmpShift)
		{
			db.EmployeeShift2.Add(newEmpShift);
			db.SaveChanges();
		}

		public void updateEmpShift(int id, EmployeeShift2 upEmp)
		{
			var empToUpdate = db.EmployeeShift2.Where(x => x.ID == id).First();
			empToUpdate.EmpID = upEmp.EmpID;
			empToUpdate.ShiftID = upEmp.ShiftID;

			db.SaveChanges();

		}

		public void deleteEmpShift(int id)
		{
			var empToUpdate = db.EmployeeShift2.Where(x => x.ID == id).First();
			db.EmployeeShift2.Remove(empToUpdate);

			db.SaveChanges();

		}








	}

}
