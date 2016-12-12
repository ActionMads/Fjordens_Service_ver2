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

        public ActionResult FileUpload(HttpPostedFileBase file, int id)
        {
            if(file != null)
            {
                try
                {
                    string targetFolder = Server.MapPath("~/Content/images/employees");
                    string pic = System.IO.Path.GetFileName(file.FileName);
                    string path = System.IO.Path.Combine(targetFolder, pic);
                    string dbPath = "/Content/images/employees/" + pic;

                    file.SaveAs(path);
                    using(IEmployeeRepository _employeeRepo = new EmployeeRepository(ApplicationDbContext.Create()))
                    {
                        var employee = _employeeRepo.Find(id);
                        employee.ImgPath = dbPath;
                        _employeeRepo.Update(employee);
                        _employeeRepo.Save();
                    }
                }
                catch (Exception)
                {

                }
            }
            return RedirectToAction("Index");
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
                    employee.ImgPath = "/Content/images/employees/blank-profile-md.jpg";
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
            using (IPostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
            {
                var postItsForEmployee = _postItRepo.AllForEmployee(id).ToList();
                foreach(var postIt in postItsForEmployee)
                {
                    postIt.IsAssigned = false;
                    _postItRepo.Update(postIt);
                    _postItRepo.Save();
                }

                _employeeRepo.Delete(id);
                _employeeRepo.Save();
                return RedirectToAction("Index");
            }
        }
    }
}