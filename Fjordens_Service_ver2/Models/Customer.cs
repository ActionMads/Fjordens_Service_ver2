using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Fjordens_Service_ver2.Models
{
    public class Customer
    {
        [Key]
        public int CustomerId { get; set; }

        public string Company { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Tasks { get; set; }

        public string ContactPerson { get; set; }

    }
}