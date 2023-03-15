using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FactoryProject.Models
{
	public class LoginBL
	{
		FactoryDBEntities5 db=new FactoryDBEntities5();

		public List<User3> GetLogin( )
		{

				return db.User3.ToList();
			

		}

		public User3 getUserByID(int id)
		{
			return db.User3.Where(x => x.ID == id).First();
		}

		public void addUser(User3 emp)
		{
			db.User3.Add(emp);
			db.SaveChanges();
		}

		public void editUser(int id, User3 use)
		{
			var user = db.User3.Where(x => x.ID == id).First();
			user.FullName = use.FullName;
			user.UserName = use.UserName;
			user.Password=use.Password;	
			user.DateOfAction = use.DateOfAction;	
			user.NumOfActionsTaken = use.NumOfActionsTaken;
			db.SaveChanges();
		}

		public void removeUser(int id)
		{
			var user = db.User3.Where(x => x.ID == id).First();
			db.User3.Remove(user);
			db.SaveChanges();
		}


	}
}