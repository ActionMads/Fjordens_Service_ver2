using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Fjordens_Service_ver2.Models
{
    public class PostIt
    {
        [Key]
        public int EventId { get; set; }

        public string Title { get; set; }

        public string From { get; set; }

        public string To { get; set; }

        public string Note { get; set; }

        public int TemplateNo { get; set; }

        public DateTime CreatedDate { get; set; }

        public virtual int CustomerId { get; set; }

        public virtual int EmployeeId { get; set; }

    }
}