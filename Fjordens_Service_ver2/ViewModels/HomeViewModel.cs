using Fjordens_Service_ver2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fjordens_Service_ver2.ViewModels
{
    public class HomeViewModel
    {
        public List<Customer> Customers { get; set; }

        public List<Employee> Employees { get; set; }


    }
}