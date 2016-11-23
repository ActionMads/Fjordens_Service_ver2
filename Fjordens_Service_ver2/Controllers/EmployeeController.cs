using Fjordens_Service_ver2.DAL.Contracts;
using Fjordens_Service_ver2.DAL.Repositories;
using Fjordens_Service_ver2.Models;
using Fjordens_Service_ver2.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Fjordens_Service_ver2.Controllers
{
    public class EmployeeController : Controller
    {
        // GET: Employee
        public ActionResult Index()
        {
            using(IEmployeeRepository _employeeRepo = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                EmployeesViewModel viewModel = new EmployeesViewModel()
                {
                    Employees = _employeeRepo.All().ToList()
                };
                return View(viewModel);
            }
            
        }
        [HttpGet]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(Employee employee)
        {
            if (ModelState.IsValid)
            {
                using (IEmployeeRepository _employeeRepo = new EmployeeRepository(ApplicationDbContext.Create()))
                {
                    _employeeRepo.Insert(employee);
                    _employeeRepo.Save();
                    return RedirectToAction("Index");
                }
            }
            
            return View(employee);
        }

        [HttpGet]
        public ActionResult Update(int id)
        {
            using (IEmployeeRepository _employeeRepo = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                Employee employee = _employeeRepo.Find(id);
                return View(employee);
            }
        }

        [HttpPost]
        public ActionResult Update(Employee employee)
        {
            if (ModelState.IsValid)
            {
                using (IEmployeeRepository _employeeRepo = new EmployeeRepository(ApplicationDbContext.Create()))
                {
                    _employeeRepo.Update(employee);
                    _employeeRepo.Save();
                    return RedirectToAction("Index");
                }
            }

            return View(employee);
        }

        public ActionResult Delete(int id)
        {
            using (IEmployeeRepository _employeeRepo = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                _employeeRepo.Delete(id);
                _employeeRepo.Save();
                return RedirectToAction("Index");
            }
        }
    }
}