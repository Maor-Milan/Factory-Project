using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FactoryProject.Models
{
	public class EmpShiftBL
	{
		FactoryDBEntities5 db = new FactoryDBEntities5();

		public List<EmployeeWithShiftsID> GetEmpsShifts()
		{
			List<EmployeeWithShiftsID> emps = new List<EmployeeWithShiftsID>();
			foreach (var item in db.Employee)
			{
				EmployeeWithShiftsID employee = new EmployeeWithShiftsID();
				
				employee.EmployeeID = item.ID;
				employee.ShiftID = new List<int>();

				
				var shifts = db.EmployeeShift2.Where(x => x.EmpID == item.ID);
				foreach (var shift in shifts)
				{
					
					
					employee.ShiftID.Add((int)shift.ShiftID);
				}
				
				
				emps.Add(employee);
			}
			return emps;

		}

		public EmployeeShift2 getEmployeeByID(int id)
		{

			EmployeeShift2 s = db.EmployeeShift2.Where(x => x.ID == id).First();
			return s;
		}

		public void addEmpsShift(EmployeeShift2 emp)
		{
			db.EmployeeShift2.Add(emp);
			db.SaveChanges();
		}

		public void editEmployee(int id, EmployeeShift2 emp)
		{
			var employee = db.EmployeeShift2.Where(x => x.ID == id).First();
			
			employee.EmpID = emp.EmpID;
			employee.ShiftID = emp.ShiftID;
			db.SaveChanges();
		}

		public void removeEmployee(int id)
		{
			var emp = db.EmployeeShift2.Where(x => x.ID == id).First();
			db.EmployeeShift2.Remove(emp);
			db.SaveChanges();
		}
	}
}