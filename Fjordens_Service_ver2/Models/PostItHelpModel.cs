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

        public string employee { get; set; }

        public string customer { get; set; }

        public string note { get; set; }
    }
}