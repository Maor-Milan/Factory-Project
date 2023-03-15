using System.Collections.Generic;
using System;
using System.Linq;
using System.Web;

namespace FactoryProject.Models
{
	public class DepartmentBL
	{
		FactoryDBEntities5 db = new FactoryDBEntities5();

		public List<Department> getAllDepartments(string depName)
		{

			if (depName == "")
			{
				return db.Department.ToList();
			}

			else 
			{
				return db.Department.Where(x=>x.DepartmentName==depName).ToList();
			}



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
			var depToUpdate=db.Department.Where(x => x.ID == id).First();	
			depToUpdate.DepartmentName=updep.DepartmentName;
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