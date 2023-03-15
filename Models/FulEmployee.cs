using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FactoryProject.Models
{
	public class FulEmployee
	{
		public int ID { get; set; }
		public string FullName { get; set; }
		public int StartingYear { get; set; }
		public int DepartmentID { get; set; }

		public List<Shift2> Shifts  { get; set; }
		
		
	}
}