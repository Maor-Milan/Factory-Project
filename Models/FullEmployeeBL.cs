using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FactoryProject.Models
{
	public class FullEmployeeBL
	{
		FactoryDBEntities5 db=new FactoryDBEntities5();

		public List<FulEmployee> GetEmployeesWithShifts()
		{
			List<FulEmployee> emps = new List<FulEmployee>();
			foreach (var item in db.Employee)
			{
				FulEmployee employee = new FulEmployee();
				employee.ID = item.ID;
				employee.FullName = item.FullName;
				employee.StartingYear = item.StartingYear;
				employee.DepartmentID = item.DepartmentID;
				employee.Shifts = new List<Shift2>();



				var shifts = db.Shift2.Where(x => x.ID == item.ID);
				foreach (var shift in shifts)
				{
					employee.Shifts.Add(shift);
				}
				emps.Add(employee);


			}
			return emps;

		}
		public Department getDepartmentById(int id)
		{
			var department = db.Department.Where(x => x.ID == id).First();
			return department;
		}

		public void addNewDepartment(Department newDep)
		{
			db.Department.Add(newDep);
			db.SaveChanges();
		}

		public void updateDepartment(int id, Department updep)
		{
			var depToUpdate = db.Department.Where(x => x.ID == id).First();
			depToUpdate.DepartmentName = updep.DepartmentName;
			depToUpdate.Manager = updep.Manager;

			db.SaveChanges();

		}

		public void deleteDepartment(int id)
		{
			var depToUpdate = db.Department.Where(x => x.ID == id).First();
			db.Department.Remove(depToUpdate);

			db.SaveChanges();

		}
	}
}