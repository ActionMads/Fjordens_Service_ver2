using Fjordens_Service_ver2.DAL.Contracts;
using Fjordens_Service_ver2.DAL.Repositories;
using Fjordens_Service_ver2.Models;
using Fjordens_Service_ver2.Utils;
using Fjordens_Service_ver2.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Fjordens_Service_ver2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            HomeViewModel viewModel = null;
            using (ICustomerRepository _customerRepo = new CustomerRepository(ApplicationDbContext.Create()))
            using (IEmployeeRepository _employeeRepo = new EmployeeRepository(ApplicationDbContext.Create()))
            using(IPostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
            {
                List<Template> templates = new List<Template>();
                for(int i = 1; i < 3; i++)
                {
                    Template template = new Template()
                    {
                        TemplateId = i,
                        TemplateName = "Template - Uge " + i
                    };
                    templates.Add(template);
                }

                var employees = _employeeRepo.All();
                List<EmployeeHelpModel> employeeHelpModels = new List<EmployeeHelpModel>();
                EmployeeHelpModel all = new EmployeeHelpModel()
                {
                    Id = -1,
                    Name = "Alle"
                };
                employeeHelpModels.Add(all);
                foreach (var employee in employees)
                {
                    EmployeeHelpModel helpModel = new EmployeeHelpModel()
                    {
                        Id = employee.EmployeeId,
                        Name = employee.Name
                    };
                    employeeHelpModels.Add(helpModel);
                }


                viewModel = new HomeViewModel()
                {
                    Customers = _customerRepo.All().ToList(),
                    Employees = employees.ToList(),
                    EmployeesList2 = employeeHelpModels,
                    Templates = templates
                };
            }
            return View(viewModel);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}