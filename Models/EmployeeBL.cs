using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FactoryProject.Models
{
	public class EmployeeBL
	{
		FactoryDBEntities5 db = new FactoryDBEntities5();

		public List<Employee> GetEmployees(string fullname)
		{

			if (fullname =="")
			{
				return db.Employee.ToList();
			}



			else 
			{

				return db.Employee.Where(x => x.FullName == fullname).ToList();
			}

			
		}

		public Employee getEmployeeByID(int id)
		{
			return db.Employee.Where(x => x.ID == id).First();
		}

		public void addEmployee(Employee emp)
		{ 
			db.Employee.Add(emp);
			db.SaveChanges();
		}

		public void editEmployee(int id,Employee emp)
		{
			var employee=db.Employee.Where(x => x.ID == id).First();
			employee.FullName = emp.FullName;
			employee.DepartmentID = emp.DepartmentID;
			employee.StartingYear=emp.StartingYear;
			db.SaveChanges();
		}

		public void removeEmployee(int id)
		{
			var emp=db.Employee.Where(x => x.ID == id).First();
			db.Employee.Remove(emp);
			db.SaveChanges();
		}




	}
}