using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fjordens_Service_ver2.Models
{
    public class PostItHelpModel
    {
        public int id { get; set; }

        public string title { get; set; }

        public string start { get; set; }

        public string end { get; set; }

        public bool allDay { get; set; }

        public string employeeName { get; set; }

        public string customerName { get; set; }

        public int employeeId { get; set; }

        public int customerId { get; set; }

        public string note { get; set; }

        public int templateNo { get; set; }
    }
}