using Fjordens_Service_ver2.DAL.Contracts;
using Fjordens_Service_ver2.DAL.Repositories;
using Fjordens_Service_ver2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fjordens_Service_ver2.Utils
{
    public class DummyDataGen
    {
        public void generateData()
        {
            using (ICustomerRepository _repo = new CustomerRepository(ApplicationDbContext.Create()))
            {
                _repo.Insert(new Customer()
                {
                    Company = "It-Minds",
                    Address = "Trommesalen 5",
                    Email = "test@test.dk",
                    PhoneNumber = "11111111",
                    Tasks = "test",
                    ContactPerson = "Mads"
                });
                _repo.Save();
            }

            using (IEmployeeRepository _empolyeeRepo = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                _empolyeeRepo.Insert(new Employee()
                {
                    FirstName = "Mads",
                    LastName = "Munk",
                    Address = "Mågevej 46",
                    Email = "mads@madsen.dk",
                    PhoneNumber = "22222222"
                });
                _empolyeeRepo.Save();
            }

        }

    }
}