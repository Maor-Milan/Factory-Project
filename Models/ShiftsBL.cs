using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FactoryProject.Models
{
	public class ShiftsBL
	{
		FactoryDBEntities5 db=new FactoryDBEntities5();

		public List<Shift2> getShifts()
		{
			return db.Shift2.ToList();
		}

		public Shift2 getShiftByID(int id)
		{
			 return db.Shift2.Where(x=>x.ID==id).First();
					
		}

		public void addShift(Shift2 s)
		{ 
			db.Shift2.Add(s);
			db.SaveChanges();
		}

		public void updateShift( int id,Shift2 s)
		{
			var shift = db.Shift2.Where(x=>x.ID==id).First();
			shift.Date = s.Date;
			shift.ShiftStart = s.ShiftStart;
			shift.ShiftEnd = s.ShiftEnd;	
			db.SaveChanges();
		}

		public void deleteShift(int id)
		{
			var shift = db.Shift2.Where(x => x.ID == id).First();
			db.Shift2.Remove(shift);
			db.SaveChanges();
		}
	}
}